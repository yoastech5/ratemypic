import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

export default async function TrendingPage() {
  const supabase = await createClient()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('status', 'public')
    .order('total_ratings', { ascending: false })
    .limit(20)

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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-4xl font-bold mb-8">🔥 Trending Photos</h1>

        {!photos || photos.length === 0 ? (
          <p className="text-gray-600">No photos available yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative w-full h-64">
                  <Image
                    src={photo.photo_url}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{photo.title}</h2>
                  {photo.description && (
                    <p className="text-gray-600 text-sm mb-3">{photo.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {photo.rating_average.toFixed(1)}/10
                    </span>
                    <span className="text-sm text-gray-500">
                      {photo.total_ratings} ratings
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
