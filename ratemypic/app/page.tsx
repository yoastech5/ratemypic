import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PhotoCard from '@/components/PhotoCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get all public photos
  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('status', 'public')
    .order('created_at', { ascending: false })
    .limit(50)

  // Get user's ratings if logged in
  let userRatings: Record<string, number> = {}
  if (user) {
    const { data: ratings } = await supabase
      .from('ratings')
      .select('photo_id, rating_value')
      .eq('user_id', user.id)
    
    if (ratings) {
      userRatings = ratings.reduce((acc, r) => {
        acc[r.photo_id] = r.rating_value
        return acc
      }, {} as Record<string, number>)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl font-bold text-gray-900">
              <span className="text-2xl sm:text-3xl">📸</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RateMyPic
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 lg:gap-8 items-center">
              <Link href="/top" className="text-gray-600 hover:text-gray-900 font-medium transition flex items-center gap-1">
                <span>🏆</span> <span className="hidden lg:inline">Top</span>
              </Link>
              <Link href="/trending" className="text-gray-600 hover:text-gray-900 font-medium transition flex items-center gap-1">
                <span>🔥</span> <span className="hidden lg:inline">Trending</span>
              </Link>
              <Link href="/random" className="text-gray-600 hover:text-gray-900 font-medium transition flex items-center gap-1">
                <span>🎲</span> <span className="hidden lg:inline">Random</span>
              </Link>
              {user ? (
                <form action="/auth/signout" method="post">
                  <button className="text-gray-600 hover:text-gray-900 font-medium transition">
                    Sign Out
                  </button>
                </form>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all text-sm lg:text-base">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden gap-3 items-center">
              {user ? (
                <form action="/auth/signout" method="post">
                  <button className="text-gray-600 hover:text-gray-900 font-medium transition text-sm">
                    Sign Out
                  </button>
                </form>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition text-sm">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Nav */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex justify-around py-2">
            <Link href="/top" className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 transition py-2 px-4">
              <span className="text-xl">🏆</span>
              <span className="text-xs font-medium">Top</span>
            </Link>
            <Link href="/trending" className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 transition py-2 px-4">
              <span className="text-xl">🔥</span>
              <span className="text-xs font-medium">Trending</span>
            </Link>
            <Link href="/random" className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 transition py-2 px-4">
              <span className="text-xl">🎲</span>
              <span className="text-xs font-medium">Random</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 text-balance leading-tight">
            Discover Amazing Photos
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 opacity-95 max-w-2xl mx-auto text-balance px-4">
            Rate, explore, and share the best photography from around the world
          </p>
          {!user && (
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl"
            >
              <span className="hidden sm:inline">Join Now - It's Free</span>
              <span className="sm:hidden">Join Free</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Photo Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 pb-20 md:pb-16">
        {!photos || photos.length === 0 ? (
          <div className="text-center py-20 sm:py-32">
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">📷</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">No photos yet</h2>
            <p className="text-base sm:text-lg text-gray-600">Check back soon for amazing content!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10 gap-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Latest Photos</h2>
              <p className="text-sm sm:text-base text-gray-600">{photos.length} {photos.length === 1 ? 'photo' : 'photos'}</p>
            </div>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {photos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  userRating={userRatings[photo.id] || null}
                  isLoggedIn={!!user}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer CTA */}
      {!user && photos && photos.length > 0 && (
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-12 sm:py-16 md:py-20 mt-12 sm:mt-16 md:mt-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Ready to Rate?</h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 opacity-95">
              Join our community and start rating amazing photos today
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl"
            >
              Sign Up Now
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 mt-12 sm:mt-16 md:mt-20 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-white mb-2">📸 RateMyPic</p>
            <p className="text-xs sm:text-sm">© 2025 RateMyPic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
