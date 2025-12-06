import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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

    const { photo_url, title, description, category } = await request.json()

    if (!photo_url || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(photo_url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Check if URL is an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
    const urlLower = photo_url.toLowerCase()
    const isImageUrl = imageExtensions.some(ext => urlLower.includes(ext)) || 
                       urlLower.includes('image') ||
                       urlLower.includes('photo')

    if (!isImageUrl) {
      return NextResponse.json({ 
        error: 'URL does not appear to be an image. Please use a direct image link.' 
      }, { status: 400 })
    }

    // Insert photo record with external URL
    const { error: insertError } = await supabase
      .from('photos')
      .insert({
        photo_url: photo_url,
        title,
        description: description || null,
        category: category || null,
        status: 'public',
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create photo record' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      imageUrl: photo_url,
      storage: 'url'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
