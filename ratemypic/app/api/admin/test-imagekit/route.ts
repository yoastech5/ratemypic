import { createClient } from '@/lib/supabase/server'
import { imagekit, isImageKitConfigured } from '@/lib/imagekit'
import { NextResponse } from 'next/server'

export async function GET() {
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

    // Test ImageKit configuration
    const configured = isImageKitConfigured()
    
    const debug = {
      isConfigured: configured,
      hasPublicKey: !!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
      hasUrlEndpoint: !!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY?.substring(0, 20) + '...',
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    }

    // Try to list files from ImageKit
    let imagekitTest = null
    if (configured) {
      try {
        const files = await imagekit.listFiles({
          limit: 1,
        })
        imagekitTest = {
          success: true,
          message: 'ImageKit connection successful!',
          filesCount: files.length,
        }
      } catch (error: any) {
        imagekitTest = {
          success: false,
          error: error.message,
          details: error.toString(),
        }
      }
    }

    return NextResponse.json({
      debug,
      imagekitTest,
      recommendation: configured 
        ? 'ImageKit is configured. Check imagekitTest for connection status.'
        : 'ImageKit is NOT configured. Check environment variables.',
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error.message 
    }, { status: 500 })
  }
}
