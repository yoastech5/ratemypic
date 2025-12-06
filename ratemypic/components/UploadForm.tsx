'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadForm() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file')
  const [imageUrl, setImageUrl] = useState('')
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setError(null)

    try {
      let response
      
      if (uploadMethod === 'url') {
        // Submit as JSON for URL method
        const formData = new FormData(e.currentTarget)
        const data = {
          photo_url: imageUrl,
          title: formData.get('title'),
          description: formData.get('description'),
          category: formData.get('category'),
        }

        response = await fetch('/api/admin/upload-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      } else {
        // Submit as FormData for file upload
        const formData = new FormData(e.currentTarget)
        response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
      }

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to upload photo')
        setUploading(false)
        return
      }

      // Show success message
      const storageType = data.storage === 'imagekit' ? '✅ ImageKit' : data.storage === 'url' ? '🔗 URL' : '📦 Supabase'
      alert(`Photo added successfully!\nStorage: ${storageType}\nURL: ${data.imageUrl}`)

      router.push('/admin/photos')
    } catch (err) {
      setError('Failed to upload photo')
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Upload Method Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Upload Method
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setUploadMethod('file')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              uploadMethod === 'file'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📁 Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod('url')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              uploadMethod === 'url'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔗 Paste URL
          </button>
        </div>
      </div>

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div className="mb-4">
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
            Photo File
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {selectedFile && (
            <div className="mt-2 text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-medium mb-1">📁 {selectedFile.name}</p>
              <p>Size: {formatFileSize(selectedFile.size)}</p>
            </div>
          )}
        </div>
      )}

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Paste a direct link to an image (jpg, png, webp, etc.)
          </p>
          {imageUrl && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs font-medium text-purple-900 mb-2">Preview:</p>
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="w-full h-48 object-contain bg-gray-100 rounded"
                onError={(e) => {
                  e.currentTarget.src = ''
                  e.currentTarget.alt = 'Invalid image URL'
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          placeholder="e.g., Nature, Portrait, Architecture"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </button>
    </form>
  )
}
