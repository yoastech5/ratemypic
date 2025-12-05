'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OTPLoginV2Page() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // State variables
  const [email, setEmail] = useState('') // User's email address
  const [otp, setOtp] = useState('') // Token entered by user
  const [loading, setLoading] = useState(false) // Loading state for buttons
  const [codeSent, setCodeSent] = useState(false) // Track if code was sent
  const [message, setMessage] = useState('') // Success messages
  const [error, setError] = useState('') // Error messages

  // Function to send OTP code to user's email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Send OTP using Supabase signInWithOtp
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true, // Create user if doesn't exist
        },
      })

      if (error) throw error

      // Success - code sent
      setCodeSent(true)
      setMessage(
        '✓ Check your email! We sent you a login code. You can either click the link or copy the token from the URL.'
      )
    } catch (error: any) {
      setError(error.message || 'Failed to send code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Function to verify the OTP code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Verify OTP using Supabase verifyOtp
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email',
      })

      if (error) throw error

      if (data.user) {
        // Success - user is logged in
        setMessage('✓ Login successful! Redirecting...')

        // Redirect to dashboard after 1 second
        setTimeout(() => {
          router.push('/rate')
          router.refresh()
        }, 1000)
      }
    } catch (error: any) {
      setError(
        error.message ||
          'Invalid or expired code. Please try again or request a new code.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Function to resend code
  const handleResendCode = async () => {
    setOtp('') // Clear previous code
    await handleSendCode({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {codeSent ? 'Enter Code' : 'Login with Email'}
          </h1>
          <p className="text-gray-600">
            {codeSent
              ? 'Check your email for the login code'
              : 'Get a secure login code sent to your email'}
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{message}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Step 1: Email Input Form */}
        {!codeSent && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification Form */}
        {codeSent && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label
                htmlFor="email-display"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email-display"
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">
                📧 How to get your code:
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>
                  <strong>Option 1:</strong> Click the link to auto-login
                </li>
                <li>
                  <strong>Option 2:</strong> Copy the token from the email link
                  URL
                </li>
                <li>Paste the token below</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">
                The token looks like: abc123def456 or 123456
              </p>
            </div>

            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Login Token / Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                placeholder="Enter token or code"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-center font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste the full token from your email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            {/* Resend Code Button */}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="w-full text-purple-600 hover:text-purple-700 font-medium py-2 transition disabled:opacity-50"
            >
              Resend Code
            </button>

            {/* Change Email Button */}
            <button
              type="button"
              onClick={() => {
                setCodeSent(false)
                setOtp('')
                setError('')
                setMessage('')
              }}
              className="w-full text-gray-600 hover:text-gray-700 font-medium py-2 transition"
            >
              Change Email
            </button>
          </form>
        )}

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign up
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Or{' '}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              login with password
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
