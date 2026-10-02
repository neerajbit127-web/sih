"use client"
import React, { useState, Suspense } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  FiX,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiBookOpen,
  FiAward,
  FiLayers,
  FiUser,
  FiShield,
  FiBriefcase
} from 'react-icons/fi'
import { setActiveRole } from '@/lib/stakeholderData'

const ROLES = [
  { id: 'student', label: 'Student', icon: FiBookOpen },
  { id: 'faculty', label: 'Faculty', icon: FiAward },
  { id: 'university', label: 'University', icon: FiLayers },
  { id: 'citizen', label: 'Citizen', icon: FiUser },
  { id: 'government', label: 'Government', icon: FiShield },
  { id: 'company', label: 'Company', icon: FiBriefcase },
]

function LoginContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryRole = searchParams.get('role')

  const [activeRole, setSelectedRole] = useState(
    queryRole && ROLES.some((r) => r.id === queryRole.toLowerCase())
      ? queryRole.toLowerCase()
      : 'citizen'
  )

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
    setActiveRole(activeRole)

    try {
      const res = await signIn('credentials', {
        identifier: identifier.trim(),
        password: password,
        role: activeRole,
        redirect: false
      })

      if (res?.error) {
        setErrors({ form: 'Invalid credentials. Please verify and try again.' })
        setIsSubmitting(false)
      } else {
        router.push(`/dashboard/${activeRole}`)
      }
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      setErrors({ form: 'Login service encountered an issue. Please try again.' })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F2EFE6] px-3 sm:px-4 py-8 flex items-center justify-center font-roboto">
      <div className="relative w-full max-w-md p-5 sm:p-7 bg-[#14213D] border border-[#3D5A80]/50 rounded-xl text-white shadow-xl">
        <Link
          href="/"
          aria-label="Return to home"
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-7 h-7 rounded-full bg-[#182746] hover:bg-[#1f3156] text-[#D9D4C6] hover:text-white border border-[#3D5A80]/50 transition cursor-pointer"
        >
          <FiX className="w-4 h-4" />
        </Link>

        <div className="text-center mb-4">
          <span className="text-[11px] uppercase tracking-wider text-[#E8A33D] font-bold">
            Jan Samadhaan Setu Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-0.5">
            Stakeholder Sign In
          </h1>
          <p className="text-xs text-[#D9D4C6]/80 mt-1">
            Choose your role to sign into your specialized civic dashboard
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mb-4 p-1 bg-[#182746] border border-[#3D5A80]/40 rounded-lg">
          {ROLES.map((r) => {
            const Icon = r.icon
            const isSelected = activeRole === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedRole(r.id)
                  setErrors({})
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded text-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#E8A33D] text-[#14213D] font-bold shadow-xs'
                    : 'text-[#D9D4C6]/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-[10px] leading-none">{r.label}</span>
              </button>
            )
          })}
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
                {session.user?.name?.charAt(0) || 'U'}
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
                href={`/dashboard/${activeRole}`}
                className="w-full py-2 px-4 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm transition text-center"
              >
                Go to {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Dashboard
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
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="user@example.com or 9876543210"
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
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#182746] border ${
                      errors.password ? 'border-red-400' : 'border-[#3D5A80]/50'
                    } rounded-lg pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition`}
                  />
                  <FiLock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-300 mt-0.5">{errors.password}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting
                    ? 'Signing in...'
                    : `Sign in as ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
                </button>
              </div>

              <div className="text-center pt-2 text-xs text-[#D9D4C6]/80">
                Don&apos;t have an account?{' '}
                <Link
                  href={`/signup?role=${activeRole}`}
                  className="text-[#E8A33D] hover:underline font-bold"
                >
                  Register here
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F2EFE6] text-slate-600 font-roboto">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#E8A33D] border-t-transparent animate-spin" />
            <span>Loading Sign In Portal...</span>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
