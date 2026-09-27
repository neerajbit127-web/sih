"use client"
import React, { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi'
import { FaGithub } from 'react-icons/fa'

export default function SignUpPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    const cleanMobile = form.mobile.replace(/\D/g, '')
    if (form.mobile && cleanMobile.length !== 10) {
      newErrors.mobile = 'Enter a valid 10-digit number'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Min 6 characters required'
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      const citizenData = {
        name: form.fullName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim() || '9876543210',
        registeredAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }
      localStorage.setItem('jss_citizen_profile', JSON.stringify(citizenData))
    } catch {
    }

    try {
      const res = await signIn('credentials', {
        identifier: form.email.trim(),
        password: form.password,
        name: form.fullName.trim(),
        redirect: false
      })

      if (res?.error) {
        setErrors({ form: 'Registration error: ' + res.error })
        setIsSubmitting(false)
      } else {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      setErrors({ form: 'Failed to complete registration.' })
    }
  }

  const handleGitHubSignUp = async () => {
    try {
      setIsSubmitting(true)
      await signIn('github', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Failed to initiate sign up:', error)
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
            Create Account
          </h1>
          <p className="text-xs text-[#D9D4C6]/80 mt-1">
            Join Jan Samadhaan Setu civic portal
          </p>
        </div>

        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2.5">
            <div className="w-7 h-7 border-2 border-[#E8A33D] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-[#D9D4C6]/75">Checking session...</p>
          </div>
        ) : session ? (
          <div className="space-y-4 text-center py-2">
            <div className="p-4 rounded-lg bg-[#182746] border border-[#3D5A80]/40">
              <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-[#3D5A80] border-2 border-[#E8A33D] flex items-center justify-center text-lg font-bold font-serif text-[#E8A33D]">
                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
              </div>
              <h2 className="text-base font-semibold text-white">
                {session.user?.name || 'Welcome!'}
              </h2>
              <p className="text-xs text-[#D9D4C6]/80 mt-0.5">{session.user?.email}</p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Signed in
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
                onClick={() => signOut({ callbackUrl: '/signup' })}
                className="w-full py-2 px-4 rounded-lg bg-[#182746] hover:bg-[#1f3156] text-white/90 text-xs sm:text-sm border border-[#3D5A80]/50 transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {errors.form && (
              <div className="p-2 rounded bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
                <FiAlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{errors.form}</span>
              </div>
            )}

            {isSuccess && (
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-200">
                <FiCheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>Account created! Redirecting to dashboard...</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                Full Name <span className="text-[#E8A33D]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Neeraj Meena"
                  className={`w-full bg-[#182746] border ${
                    errors.fullName ? 'border-red-400' : 'border-[#3D5A80]/50'
                  } rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition`}
                />
                <FiUser className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
              </div>
              {errors.fullName && (
                <p className="text-[10px] text-red-300 mt-0.5">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                  Email Address <span className="text-[#E8A33D]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full bg-[#182746] border ${
                      errors.email ? 'border-red-400' : 'border-[#3D5A80]/50'
                    } rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition`}
                  />
                  <FiMail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-300 mt-0.5">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="mobile"
                    maxLength={10}
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className={`w-full bg-[#182746] border ${
                      errors.mobile ? 'border-red-400' : 'border-[#3D5A80]/50'
                    } rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition`}
                  />
                  <FiPhone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                </div>
                {errors.mobile && (
                  <p className="text-[10px] text-red-300 mt-0.5">{errors.mobile}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                  Password <span className="text-[#E8A33D]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars"
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

              <div>
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                  Confirm Password <span className="text-[#E8A33D]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter"
                    className={`w-full bg-[#182746] border ${
                      errors.confirmPassword ? 'border-red-400' : 'border-[#3D5A80]/50'
                    } rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition`}
                  />
                  <FiLock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-3 h-3" /> : <FiEye className="w-3 h-3" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-300 mt-0.5">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full mt-2 py-2 px-4 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-semibold text-xs sm:text-sm transition shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#14213D] border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            <div className="relative my-2.5">
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
              onClick={handleGitHubSignUp}
              disabled={isSubmitting}
              className="w-full py-1.5 px-3 rounded-lg bg-[#182746] hover:bg-[#1f3156] border border-[#3D5A80]/50 text-white/90 text-xs font-medium transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaGithub className="w-3.5 h-3.5 text-white" />
              <span>Continue with GitHub</span>
            </button>

            <p className="text-center text-xs text-[#D9D4C6]/80 pt-1">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-[#E8A33D] hover:underline font-semibold"
              >
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
