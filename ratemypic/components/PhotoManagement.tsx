'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Photo {
  id: string
  photo_url: string
  title: string
  description: string | null
  category: string | null
  status: string
  total_ratings: number
  rating_average: number
}

export default function PhotoManagement({ photos }: { photos: Photo[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleToggleStatus = async (photoId: string, currentStatus: string) => {
    setLoading(photoId)
    const newStatus = currentStatus === 'public' ? 'hidden' : 'public'

    try {
      const response = await fetch('/api/admin/photos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo_id: photoId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return
    }

    setLoading(photoId)

    try {
      const response = await fetch('/api/admin/photos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo_id: photoId,
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete photo:', error)
    } finally {
      setLoading(null)
    }
  }

  if (photos.length === 0) {
    return <p className="text-gray-600">No photos uploaded yet.</p>
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Photo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {photos.map((photo) => (
            <tr key={photo.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative w-16 h-16">
                  <Image
                    src={photo.photo_url}
                    alt={photo.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{photo.title}</div>
                {photo.category && (
                  <div className="text-sm text-gray-500">{photo.category}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {photo.rating_average.toFixed(1)}/10
                </div>
                <div className="text-sm text-gray-500">
                  {photo.total_ratings} ratings
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    photo.status === 'public'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {photo.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleToggleStatus(photo.id, photo.status)}
                  disabled={loading === photo.id}
                  className="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50"
                >
                  {photo.status === 'public' ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  disabled={loading === photo.id}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
