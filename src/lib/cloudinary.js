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

  if (import.meta.env.DEV) {
    console.log('[Cloudinary] Starting upload...')
    console.log('[Cloudinary] Cloud Name:', cloudName)
    console.log('[Cloudinary] File:', file.name, file.size, file.type)
  }

  let res
  try {
    // Add 60 second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)

    res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (import.meta.env.DEV) {
      console.log('[Cloudinary] Response status:', res.status)
    }
  } catch (networkErr) {
    let message = 'Upload failed'

    if (networkErr.name === 'AbortError') {
      message = 'Upload timed out. Please check your connection and try again'
    } else {
      message =
        (networkErr && (networkErr.message || networkErr.toString?.())) ||
        'Network error'
    }

    if (import.meta.env.DEV) {
      console.error('[Cloudinary] Network error:', networkErr)
    }

    throw new Error(message)
  }

  let data
  try {
    data = await res.json()
  } catch (jsonErr) {
    if (import.meta.env.DEV) {
      console.error('[Cloudinary] Failed to parse response:', jsonErr)
    }
    throw new Error('Server returned invalid response')
  }

  if (!res.ok) {
    let message = `Upload failed (${res.status})`

    if (data?.error?.message) {
      message = data.error.message
    } else if (data?.error) {
      message = String(data.error)
    }

    if (import.meta.env.DEV) {
      console.error('[Cloudinary] Upload error:', data)
    }

    throw new Error(message)
  }

  if (!data?.secure_url) {
    if (import.meta.env.DEV) {
      console.error('[Cloudinary] Missing secure_url:', data)
    }
    throw new Error('Server response did not contain image URL')
  }

  if (import.meta.env.DEV) {
    console.log('[Cloudinary] Upload successful:', data.secure_url)
  }

  return data.secure_url
}
