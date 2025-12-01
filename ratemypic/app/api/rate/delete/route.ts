import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { photo_id } = await request.json()

    if (!photo_id) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Delete the rating
    const { error: deleteError } = await supabase
      .from('ratings')
      .delete()
      .eq('photo_id', photo_id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete rating' }, { status: 500 })
    }

    // Update photo stats
    const { data: stats } = await supabase
      .from('ratings')
      .select('rating_value')
      .eq('photo_id', photo_id)

    const total = stats?.length || 0
    const sum = stats?.reduce((acc, r) => acc + r.rating_value, 0) || 0
    const avg = total > 0 ? sum / total : 0

    await supabase
      .from('photos')
      .update({
        total_ratings: total,
        rating_sum: sum,
        rating_average: avg,
      })
      .eq('id', photo_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete rating error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
