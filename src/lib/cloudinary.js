const getRequiredEnv = (key) => {
  const value = import.meta?.env?.[key]
  if (!value) {
    throw new Error(`Missing required env var: ${key}`)
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

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      (data && (data.error?.message || data.error?.toString?.())) ||
      `Cloudinary upload failed (${res.status})`
    throw new Error(message)
  }

  if (!data?.secure_url) {
    throw new Error('Cloudinary response missing secure_url')
  }

  return data.secure_url
}
