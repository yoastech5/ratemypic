import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Update photo status (hide/unhide)
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminRole || adminRole.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { photo_id, status } = await request.json()

    if (!photo_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { error } = await supabase
      .from('photos')
      .update({ status })
      .eq('id', photo_id)

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete photo
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminRole || adminRole.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { photo_id } = await request.json()

    if (!photo_id) {
      return NextResponse.json({ error: 'Missing photo_id' }, { status: 400 })
    }

    // Get photo to delete from storage
    const { data: photo } = await supabase
      .from('photos')
      .select('photo_url')
      .eq('id', photo_id)
      .single()

    if (photo) {
      // Extract filename from URL
      const urlParts = photo.photo_url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete from storage
      await supabase.storage
        .from('photos')
        .remove([fileName])
    }

    // Delete photo record (ratings will be cascade deleted)
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photo_id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
