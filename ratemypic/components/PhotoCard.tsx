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
  rating_average: number
  total_ratings: number
}

export default function PhotoCard({ photo, userRating, isLoggedIn }: { 
  photo: Photo
  userRating: number | null
  isLoggedIn: boolean 
}) {
  const [selectedRating, setSelectedRating] = useState<number | null>(userRating)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRatingButtons, setShowRatingButtons] = useState(false)
  const [localRatingAvg, setLocalRatingAvg] = useState(photo.rating_average)
  const [localTotalRatings, setLocalTotalRatings] = useState(photo.total_ratings)
  const router = useRouter()

  const handleRate = async (rating: number) => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    if (selectedRating !== null) {
      return // Already rated
    }

    setIsSubmitting(true)

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

      if (response.ok) {
        setSelectedRating(rating)
        setShowRatingButtons(false)
        
        // Update local stats immediately
        const newTotal = localTotalRatings + 1
        const newAvg = ((localRatingAvg * localTotalRatings) + rating) / newTotal
        setLocalRatingAvg(newAvg)
        setLocalTotalRatings(newTotal)
        
        // Force page refresh to get server data
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to rate:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative w-full aspect-[3/4] group overflow-hidden bg-gray-100">
        <Image
          src={photo.photo_url}
          alt={photo.title}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm mb-1 text-gray-900 line-clamp-1">{photo.title}</h3>
        
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {localRatingAvg > 0 ? localRatingAvg.toFixed(1) : 'N/A'}
          </span>
          <span className="text-gray-400 text-xs">/10</span>
          <span className="text-gray-500 text-xs">
            ({localTotalRatings})
          </span>
        </div>

        {/* Rating Section */}
        {isLoggedIn ? (
          selectedRating !== null ? (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center mb-2">
                <p className="text-green-700 font-semibold text-xs">
                  ✓ Rated {selectedRating}/10
                </p>
              </div>
              <button
                onClick={async () => {
                  if (confirm('Remove your rating?')) {
                    try {
                      const response = await fetch('/api/rate/delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ photo_id: photo.id }),
                      })
                      if (response.ok) {
                        window.location.reload()
                      }
                    } catch (error) {
                      console.error('Failed to delete rating:', error)
                    }
                  }
                }}
                className="w-full bg-gray-100 text-gray-700 py-1.5 rounded-lg font-semibold hover:bg-gray-200 transition-all text-xs"
              >
                Change
              </button>
            </div>
          ) : showRatingButtons ? (
            <div>
              <div className="grid grid-cols-5 gap-1 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    disabled={isSubmitting}
                    className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs rounded transition-all disabled:opacity-50"
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRatingButtons(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRatingButtons(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-bold hover:shadow-lg transition-all text-xs"
            >
              Rate
            </button>
          )
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-xs"
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}
