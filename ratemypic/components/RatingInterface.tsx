'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Photo {
  id: string
  photo_url: string
  title: string
  description: string | null
  rating_average: number
  total_ratings: number
}

export default function RatingInterface({ photo, userId }: { photo: Photo; userId: string }) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRate = async (rating: number) => {
    setSelectedRating(rating)
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo_id: photo.id,
          rating_value: rating,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit rating')
        setIsSubmitting(false)
        return
      }

      // Refresh to get next photo
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err) {
      setError('Failed to submit rating')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              RateMyPic
            </a>
            <form action="/auth/signout" method="post">
              <button className="text-gray-700 hover:text-blue-600">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative w-full h-96 md:h-[600px]">
            <Image
              src={photo.photo_url}
              alt={photo.title}
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{photo.title}</h1>
            {photo.description && (
              <p className="text-gray-600 mb-4">{photo.description}</p>
            )}

            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
              <span>Average: {photo.rating_average.toFixed(1)}/10</span>
              <span>•</span>
              <span>{photo.total_ratings} ratings</span>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {isSubmitting && selectedRating ? (
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  Rating submitted: {selectedRating}/10
                </div>
                <p className="text-gray-600">Loading next photo...</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Rate this photo:</h2>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRate(rating)}
                      disabled={isSubmitting}
                      className="aspect-square bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
