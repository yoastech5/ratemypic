import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

export default async function RandomPage() {
  const supabase = await createClient()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('status', 'public')

  const randomPhoto = photos && photos.length > 0 
    ? photos[Math.floor(Math.random() * photos.length)]
    : null

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
                <Link
                  href="/random"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Show Another Random Photo
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
