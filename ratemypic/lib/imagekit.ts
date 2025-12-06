import ImageKit from 'imagekit'

// Server-side ImageKit instance
export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
})

// Client-side ImageKit URL builder
export const getImageKitUrl = (
  path: string,
  transformations?: {
    width?: number
    height?: number
    quality?: number
    format?: string
  }
) => {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''
  
  if (!transformations) {
    return `${urlEndpoint}${path}`
  }

  const params = []
  if (transformations.width) params.push(`w-${transformations.width}`)
  if (transformations.height) params.push(`h-${transformations.height}`)
  if (transformations.quality) params.push(`q-${transformations.quality}`)
  if (transformations.format) params.push(`f-${transformations.format}`)

  const transformation = params.length > 0 ? `tr:${params.join(',')}` : ''
  
  return `${urlEndpoint}${transformation ? `/${transformation}` : ''}${path}`
}
