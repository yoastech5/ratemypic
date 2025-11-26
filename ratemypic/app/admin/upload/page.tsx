import Link from 'next/link'
import UploadForm from '@/components/UploadForm'
import BackButton from '@/components/BackButton'

export default function AdminUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/admin/upload" className="text-2xl font-bold text-blue-600">
              RateMyPic Admin
            </Link>
            <div className="flex gap-4">
              <Link href="/admin/upload" className="text-blue-600 font-semibold">
                Upload Photo
              </Link>
              <Link href="/admin/photos" className="text-gray-700 hover:text-blue-600">
                Manage Photos
              </Link>
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
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

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-4xl font-bold mb-8">Upload Photo</h1>
        <UploadForm />
      </div>
    </div>
  )
}
