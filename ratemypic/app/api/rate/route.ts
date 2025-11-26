import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { photo_id, rating_value } = await request.json()

    if (!photo_id || !rating_value || rating_value < 1 || rating_value > 10) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Check if user already rated this photo
    const { data: existingRating } = await supabase
      .from('ratings')
      .select('id')
      .eq('photo_id', photo_id)
      .eq('user_id', user.id)
      .single()

    if (existingRating) {
      return NextResponse.json(
        { error: 'You already rated this photo.' },
        { status: 400 }
      )
    }

    // Insert rating
    const { error: insertError } = await supabase
      .from('ratings')
      .insert({
        photo_id,
        user_id: user.id,
        rating_value,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Rating error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
