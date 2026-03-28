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

  // Validate file
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 10MB')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only images are allowed')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  // Always log (for production debugging)
  console.log('[Cloudinary] Starting upload...')
  console.log('[Cloudinary] Endpoint:', endpoint)
  console.log('[Cloudinary] File:', file.name, file.size, file.type)

  let res
  try {
    // Increase timeout to 120 seconds for slower networks
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.error('[Cloudinary] Upload timeout after 120s')
      controller.abort()
    }, 120000)

    console.log('[Cloudinary] Initiating fetch request...')
    
    res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    console.log('[Cloudinary] Response status:', res.status, res.statusText)
  } catch (networkErr) {
    let message = 'Upload failed'

    if (networkErr.name === 'AbortError') {
      message = 'Upload timed out (120s). Your connection might be slow. Please try again.'
    } else {
      message =
        (networkErr && (networkErr.message || networkErr.toString?.())) ||
        'Network error'
    }

    console.error('[Cloudinary] Network error:', networkErr.name, networkErr.message)
    throw new Error(message)
  }

  let data
  try {
    data = await res.json()
    console.log('[Cloudinary] Response data:', data)
  } catch (jsonErr) {
    console.error('[Cloudinary] Failed to parse response:', jsonErr)
    throw new Error('Server returned invalid response')
  }

  if (!res.ok) {
    let message = `Upload failed (${res.status})`

    if (data?.error?.message) {
      message = data.error.message
    } else if (data?.error) {
      message = String(data.error)
    }

    console.error('[Cloudinary] Upload error response:', { status: res.status, data })
    throw new Error(message)
  }

  if (!data?.secure_url) {
    console.error('[Cloudinary] Missing secure_url in response:', data)
    throw new Error('Server response did not contain image URL')
  }

  console.log('[Cloudinary] Upload successful:', data.secure_url)
  return data.secure_url
}
