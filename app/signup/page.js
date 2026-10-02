"use client"
import React, { useState, useEffect, Suspense } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  FiCheckCircle,
  FiBookOpen,
  FiAward,
  FiLayers,
  FiShield,
  FiBriefcase,
  FiMapPin
} from 'react-icons/fi'
import { setActiveRole, saveStakeholderProfile } from '@/lib/stakeholderData'

const ROLES = [
  { id: 'student', label: 'Student', icon: FiBookOpen, tag: 'Innovator', placeholder: 'e.g. Aarav Sharma', orgLabel: 'College / University Name', orgPlaceholder: 'e.g. Rajasthan Technical University' },
  { id: 'faculty', label: 'Faculty', icon: FiAward, tag: 'Mentor', placeholder: 'e.g. Dr. Sunita Khandelwal', orgLabel: 'Institution / College', orgPlaceholder: 'e.g. RTU Kota / MNIT Jaipur' },
  { id: 'university', label: 'University', icon: FiLayers, tag: 'Institute Node', placeholder: 'e.g. Prof. N. P. Padhy (Registrar)', orgLabel: 'Official University Name', orgPlaceholder: 'e.g. Malaviya National Institute of Technology' },
  { id: 'citizen', label: 'Citizen', icon: FiUser, tag: 'Public', placeholder: 'e.g. Rajesh Kumar', orgLabel: 'Ward / Locality & City', orgPlaceholder: 'e.g. Civil Lines, New Delhi' },
  { id: 'government', label: 'Government', icon: FiShield, tag: 'Civic Authority', placeholder: 'e.g. Er. Rameshwar Meena', orgLabel: 'Department / Municipal Body', orgPlaceholder: 'e.g. Jaipur Municipal Corporation' },
  { id: 'company', label: 'Company', icon: FiBriefcase, tag: 'CSR Partner', placeholder: 'e.g. Vikramaditya Singhania', orgLabel: 'Company Name & CIN', orgPlaceholder: 'e.g. Apex GreenTech Infrastructure' },
]

function SignUpContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryRole = searchParams.get('role')

  const [activeRole, setSelectedRole] = useState('student')

  useEffect(() => {
    if (queryRole && ROLES.some((r) => r.id === queryRole.toLowerCase())) {
      setSelectedRole(queryRole.toLowerCase())
    }
  }, [queryRole])

  // Form Fields
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    // Specialized Role fields
    organization: '',
    identifierCode: '', // Roll No (Student) / Employee ID (Faculty) / AISHE Code (University) / CIN (Company) / Designation (Gov)
    department: '',     // Dept (Student/Faculty) / State (University) / Sector (Company) / Zone (Gov)
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const currentRoleMeta = ROLES.find((r) => r.id === activeRole) || ROLES[0]

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
      newErrors.mobile = 'Enter a valid 10-digit mobile number'
    }

    if (!form.organization.trim()) {
      newErrors.organization = `${currentRoleMeta.orgLabel} is required`
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

    // Save profile data into local storage for this role
    const profilePayload = {
      role: activeRole,
      name: form.fullName.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim() ? `+91 ${form.mobile.trim()}` : '+91 98765-43210',
      organization: form.organization.trim(),
      identifierCode: form.identifierCode.trim() || 'REG-2026',
      department: form.department.trim() || 'General Civic Wing',
      registeredAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }

    setActiveRole(activeRole)
    saveStakeholderProfile(activeRole, profilePayload)

    // Backwards compatibility for citizen profile
    if (activeRole === 'citizen') {
      try {
        localStorage.setItem('jss_citizen_profile', JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim() || '9876543210',
          locality: form.organization.trim()
        }))
      } catch {}
    }

    try {
      const res = await signIn('credentials', {
        identifier: form.email.trim(),
        password: form.password,
        name: form.fullName.trim(),
        role: activeRole,
        organization: form.organization.trim(),
        redirect: false
      })

      if (res?.error) {
        setErrors({ form: 'Registration error: ' + res.error })
        setIsSubmitting(false)
      } else {
        setIsSuccess(true)
        setTimeout(() => {
          router.push(`/dashboard/${activeRole}`)
        }, 1000)
      }
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      setErrors({ form: 'Failed to complete registration.' })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F2EFE6] px-3 sm:px-4 py-8 flex items-center justify-center font-roboto">
      <div className="relative w-full max-w-xl p-5 sm:p-7 bg-[#14213D] border border-[#3D5A80]/50 rounded-xl text-white shadow-xl">
        <Link
          href="/"
          aria-label="Return to home"
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-7 h-7 rounded-full bg-[#182746] hover:bg-[#1f3156] text-[#D9D4C6] hover:text-white border border-[#3D5A80]/50 transition cursor-pointer"
        >
          <FiX className="w-4 h-4" />
        </Link>

        {/* Portal Header */}
        <div className="text-center mb-5">
          <span className="text-[11px] uppercase tracking-wider text-[#E8A33D] font-bold">
            Stakeholder Registration Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-0.5">
            Create Your Account
          </h1>
          <p className="text-xs text-[#D9D4C6]/80 mt-1">
            Select your stakeholder role to access tailored civic innovation dashboards
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-5 p-1 bg-[#182746] border border-[#3D5A80]/40 rounded-lg">
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
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#E8A33D] text-[#14213D] font-bold shadow-sm'
                    : 'text-[#D9D4C6]/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[11px] leading-none">{r.label}</span>
              </button>
            )
          })}
        </div>

        {/* Active Role Description Banner */}
        <div className="mb-4 p-2.5 rounded-lg bg-[#182746] border border-[#3D5A80]/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E8A33D]"></span>
            <span className="font-semibold text-white">
              Signing up as: <strong className="text-[#E8A33D] capitalize">{activeRole}</strong> ({currentRoleMeta.tag})
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            Routes to /dashboard/{activeRole}
          </span>
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
                href={`/dashboard/${activeRole}`}
                className="w-full py-2 px-4 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm transition text-center"
              >
                Go to {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Dashboard
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
                <span>Account created! Redirecting to {activeRole} dashboard...</span>
              </div>
            )}

            {/* Row 1: Name and Role-specific Org */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    placeholder={currentRoleMeta.placeholder}
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

              <div>
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1 truncate">
                  {currentRoleMeta.orgLabel} <span className="text-[#E8A33D]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder={currentRoleMeta.orgPlaceholder}
                    className={`w-full bg-[#182746] border ${
                      errors.organization ? 'border-red-400' : 'border-[#3D5A80]/50'
                    } rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition`}
                  />
                  <FiLayers className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                </div>
                {errors.organization && (
                  <p className="text-[10px] text-red-300 mt-0.5">{errors.organization}</p>
                )}
              </div>
            </div>

            {/* Row 2: Role-Specific Identifier & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                  {activeRole === 'student'
                    ? 'Roll / PRN / Enrollment No.'
                    : activeRole === 'faculty'
                    ? 'Faculty Employee ID'
                    : activeRole === 'university'
                    ? 'AISHE / UGC Code'
                    : activeRole === 'company'
                    ? 'Corporate CIN No.'
                    : activeRole === 'government'
                    ? 'Official Designation'
                    : 'City / Municipal Area'}
                </label>
                <input
                  type="text"
                  name="identifierCode"
                  value={form.identifierCode}
                  onChange={handleChange}
                  placeholder={
                    activeRole === 'student'
                      ? 'e.g. 22ERTCS045'
                      : activeRole === 'faculty'
                      ? 'e.g. EMP-CIV-1082'
                      : activeRole === 'university'
                      ? 'e.g. U-0312'
                      : activeRole === 'company'
                      ? 'e.g. U74999DL2018PTC'
                      : activeRole === 'government'
                      ? 'e.g. Executive Engineer'
                      : 'e.g. New Delhi'
                  }
                  className="w-full bg-[#182746] border border-[#3D5A80]/50 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                  {activeRole === 'student' || activeRole === 'faculty'
                    ? 'Department / Branch'
                    : activeRole === 'university'
                    ? 'State / Union Territory'
                    : activeRole === 'company'
                    ? 'Industry Sector'
                    : activeRole === 'government'
                    ? 'Jurisdiction / Zone'
                    : 'State'}
                </label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder={
                    activeRole === 'student' || activeRole === 'faculty'
                      ? 'e.g. Computer Science / Civil'
                      : activeRole === 'company'
                      ? 'e.g. CleanTech & Mobility'
                      : activeRole === 'government'
                      ? 'e.g. Zone 4 (Mansarovar)'
                      : 'e.g. Rajasthan'
                  }
                  className="w-full bg-[#182746] border border-[#3D5A80]/50 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition"
                />
              </div>
            </div>

            {/* Row 3: Email and Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#D9D4C6] mb-1">
                  {activeRole === 'student'
                    ? 'College / Student Email'
                    : activeRole === 'faculty' || activeRole === 'university'
                    ? 'Official Institutional Email'
                    : activeRole === 'government'
                    ? 'Official Gov Email (.gov.in)'
                    : activeRole === 'company'
                    ? 'Corporate Work Email'
                    : 'Email Address'} <span className="text-[#E8A33D]">*</span>
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
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
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

            {/* Row 4: Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    placeholder="••••••••"
                    className={`w-full bg-[#182746] border ${
                      errors.confirmPassword ? 'border-red-400' : 'border-[#3D5A80]/50'
                    } rounded-lg pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E8A33D] transition`}
                  />
                  <FiLock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-300 mt-0.5">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? 'Registering Account...'
                  : `Register as ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
              </button>
            </div>

            {/* Footer Navigation */}
            <div className="text-center pt-2 text-xs text-[#D9D4C6]/80">
              Already have an account?{' '}
              <Link href="/login" className="text-[#E8A33D] hover:underline font-bold">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F2EFE6] text-slate-600 font-roboto">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#E8A33D] border-t-transparent animate-spin" />
            <span>Loading Sign Up Portal...</span>
          </div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  )
}
