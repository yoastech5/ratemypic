import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function StoragePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Check if user is admin
  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!adminRole || adminRole.role !== 'admin') {
    redirect('/')
  }

  // Get all photos
  const { data: photos } = await supabase
    .from('photos')
    .select('photo_url')

  const imagekitPhotos = photos?.filter(p => p.photo_url.includes('imagekit.io')) || []
  const supabasePhotos = photos?.filter(p => !p.photo_url.includes('imagekit.io')) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              RateMyPic Admin
            </Link>
            <div className="flex gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/photos" className="text-gray-600 hover:text-gray-900">
                Photos
              </Link>
              <Link href="/admin/upload" className="text-gray-600 hover:text-gray-900">
                Upload
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">📊 Storage Statistics</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* ImageKit Stats */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🚀</span>
              <h2 className="text-2xl font-bold">ImageKit</h2>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{imagekitPhotos.length}</p>
              <p className="text-sm opacity-90">Photos stored</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs opacity-75">✅ Optimized & CDN</p>
              </div>
            </div>
          </div>

          {/* Supabase Stats */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">📦</span>
              <h2 className="text-2xl font-bold">Supabase</h2>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{supabasePhotos.length}</p>
              <p className="text-sm opacity-90">Photos stored</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs opacity-75">📦 Standard storage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4">Total Storage</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">ImageKit</span>
                <span className="text-sm font-medium">
                  {photos && photos.length > 0 
                    ? Math.round((imagekitPhotos.length / photos.length) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-600 h-4 rounded-full transition-all"
                  style={{ 
                    width: photos && photos.length > 0 
                      ? `${(imagekitPhotos.length / photos.length) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent ImageKit Photos */}
        {imagekitPhotos.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">🚀 Recent ImageKit Photos</h3>
            <div className="space-y-2">
              {imagekitPhotos.slice(0, 5).map((photo, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">✅</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{photo.photo_url}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
