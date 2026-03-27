const getRequiredEnv = (key) => {
  const env = import.meta?.env
  let value

  switch (key) {
  case 'VITE_CLOUDINARY_CLOUD_NAME':
    value = env?.VITE_CLOUDINARY_CLOUD_NAME
    break
  case 'VITE_CLOUDINARY_UPLOAD_PRESET':
    value = env?.VITE_CLOUDINARY_UPLOAD_PRESET
    break
  default:
    value = env?.[key]
    break
  }

  if (!value) {
    const viteKeys = Object.keys(env || {}).filter((k) => k.startsWith('VITE_'))
    const hint = viteKeys.length ? ` (VITE_ keys loaded: ${viteKeys.join(', ')})` : ''
    throw new Error(`Missing required env var: ${key}${hint}`)
  }
  return value
}

export const uploadImageToCloudinary = async (file, options = {}) => {
  if (!file) {
    throw new Error('No file provided')
  }

  const cloudName = options.cloudName || getRequiredEnv('VITE_CLOUDINARY_CLOUD_NAME')
  const uploadPreset =
    options.uploadPreset || getRequiredEnv('VITE_CLOUDINARY_UPLOAD_PRESET')

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  let res
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    })
  } catch (networkErr) {
    const message =
      (networkErr && (networkErr.message || networkErr.toString?.())) ||
      'unknown network error'
    throw new Error(`Cloudinary request failed: ${message}`)
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      (data && (data.error?.message || data.error?.toString?.())) ||
      `Cloudinary upload failed (${res.status})`
    throw new Error(`${message} [endpoint=${endpoint}, preset=${uploadPreset}]`)
  }

  if (!data?.secure_url) {
    throw new Error('Cloudinary response missing secure_url')
  }

  return data.secure_url
}
