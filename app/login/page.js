/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { FiX } from 'react-icons/fi'
import { FaGithub } from 'react-icons/fa'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGitHubSignIn = async () => {
    try {
      setIsSubmitting(true)
      await signIn('github', { callbackUrl: '/' })
    } catch (error) {
      console.error('Failed to initiate login:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[75vh] sm:min-h-[80vh] px-3 sm:px-4 py-8 sm:py-14">
      {/* Sign In Window Card */}
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-[#14213D] border border-[#3D5A80]/50 rounded-xl shadow-md text-white">
        {/* Close Button (Window Dismiss) */}
        <Link
          href="/"
          aria-label="Close and return to home"
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-[#182746] hover:bg-[#1f3156] text-[#D9D4C6] hover:text-white border border-[#3D5A80]/50 transition cursor-pointer"
        >
          <FiX className="w-4 h-4" />
        </Link>

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Sign In
          </h1>

          <p className="text-sm text-[#D9D4C6]/85 mt-2 leading-relaxed">
            Sign in to collaborate and solve societal challenges together.
          </p>
        </div>

        {/* Dynamic State: Signed In vs Signed Out */}
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-8 h-8 border-2 border-[#E8A33D] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-[#D9D4C6]/75">Verifying session...</p>
          </div>
        ) : session ? (
          <div className="space-y-6 text-center">
            <div className="p-5 rounded-lg bg-[#182746] border border-[#3D5A80]/40">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User Avatar'}
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-[#E8A33D] object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-[#3D5A80] border-2 border-[#E8A33D] flex items-center justify-center text-xl font-bold font-serif text-[#E8A33D]">
                  {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                </div>
              )}
              <h2 className="text-base sm:text-lg font-serif font-semibold text-white">
                {session.user?.name || 'Welcome!'}
              </h2>
              <p className="text-xs text-[#D9D4C6]/80 mt-1">{session.user?.email}</p>
              <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium bg-emerald-950/30 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Currently signed in
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="w-full py-2.5 px-4 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-semibold text-sm transition shadow-sm active:scale-[0.99] text-center"
              >
                Go to Homepage
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full py-2.5 px-4 rounded-lg bg-[#182746] hover:bg-[#1f3156] text-white/90 hover:text-white font-medium text-sm border border-[#3D5A80]/50 transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3D5A80]/40"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#14213D] px-3.5 text-[#D9D4C6]/70 font-medium tracking-wider text-[11px]">
                  Continue with
                </span>
              </div>
            </div>

            {/* GitHub OAuth Button */}
            <button
              onClick={handleGitHubSignIn}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] active:scale-[0.99] text-[#14213D] font-semibold text-sm transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#14213D] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaGithub className="w-5 h-5" />
              )}
              <span>{isSubmitting ? 'Connecting to GitHub...' : 'Continue with GitHub'}</span>
            </button>

            {/* Switch to Sign Up */}
            <div className="text-center pt-3 border-t border-[#3D5A80]/40">
              <p className="text-xs text-[#D9D4C6]/85">
                New to Jan Samadhaan Setu?{' '}
                <Link
                  href="/signup"
                  className="text-[#E8A33D] hover:text-[#f3b558] font-semibold hover:underline transition"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Privacy & Terms */}
            <p className="text-center text-[11px] text-[#D9D4C6]/60 leading-relaxed">
              By proceeding, you agree to our Terms of Service and acknowledge our Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
