import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BackButton from '@/components/BackButton'

export default async function MagicLinkPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  async function sendMagicLink(formData: FormData) {
    'use server'

    const email = formData.get('email') as string

    if (!email) {
      redirect('/magic-link?error=Email is required')
    }

    const supabase = await createClient()
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://ratemypic-psi.vercel.app/auth/callback',
      },
    })

    if (error) {
      console.error('Magic link error:', error)
      redirect('/magic-link?error=Could not send magic link')
    }

    redirect('/magic-link?message=Check your email for the magic link!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="mb-4">
          <BackButton />
        </div>
        <div>
          <Link href="/" className="text-3xl font-bold block text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RateMyPic
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in with Magic Link
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We'll send you a magic link to sign in without a password
          </p>
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-xs text-center">
              💡 Magic links work once and expire after use. Request a new one each time you want to sign in.
            </p>
          </div>
        </div>

        {searchParams?.message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-700 text-sm font-medium mb-1">
                  {searchParams.message}
                </p>
                <p className="text-green-600 text-xs">
                  The link will expire after one use for security. Click the link in your email to sign in.
                </p>
              </div>
            </div>
          </div>
        )}

        {searchParams?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm text-center font-medium">
              {searchParams.error}
            </p>
          </div>
        )}

        <form className="mt-8 space-y-6" action={sendMagicLink}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              Send Magic Link
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in with password
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
