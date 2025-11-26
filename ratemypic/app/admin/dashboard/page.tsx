import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import UploadForm from '@/components/UploadForm'
import BackButton from '@/components/BackButton'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: ratings } = await supabase
    .from('ratings')
    .select('*')

  const { data: users } = await supabase.auth.admin.listUsers()

  const totalPhotos = photos?.length || 0
  const totalRatings = ratings?.length || 0
  const activeUsers = users?.users?.length || 0

  const bestPhoto = photos?.reduce((best, photo) => 
    photo.rating_average > (best?.rating_average || 0) ? photo : best
  , photos[0])

  const worstPhoto = photos?.reduce((worst, photo) => 
    photo.total_ratings > 0 && photo.rating_average < (worst?.rating_average || 10) ? photo : worst
  , photos?.find(p => p.total_ratings > 0))

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/admin/dashboard" className="text-2xl font-bold text-blue-600">
              Admin Dashboard
            </Link>
            <div className="flex gap-4">
              <Link href="/admin/upload" className="text-gray-700 hover:text-blue-600">
                Upload Photo
              </Link>
              <Link href="/admin/photos" className="text-gray-700 hover:text-blue-600">
                Manage Photos
              </Link>
              <form action="/auth/signout" method="post">
                <button className="text-gray-700 hover:text-blue-600">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Photos</h3>
            <p className="text-4xl font-bold text-blue-600">{totalPhotos}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Ratings</h3>
            <p className="text-4xl font-bold text-green-600">{totalRatings}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Active Users</h3>
            <p className="text-4xl font-bold text-purple-600">{activeUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Avg Rating</h3>
            <p className="text-4xl font-bold text-orange-600">
              {photos && photos.length > 0
                ? (photos.reduce((sum, p) => sum + p.rating_average, 0) / photos.length).toFixed(1)
                : '0.0'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">🏆 Best Rated Photo</h2>
            {bestPhoto && bestPhoto.total_ratings > 0 ? (
              <div>
                <p className="font-semibold">{bestPhoto.title}</p>
                <p className="text-2xl font-bold text-green-600">
                  {bestPhoto.rating_average.toFixed(1)}/10
                </p>
                <p className="text-sm text-gray-500">{bestPhoto.total_ratings} ratings</p>
              </div>
            ) : (
              <p className="text-gray-500">No ratings yet</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">📉 Worst Rated Photo</h2>
            {worstPhoto && worstPhoto.total_ratings > 0 ? (
              <div>
                <p className="font-semibold">{worstPhoto.title}</p>
                <p className="text-2xl font-bold text-red-600">
                  {worstPhoto.rating_average.toFixed(1)}/10
                </p>
                <p className="text-sm text-gray-500">{worstPhoto.total_ratings} ratings</p>
              </div>
            ) : (
              <p className="text-gray-500">No ratings yet</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">📤 Upload New Photo</h2>
          <UploadForm />
        </div>
      </div>
    </div>
  )
}
