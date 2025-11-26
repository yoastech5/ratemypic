import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      // Redirect to login with error message
      return NextResponse.redirect(
        new URL('/login?error=Authentication failed. Please try again.', requestUrl.origin)
      )
    }
  }

  // Redirect to home page or specified next page after successful authentication
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
