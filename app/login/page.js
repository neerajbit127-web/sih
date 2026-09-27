"use client"
import React, { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiX,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle
} from 'react-icons/fi'
import { FaGithub } from 'react-icons/fa'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault()
    setErrors({})

    if (!identifier.trim()) {
      setErrors({ identifier: 'Please enter your email or mobile number' })
      return
    }

    if (!password) {
      setErrors({ password: 'Password is required' })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await signIn('credentials', {
        identifier: identifier.trim(),
        password: password,
        redirect: false
      })

      if (res?.error) {
        setErrors({ form: 'Invalid credentials. Please verify and try again.' })
        setIsSubmitting(false)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      setErrors({ form: 'Login service encountered an issue. Please try again.' })
    }
  }

  const handleGitHubSignIn = async () => {
    try {
      setIsSubmitting(true)
      await signIn('github', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Failed to initiate login:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#F2EFE6] px-3 sm:px-4 flex items-center justify-center overflow-hidden font-roboto">
      <div className="relative w-full max-w-md p-5 sm:p-7 bg-[#14213D] border border-[#3D5A80]/50 rounded-xl text-white shadow-md">
        <Link
          href="/"
          aria-label="Return to home"
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-7 h-7 rounded-full bg-[#182746] hover:bg-[#1f3156] text-[#D9D4C6] hover:text-white border border-[#3D5A80]/50 transition cursor-pointer"
        >
          <FiX className="w-4 h-4" />
        </Link>

        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Sign In
          </h1>
          <p className="text-xs text-[#D9D4C6]/80 mt-1">
            Access Jan Samadhaan Setu citizen portal
          </p>
        </div>

        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2.5">
            <div className="w-7 h-7 border-2 border-[#E8A33D] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-[#D9D4C6]/75">Checking credentials...</p>
          </div>
        ) : session ? (
          <div className="space-y-4 text-center py-2">
            <div className="p-4 rounded-lg bg-[#182746] border border-[#3D5A80]/40">
              <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-[#3D5A80] border-2 border-[#E8A33D] flex items-center justify-center text-lg font-bold font-serif text-[#E8A33D]">
                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
              </div>
              <h2 className="text-base font-semibold text-white">
                {session.user?.name || 'Welcome Back!'}
              </h2>
              <p className="text-xs text-[#D9D4C6]/80 mt-0.5">{session.user?.email}</p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Active Session
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="w-full py-2 px-4 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-semibold text-xs sm:text-sm transition text-center"
              >
                Go to Citizen Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full py-2 px-4 rounded-lg bg-[#182746] hover:bg-[#1f3156] text-white/90 text-xs sm:text-sm border border-[#3D5A80]/50 transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {errors.form && (
              <div className="p-2 rounded bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
                <FiAlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{errors.form}</span>
              </div>
            )}


            <form onSubmit={handleCredentialsSignIn} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                  Email or 10-Digit Mobile
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value)
                      if (errors.identifier) setErrors({})
                    }}
                    placeholder="name@example.com or 9876543210"
                    className={`w-full bg-[#182746] border ${
                      errors.identifier ? 'border-red-400' : 'border-[#3D5A80]/50'
                    } rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition`}
                  />
                  <FiMail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                </div>
                {errors.identifier && (
                  <p className="text-[10px] text-red-300 mt-0.5">{errors.identifier}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-[#D9D4C6]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("For this prototype, enter any password or use the 1-Click Demo button above.")}
                    className="text-[10px] text-[#E8A33D] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({})
                    }}
                    placeholder="Enter your password"
                    className={`w-full bg-[#182746] border ${
                      errors.password ? 'border-red-400' : 'border-[#3D5A80]/50'
                    } rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition`}
                  />
                  <FiLock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <FiEyeOff className="w-3 h-3" /> : <FiEye className="w-3 h-3" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-300 mt-0.5">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-1.5 py-2 px-4 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-semibold text-xs sm:text-sm transition shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#14213D] border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3D5A80]/40"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#14213D] px-2 text-[#D9D4C6]/60 font-medium tracking-wider">
                  or
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGitHubSignIn}
              disabled={isSubmitting}
              className="w-full py-1.5 px-3 rounded-lg bg-[#182746] hover:bg-[#1f3156] border border-[#3D5A80]/50 text-white/90 text-xs font-medium transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaGithub className="w-3.5 h-3.5 text-white" />
              <span>Continue with GitHub</span>
            </button>

            <p className="text-center text-xs text-[#D9D4C6]/80 pt-1">
              New to Jan Samadhaan Setu?{' '}
              <Link
                href="/signup"
                className="text-[#E8A33D] hover:underline font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
