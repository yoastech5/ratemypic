import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PhotoManagement from '@/components/PhotoManagement'
import BackButton from '@/components/BackButton'

export default async function AdminPhotosPage() {
  const supabase = await createClient()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/admin/dashboard" className="text-2xl font-bold text-blue-600">
              Admin Dashboard
            </Link>
            <div className="flex gap-4">
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/admin/upload" className="text-gray-700 hover:text-blue-600">
                Upload Photo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-4xl font-bold mb-8">Manage Photos</h1>
        <PhotoManagement photos={photos || []} />
      </div>
    </div>
  )
}
