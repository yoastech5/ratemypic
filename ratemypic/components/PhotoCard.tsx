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
    <div className="break-inside-avoid bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="relative w-full group">
        <Image
          src={photo.photo_url}
          alt={photo.title}
          width={500}
          height={500}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">{photo.title}</h3>
        {photo.description && (
          <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
            {photo.description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100 gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {localRatingAvg > 0 ? localRatingAvg.toFixed(1) : 'N/A'}
              </span>
              <span className="text-gray-400 text-xs sm:text-sm">/10</span>
            </div>
            <div className="h-6 sm:h-8 w-px bg-gray-200"></div>
            <span className="text-gray-500 text-xs sm:text-sm font-medium">
              {localTotalRatings} {localTotalRatings === 1 ? 'rating' : 'ratings'}
            </span>
          </div>
        </div>

        {/* Rating Section */}
        {isLoggedIn ? (
          selectedRating !== null ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
              <p className="text-green-700 font-bold flex items-center justify-center gap-2 text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                You rated this {selectedRating}/10
              </p>
            </div>
          ) : showRatingButtons ? (
            <div>
              <p className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 text-gray-900">Rate this photo:</p>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    disabled={isSubmitting}
                    className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm rounded-md sm:rounded-lg transition-all active:scale-95 sm:hover:scale-110 disabled:opacity-50 shadow-md"
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRatingButtons(false)}
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRatingButtons(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:shadow-lg active:scale-95 sm:hover:scale-105 transition-all text-sm sm:text-base"
            >
              Rate This Photo
            </button>
          )
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:bg-gray-200 transition-all border border-gray-200 text-sm sm:text-base"
          >
            Login to Rate
          </button>
        )}

        {photo.category && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <span className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-100">
              {photo.category}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
