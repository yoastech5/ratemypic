import { createClient } from '@/lib/supabase/server'
import { imagekit } from '@/lib/imagekit'
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

    const formData = await request.formData()
    const photo = formData.get('photo') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    if (!photo || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert File to Buffer for ImageKit
    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to ImageKit
    const fileExt = photo.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: '/ratemypic-photos',
      useUniqueFileName: true,
      tags: ['ratemypic', category || 'uncategorized'],
    })

    if (!uploadResult || !uploadResult.url) {
      console.error('ImageKit upload failed')
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Insert photo record with ImageKit URL
    const { error: insertError } = await supabase
      .from('photos')
      .insert({
        photo_url: uploadResult.url,
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
      imageUrl: uploadResult.url,
      fileId: uploadResult.fileId 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
