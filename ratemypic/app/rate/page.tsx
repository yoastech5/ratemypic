import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RatingInterface from '@/components/RatingInterface'

export default async function RatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get next unrated photo for this user
  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('status', 'public')
    .order('created_at', { ascending: false })

  if (!photos || photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No photos available</h1>
          <p className="text-gray-600">Check back later for new photos to rate!</p>
        </div>
      </div>
    )
  }

  // Filter out already rated photos
  const { data: userRatings } = await supabase
    .from('ratings')
    .select('photo_id')
    .eq('user_id', user.id)

  const ratedPhotoIds = new Set(userRatings?.map(r => r.photo_id) || [])
  const unratedPhotos = photos.filter(p => !ratedPhotoIds.has(p.id))

  if (unratedPhotos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">You've rated all photos!</h1>
          <p className="text-gray-600">Great job! Check back later for new photos.</p>
        </div>
      </div>
    )
  }

  const currentPhoto = unratedPhotos[0]

  return <RatingInterface photo={currentPhoto} userId={user.id} />
}
