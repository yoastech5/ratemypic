import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

export default async function TopPage() {
  const supabase = await createClient()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('status', 'public')
    .gte('total_ratings', 1)
    .order('rating_average', { ascending: false })
    .limit(20)

  // Medal colors for top 3
  const getMedalStyle = (index: number) => {
    if (index === 0) return 'from-yellow-400 via-yellow-500 to-yellow-600' // Gold
    if (index === 1) return 'from-gray-300 via-gray-400 to-gray-500' // Silver
    if (index === 2) return 'from-orange-400 via-orange-500 to-orange-600' // Bronze
    return 'from-blue-500 to-purple-600' // Regular
  }

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return '🏅'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Premium Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b-2 border-yellow-400 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-3xl">📸</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RateMyPic
              </span>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold shadow-lg">
              <span className="text-lg">👑</span>
              <span className="hidden sm:inline">PRO</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-5xl sm:text-6xl">🏆</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
                Top Rated
              </h1>
            </div>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto">
              The highest-rated photos chosen by our community
            </p>
            {photos && photos.length > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-2xl font-bold">{photos.length}</span>
                <span className="text-sm font-medium">Premium Photos</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!photos || photos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Top Photos Yet</h2>
            <p className="text-gray-600">Be the first to rate photos and create the leaderboard!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                  index < 3 ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                {/* Rank Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${getMedalStyle(
                      index
                    )} text-white rounded-full font-bold shadow-lg`}
                  >
                    <span className="text-xl">{getMedalEmoji(index)}</span>
                    <span className="text-lg">#{index + 1}</span>
                  </div>
                </div>

                {/* PRO Badge for Top 3 */}
                {index < 3 && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                      ⭐ TOP
                    </div>
                  </div>
                )}

                {/* Photo */}
                <div className="relative w-full h-64 sm:h-72 bg-gray-100">
                  <Image
                    src={photo.photo_url}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1">
                    {photo.title}
                  </h2>
                  {photo.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {photo.description}
                    </p>
                  )}

                  {/* Rating Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                          {photo.rating_average.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">/10</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <span className="text-lg">⭐</span>
                      <span className="text-sm font-medium">
                        {photo.total_ratings} {photo.total_ratings === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/rate?photo=${photo.id}`}
                    className="mt-4 w-full block text-center py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                  >
                    View & Rate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Footer */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">🏆 Top Rated Collection</p>
          <p className="text-sm opacity-90">
            Only the best photos make it to this exclusive list
          </p>
        </div>
      </div>
    </div>
  )
}
