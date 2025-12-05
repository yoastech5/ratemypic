'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Image from 'next/image'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

export default function RandomPage() {
  const [photos, setPhotos] = useState<any[]>([])
  const [randomPhoto, setRandomPhoto] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadPhotos = async () => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('status', 'public')
    
    if (data && data.length > 0) {
      setPhotos(data)
      setRandomPhoto(data[Math.floor(Math.random() * data.length)])
    }
    setLoading(false)
  }

  const showAnotherRandom = () => {
    if (photos.length > 0) {
      setRandomPhoto(photos[Math.floor(Math.random() * photos.length)])
    }
  }

  useEffect(() => {
    loadPhotos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎲</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              RateMyPic
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-4xl font-bold mb-8">🎲 Random Photo</h1>

        {!randomPhoto ? (
          <p className="text-gray-600">No photos available yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full h-96 md:h-[600px]">
              <Image
                src={randomPhoto.photo_url}
                alt={randomPhoto.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-2">{randomPhoto.title}</h2>
              {randomPhoto.description && (
                <p className="text-gray-600 mb-4">{randomPhoto.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {randomPhoto.rating_average.toFixed(1)}/10
                </span>
                <span className="text-gray-500">
                  {randomPhoto.total_ratings} ratings
                </span>
              </div>
              <div className="mt-6">
                <button
                  onClick={showAnotherRandom}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  🎲 Show Another Random Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
