"use client"
import React, { useState, useRef } from 'react'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiMapPin,
  FiNavigation,
  FiUploadCloud,
  FiTrash2,
  FiCalendar,
  FiShield,
  FiFileText,
  FiCrosshair,
  FiExternalLink
} from 'react-icons/fi'

const CATEGORIES = [
  "Roads & Infrastructure",
  "Water & Sanitation",
  "Electricity & Street Lighting",
  "Healthcare",
  "Education",
  "Public Transport",
  "Environment",
  "Municipal Services",
  "Accessibility",
  "Other"
]

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi (NCT)", "Chandigarh"
]

const IMPACT_WHO_OPTIONS = [
  "Me / My household",
  "People in my locality",
  "Multiple neighbourhoods",
  "Larger community"
]

const IMPACT_FREQ_OPTIONS = [
  "One-time issue",
  "Occasional",
  "Frequent",
  "Ongoing"
]

export default function SubmitProblemPage() {
  const fileInputRef = useRef(null)
  const formTopRef = useRef(null)

  // Form State
  const [form, setForm] = useState({
    title: '',
    category: '',
    state: '',
    district: '',
    city: '',
    locality: '',
    landmark: '',
    description: '',
    dateNoticed: '',
    additionalDetails: '',
    impactWho: '',
    impactFrequency: '',
    safetyConcern: '',
    confirmAccurate: false
  })

  // Map Pin State
  const [mapPin, setMapPin] = useState(null)
  const [isPinningMode, setIsPinningMode] = useState(false)
  const [locationNotice, setLocationNotice] = useState('')

  // Files State
  const [evidenceFiles, setEvidenceFiles] = useState([])
  const [fileError, setFileError] = useState('')

  // Validation & Submission States
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)

  // Map Click Handler
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    // Calculate simulated offset
    const latOffset = ((rect.height / 2 - y) / 1000).toFixed(4)
    const lngOffset = ((x - rect.width / 2) / 1000).toFixed(4)
    const newLat = (26.9124 + parseFloat(latOffset)).toFixed(4)
    const newLng = (75.7873 + parseFloat(lngOffset)).toFixed(4)

    setMapPin({
      lat: parseFloat(newLat),
      lng: parseFloat(newLng),
      label: form.locality ? `${form.locality}, ${form.city}` : `Coordinates: ${newLat}, ${newLng}`
    })
    setLocationNotice('Location pinned on map.')
    setTimeout(() => setLocationNotice(''), 3000)
  }

  // Geolocation Handler
  const handleUseMyLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4))
          const lng = parseFloat(pos.coords.longitude.toFixed(4))
          setMapPin({
            lat,
            lng,
            label: form.locality ? `${form.locality}, ${form.city}` : `${lat}° N, ${lng}° E`
          })
          setLocationNotice('GPS coordinates detected and pinned.')
          setTimeout(() => setLocationNotice(''), 3500)
        },
        () => {
          // Fallback demo simulation
          setMapPin({
            lat: 26.9124,
            lng: 75.7873,
            label: 'Main Market, Jaipur (Simulated GPS)'
          })
          setLocationNotice('Approximate location pinned based on local network.')
          setTimeout(() => setLocationNotice(''), 3500)
        }
      )
    }
  }

  // File Upload Handlers
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || [])
    if (evidenceFiles.length + selected.length > 5) {
      setFileError('You can upload a maximum of 5 files.')
      return
    }
    setFileError('')

    const newFiles = selected.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'Document',
      isImage: file.type.startsWith('image/'),
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }))

    setEvidenceFiles(prev => [...prev, ...newFiles])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (id) => {
    setEvidenceFiles(prev => {
      const filtered = prev.filter(f => f.id !== id)
      return filtered
    })
  }

  // Form Validation
  const validateForm = () => {
    const newErrors = {}
    if (!form.title.trim()) {
      newErrors.title = 'Please enter a short title for the problem.'
    }
    if (!form.category) {
      newErrors.category = 'Please select a category.'
    }
    if (!form.city.trim() || !form.locality.trim()) {
      newErrors.location = 'Please provide the problem location.'
    }
    if (!form.description.trim() || form.description.trim().length < 15) {
      newErrors.description = 'Please provide a little more information about the problem.'
    }
    if (!form.confirmAccurate) {
      newErrors.confirmAccurate = 'Please confirm that the information provided is accurate.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) {
      // Scroll to form error
      if (formTopRef.current) {
        formTopRef.current.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    setIsSubmitting(true)

    // Generate random 5-digit number
    const randomDigits = Math.floor(10000 + Math.random() * 90000)
    const generatedId = `JSS-2026-${randomDigits}`

    const record = {
      id: generatedId,
      title: form.title.trim(),
      category: form.category,
      state: form.state,
      district: form.district,
      city: form.city.trim(),
      locality: form.locality.trim(),
      landmark: form.landmark.trim(),
      coordinates: mapPin,
      description: form.description.trim(),
      dateNoticed: form.dateNoticed,
      additionalDetails: form.additionalDetails.trim(),
      impactWho: form.impactWho,
      impactFrequency: form.impactFrequency,
      safetyConcern: form.safetyConcern,
      evidenceCount: evidenceFiles.length,
      status: 'Submitted',
      submittedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }

    // Save to localStorage for demo persistence
    try {
      const existing = JSON.parse(localStorage.getItem('jss_citizen_grievances_v2') || '[]')
      localStorage.setItem('jss_citizen_grievances_v2', JSON.stringify([record, ...existing]))
    } catch {
      // Ignore localStorage errors
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmittedData(record)
      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 850)
  }

  // Reset Form for another submission
  const handleResetForm = () => {
    setIsSuccess(false)
    setSubmittedData(null)
    setErrors({})
    setEvidenceFiles([])
    setMapPin(null)
    setForm({
      title: '',
      category: '',
      state: '',
      district: '',
      city: '',
      locality: '',
      landmark: '',
      description: '',
      dateNoticed: '',
      additionalDetails: '',
      impactWho: '',
      impactFrequency: '',
      safetyConcern: '',
      confirmAccurate: false
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="w-full min-h-screen bg-[#F2EFE6] text-[#1A1A1A] font-roboto">
      {/* PAGE HEADER */}
      <section className="w-full bg-[#14213D] text-white py-10 sm:py-12 border-b border-[#3D5A80]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
            <Link href="/" className="hover:text-[#E8A33D] transition">Home</Link>
            <span>/</span>
            <span className="text-[#E8A33D]">Submit a Problem</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E8A33D]">
              PUBLIC PROBLEM REPORTING
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mt-1">
              Submit a Problem
            </h1>
            <p className="mt-2.5 text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Tell us what is happening and where it is happening. We&apos;ll help route your report to the appropriate authority.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div ref={formTopRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {isSuccess && submittedData ? (
          /* ==================================================
             SUCCESS SCREEN
             ================================================== */
          <div className="bg-white rounded-xl border border-[#D9D4C6] p-6 sm:p-10 max-w-2xl mx-auto shadow-sm animate-in fade-in duration-300">
            {/* Simple Check Icon */}
            <div className="w-14 h-14 rounded-full bg-[#4C8C6B]/15 text-[#4C8C6B] mx-auto flex items-center justify-center text-2xl font-bold mb-4">
              <FiCheck className="w-7 h-7 stroke-[3]" />
            </div>

            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#14213D]">
                Problem submitted successfully
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you for reporting this issue. Your report has been received and is now being processed.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Your report has been assigned a unique grievance ID.
              </p>
            </div>

            {/* Grievance ID Card */}
            <div className="mt-6 p-5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Grievance ID
                </span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#14213D] tracking-wide">
                  {submittedData.id}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="sm:text-right">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#14213D] text-[#E8A33D] text-xs font-semibold shadow-xs">
                    <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{submittedData.status}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Details */}
            <div className="mt-6 border-t border-slate-200 pt-5 text-xs text-slate-600 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Problem:</span>
                <span className="text-slate-800 font-medium text-right max-w-xs truncate">{submittedData.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Category:</span>
                <span className="text-slate-800">{submittedData.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Location:</span>
                <span className="text-slate-800 text-right">{submittedData.locality}, {submittedData.city}, {submittedData.state}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-700">Automated Routing:</span>
                <span className="text-[#3D5A80] font-medium">Department Triage in progress</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center mt-5">
              Keep this ID for tracking your report.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <Link
                href={`/dashboard?newId=${submittedData.id}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 text-center"
              >
                Go to Citizen Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setTrackingModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#3D5A80] hover:bg-slate-50 text-[#14213D] font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                Track Problem
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#D9D4C6] hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                Submit Another Problem
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-medium text-center transition"
              >
                Return to Home
              </Link>
            </div>

            {/* Tracking Modal */}
            {trackingModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                <div className="bg-white rounded-xl border border-[#D9D4C6] p-6 max-w-md w-full shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="font-bold text-[#14213D] text-base">Tracking Status: {submittedData.id}</h3>
                    <button
                      onClick={() => setTrackingModalOpen(false)}
                      className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="py-5 space-y-4 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <FiCheck className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#14213D]">1. Submitted</p>
                        <p className="text-slate-500 text-[11px]">{submittedData.submittedAt} · Stored in public registry</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </div>
                      <div>
                        <p className="font-bold text-[#14213D]">2. Automated Department Routing</p>
                        <p className="text-slate-500 text-[11px]">Categorized under {submittedData.category}. Assigning to regional civic authority.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 opacity-60">
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">3. Field Verification & Action</p>
                        <p className="text-slate-500 text-[11px]">Inspection scheduled by field team</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Link
                      href={`/dashboard?newId=${submittedData.id}`}
                      className="flex-1 py-2 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs text-center transition"
                    >
                      Open in Citizen Dashboard
                    </Link>
                    <button
                      onClick={() => setTrackingModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ==================================================
             MAIN FORM VIEW
             ================================================== */
          <div className="max-w-3xl mx-auto space-y-6">
              {/* BEFORE YOU SUBMIT PANEL */}
              <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3.5">
                  <FiInfo className="w-4 h-4 text-[#3D5A80]" />
                  <h3 className="text-sm font-bold text-[#14213D]">
                    Before you submit
                  </h3>
                </div>

                <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4C8C6B] font-bold">✓</span>
                    <span>Describe one problem per submission.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4C8C6B] font-bold">✓</span>
                    <span>Provide an accurate location.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4C8C6B] font-bold">✓</span>
                    <span>Explain the problem clearly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4C8C6B] font-bold">✓</span>
                    <span>Add photos or other evidence when available.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4C8C6B] font-bold">✓</span>
                    <span>Do not submit false or misleading information.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4C8C6B] font-bold">✓</span>
                    <span>Avoid sharing unnecessary personal or sensitive information.</span>
                  </li>
                </ul>

                <div className="mt-4 pt-3 flex items-start gap-2 text-[11px] text-black font-roboto p-2.5 rounded-lg">
                  <span>
                    <strong className='text-red-500 text-roboto'>Emergency Notice:</strong> For emergencies or situations requiring immediate assistance, contact the appropriate emergency service.
                  </span>
                </div>
              </div>

              {/* MAIN FORM CONTAINER */}
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#D9D4C6] p-6 sm:p-8 shadow-sm space-y-8">
                {/* ==================================================
                    SECTION 1 — PROBLEM DETAILS
                    ================================================== */}
                <div>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                    <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-base font-bold text-[#14213D]">
                      Problem Details
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs font-normal">
                    {/* Problem Title */}
                    <div>
                      <label htmlFor="problem-title" className="block font-semibold text-slate-700 mb-1">
                        Problem Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="problem-title"
                        type="text"
                        placeholder="e.g. Streetlight not working near Main Market"
                        value={form.title}
                        onChange={(e) => {
                          setForm({ ...form, title: e.target.value })
                          if (errors.title) setErrors({ ...errors, title: '' })
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-lg border ${errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-[#D9D4C6]'} focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none text-sm transition`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-slate-500">Keep the title short and specific.</span>
                        {errors.title && (
                          <span className="text-[11px] text-rose-600 font-medium">{errors.title}</span>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="problem-category" className="block font-semibold text-slate-700 mb-1">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="problem-category"
                        value={form.category}
                        onChange={(e) => {
                          setForm({ ...form, category: e.target.value })
                          if (errors.category) setErrors({ ...errors, category: '' })
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-lg border ${errors.category ? 'border-rose-400 bg-rose-50/30' : 'border-[#D9D4C6]'} focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none bg-white text-xs sm:text-sm cursor-pointer transition`}
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="mt-1.5 space-y-1">
                        <p className="text-[11px] text-slate-500">
                          You don&apos;t need to know which department is responsible. We&apos;ll route your report accordingly.
                        </p>
                        {errors.category && (
                          <p className="text-[11px] text-rose-600 font-medium">{errors.category}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    SECTION 2 — LOCATION
                    ================================================== */}
                <div>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                    <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-base font-bold text-[#14213D]">
                      Where is the problem?
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs font-normal">
                    <p className="text-[11px] text-slate-500">
                      The location should describe where the public problem exists. Do not provide your full home address.
                    </p>

                    {/* State & District */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="problem-state" className="block font-semibold text-slate-700 mb-1">
                          State <span className="text-rose-500">*</span>
                        </label>
                        <select
                          id="problem-state"
                          value={form.state}
                          onChange={(e) => {
                            setForm({ ...form, state: e.target.value })
                            if (errors.location) setErrors({ ...errors, location: '' })
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-lg border ${errors.location && !form.state ? 'border-rose-400 bg-rose-50/30' : 'border-[#D9D4C6]'} focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none bg-white text-xs transition cursor-pointer`}
                        >
                          <option value="">Select a state</option>
                          {INDIAN_STATES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="problem-district" className="block font-semibold text-slate-700 mb-1">
                          District
                        </label>
                        <input
                          id="problem-district"
                          type="text"
                          placeholder="e.g. Jaipur"
                          value={form.district}
                          onChange={(e) => setForm({ ...form, district: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    {/* City & Area / Locality */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="problem-city" className="block font-semibold text-slate-700 mb-1">
                          City / Town <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="problem-city"
                          type="text"
                          placeholder="e.g. Jaipur"
                          value={form.city}
                          onChange={(e) => {
                            setForm({ ...form, city: e.target.value })
                            if (errors.location) setErrors({ ...errors, location: '' })
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-lg border ${errors.location && !form.city.trim() ? 'border-rose-400 bg-rose-50/30' : 'border-[#D9D4C6]'} focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none transition`}
                        />
                      </div>

                      <div>
                        <label htmlFor="problem-locality" className="block font-semibold text-slate-700 mb-1">
                          Area / Locality <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="problem-locality"
                          type="text"
                          placeholder="e.g. Main Market, Sector 4, Civil Lines"
                          value={form.locality}
                          onChange={(e) => {
                            setForm({ ...form, locality: e.target.value })
                            if (errors.location) setErrors({ ...errors, location: '' })
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-lg border ${errors.location && !form.locality.trim() ? 'border-rose-400 bg-rose-50/30' : 'border-[#D9D4C6]'} focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none transition`}
                        />
                      </div>
                    </div>

                    {/* Landmark */}
                    <div>
                      <label htmlFor="problem-landmark" className="block font-semibold text-slate-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        id="problem-landmark"
                        type="text"
                        placeholder="e.g. Near Community Centre, Opposite SBI Bank"
                        value={form.landmark}
                        onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none transition"
                      />
                    </div>

                    {errors.location && (
                      <p className="text-[11px] text-rose-600 font-medium">{errors.location}</p>
                    )}

                    {/* MAP PANEL: Pin the problem location */}
                    <div className="pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <FiMapPin className="w-3.5 h-3.5 text-[#E8A33D]" />
                          Pin the problem location
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleUseMyLocation}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#D9D4C6] hover:bg-slate-50 text-[11px] text-slate-700 font-medium transition cursor-pointer"
                          >
                            <FiNavigation className="w-3 h-3 text-[#3D5A80]" />
                            <span>Use My Location</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsPinningMode(!isPinningMode)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition cursor-pointer ${
                              isPinningMode
                                ? 'bg-[#14213D] text-[#E8A33D] border-[#14213D]'
                                : 'border-[#D9D4C6] hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <FiCrosshair className="w-3 h-3" />
                            <span>{isPinningMode ? 'Click Map to Move' : 'Select on Map'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Map Graphic / Interactive Area */}
                      <div
                        onClick={handleMapClick}
                        className="relative w-full h-44 sm:h-52 rounded-lg border border-[#D9D4C6] overflow-hidden bg-[#ECE8DF] cursor-crosshair select-none group"
                        title="Click to reposition location pin"
                      >
                        {/* Map Grid and Street SVG mockup */}
                        <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B8B0A0" strokeWidth="0.8" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          {/* Road paths */}
                          <path d="M 0 60 Q 200 80 400 40 T 800 120" fill="none" stroke="#FFFFFF" strokeWidth="8" />
                          <path d="M 120 0 L 140 220" fill="none" stroke="#FFFFFF" strokeWidth="6" />
                          <path d="M 320 0 L 300 220" fill="none" stroke="#FFFFFF" strokeWidth="6" />
                          <path d="M 0 160 L 800 140" fill="none" stroke="#F6D59A" strokeWidth="10" />
                          <path d="M 520 0 L 540 220" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                        </svg>

                        {/* Location Pin Marker */}
                        {mapPin ? (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative -mt-6 flex flex-col items-center animate-bounce duration-1000">
                              <div className="w-8 h-8 rounded-full bg-[#14213D] text-[#E8A33D] flex items-center justify-center shadow-lg border-2 border-white">
                                <FiMapPin className="w-4 h-4 fill-[#E8A33D]" />
                              </div>
                              <div className="w-2 h-2 rounded-full bg-[#14213D]/40 mt-0.5"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-300 text-[11px] text-slate-600 shadow-xs flex items-center gap-1.5">
                              <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>Click on map or use location to pin</span>
                            </div>
                          </div>
                        )}

                        {/* Map Info Overlay */}
                        {mapPin ? (
                          <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-slate-700 border border-slate-200/80 shadow-xs flex items-center gap-1.5 pointer-events-none">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>{mapPin.lat}° N, {mapPin.lng}° E</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-600 font-sans">{form.locality || 'Locality'}</span>
                          </div>
                        ) : (
                          <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-slate-500 border border-slate-200/80 pointer-events-none">
                            No pin placed yet
                          </div>
                        )}

                        <div className="absolute top-2.5 right-2.5 bg-[#14213D]/80 text-white px-2 py-0.5 rounded text-[10px] pointer-events-none">
                          Click to position pin
                        </div>
                      </div>

                      {locationNotice && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1 animate-in fade-in">
                          ✓ {locationNotice}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    SECTION 3 — DESCRIBE THE PROBLEM
                    ================================================== */}
                <div>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                    <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-base font-bold text-[#14213D]">
                      Describe the Problem
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs font-normal">
                    {/* What is happening? */}
                    <div>
                      <label htmlFor="problem-description" className="block font-semibold text-slate-700 mb-1">
                        What is happening? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="problem-description"
                        rows={4}
                        maxLength={1500}
                        placeholder="Describe what you observed, where it is happening, and how it is affecting people."
                        value={form.description}
                        onChange={(e) => {
                          setForm({ ...form, description: e.target.value })
                          if (errors.description) setErrors({ ...errors, description: '' })
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-lg border ${errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-[#D9D4C6]'} focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none resize-none transition`}
                      ></textarea>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                        <span className="font-mono">{form.description.length} / 1500 characters</span>
                        {errors.description && (
                          <span className="text-rose-600 font-medium">{errors.description}</span>
                        )}
                      </div>

                      {/* Helpful Prompts */}
                      <div className="mt-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-700 block mb-1">You can mention:</span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-600">
                          <li>• What happened?</li>
                          <li>• When did you notice it?</li>
                          <li>• How often does it occur?</li>
                          <li>• Who is affected?</li>
                        </ul>
                      </div>
                    </div>

                    {/* Approximate date noticed */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date-noticed" className="block font-semibold text-slate-700 mb-1">
                          Approximate date noticed
                        </label>
                        <div className="relative">
                          <input
                            id="date-noticed"
                            type="date"
                            max={new Date().toISOString().split('T')[0]}
                            value={form.dateNoticed}
                            onChange={(e) => setForm({ ...form, dateNoticed: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none bg-white transition cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="additional-details" className="block font-semibold text-slate-700 mb-1">
                          Additional details (Optional)
                        </label>
                        <input
                          id="additional-details"
                          type="text"
                          placeholder="e.g. Previous complaint numbers, timings, or specific risks"
                          value={form.additionalDetails}
                          onChange={(e) => setForm({ ...form, additionalDetails: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    SECTION 4 — SUPPORTING EVIDENCE
                    ================================================== */}
                <div>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                    <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                      4
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[#14213D]">
                        Add Supporting Evidence
                      </h3>
                      <p className="text-xs text-slate-500 font-normal">
                        Photos or documents can help authorities understand the issue.
                      </p>
                    </div>
                  </div>

                  {/* Upload Dropzone */}
                  <div className="space-y-3 text-xs font-normal">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,video/mp4,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#D9D4C6] hover:border-[#E8A33D] bg-slate-50/50 hover:bg-amber-50/20 rounded-xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-[#D9D4C6] flex items-center justify-center text-slate-500 group-hover:text-[#E8A33D] group-hover:border-[#E8A33D] transition shadow-2xs">
                        <FiUploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          + Add Photos / Videos
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          JPG, PNG, MP4 or PDF (Max 5 files)
                        </p>
                      </div>
                    </div>

                    {fileError && (
                      <p className="text-[11px] text-rose-600 font-medium">{fileError}</p>
                    )}

                    {/* Uploaded File Cards */}
                    {evidenceFiles.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {evidenceFiles.map((f) => (
                          <div
                            key={f.id}
                            className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs gap-3"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {f.isImage && f.previewUrl ? (
                                <img
                                  src={f.previewUrl}
                                  alt={f.name}
                                  className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                  <FiFileText className="w-4 h-4" />
                                </div>
                              )}
                              <div className="truncate text-[11px]">
                                <p className="font-medium text-slate-800 truncate" title={f.name}>
                                  {f.name}
                                </p>
                                <p className="text-slate-500 text-[10px]">{f.size}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFile(f.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                              title="Remove file"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ==================================================
                    SECTION 5 — IMPACT
                    ================================================== */}
                <div>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                    <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                      5
                    </span>
                    <h3 className="text-base font-bold text-[#14213D]">
                      How is the problem affecting the community?
                    </h3>
                  </div>

                  <div className="space-y-5 text-xs font-normal">
                    {/* Who is affected? */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-2">
                        Who is affected?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {IMPACT_WHO_OPTIONS.map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition text-xs ${
                              form.impactWho === opt
                                ? 'bg-amber-50/60 border-[#E8A33D] text-[#14213D] font-semibold'
                                : 'border-[#D9D4C6] hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="impactWho"
                              value={opt}
                              checked={form.impactWho === opt}
                              onChange={(e) => setForm({ ...form, impactWho: e.target.value })}
                              className="text-[#E8A33D] focus:ring-[#E8A33D]"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* How frequently does the problem occur? */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-2">
                        How frequently does the problem occur?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {IMPACT_FREQ_OPTIONS.map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition text-xs justify-center ${
                              form.impactFrequency === opt
                                ? 'bg-amber-50/60 border-[#E8A33D] text-[#14213D] font-semibold'
                                : 'border-[#D9D4C6] hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="impactFrequency"
                              value={opt}
                              checked={form.impactFrequency === opt}
                              onChange={(e) => setForm({ ...form, impactFrequency: e.target.value })}
                              className="text-[#E8A33D] focus:ring-[#E8A33D]"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Is there any immediate safety concern? */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Is there any immediate safety concern?
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, safetyConcern: 'No' })}
                          className={`px-4 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                            form.safetyConcern === 'No'
                              ? 'bg-[#14213D] text-white border-[#14213D]'
                              : 'border-[#D9D4C6] text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, safetyConcern: 'Yes' })}
                          className={`px-4 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                            form.safetyConcern === 'Yes'
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'border-[#D9D4C6] text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Yes
                        </button>
                      </div>

                      {form.safetyConcern === 'Yes' && (
                        <div className="mt-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-start gap-2">
                          <FiAlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>
                            If there is an immediate threat to life or safety, please contact the appropriate emergency service.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    SECTION 6 — REVIEW & SUBMIT
                    ================================================== */}
                <div>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                    <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                      6
                    </span>
                    <h3 className="text-base font-bold text-[#14213D]">
                      Review Your Submission
                    </h3>
                  </div>

                  {/* Compact Review Summary Box */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 sm:p-5 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200/60">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Problem
                        </span>
                        <span className="font-semibold text-[#14213D] line-clamp-1">
                          {form.title ? form.title : <span className="text-slate-400 font-normal italic">Not entered yet</span>}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Category
                        </span>
                        <span className="font-semibold text-slate-800">
                          {form.category ? form.category : <span className="text-slate-400 font-normal italic">Not selected yet</span>}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200/60">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Location
                        </span>
                        <span className="text-slate-700">
                          {[form.locality, form.city, form.state].filter(Boolean).length > 0 ? (
                            [form.locality, form.city, form.state].filter(Boolean).join(', ')
                          ) : (
                            <span className="text-slate-400 font-normal italic">Not specified yet</span>
                          )}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Evidence
                        </span>
                        <span className="text-slate-700">
                          {evidenceFiles.length > 0 ? `${evidenceFiles.length} file(s) attached` : 'No files attached'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Description
                        </span>
                        <p className="text-slate-600 line-clamp-2 italic">
                          {form.description ? form.description : <span className="text-slate-400 font-normal not-italic">No description provided yet...</span>}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Impact
                        </span>
                        <span className="text-slate-700">
                          {form.impactWho || form.impactFrequency ? (
                            <span>
                              {form.impactWho || 'Impact not specified'}
                              {form.impactFrequency ? ` · ${form.impactFrequency}` : ''}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal italic">Not selected yet</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="mt-4">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.confirmAccurate}
                        onChange={(e) => {
                          setForm({ ...form, confirmAccurate: e.target.checked })
                          if (errors.confirmAccurate) setErrors({ ...errors, confirmAccurate: '' })
                        }}
                        className="mt-0.5 rounded text-[#E8A33D] focus:ring-[#E8A33D] cursor-pointer"
                      />
                      <span>
                        I confirm that the information provided is accurate to the best of my knowledge.
                      </span>
                    </label>
                    {errors.confirmAccurate && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.confirmAccurate}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 border-t border-slate-200 mt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (formTopRef.current) {
                          formTopRef.current.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#D9D4C6] hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm text-center transition cursor-pointer"
                    >
                      ← Edit
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#14213D] border-t-transparent rounded-full animate-spin"></span>
                          <span>Submitting Problem...</span>
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="w-4 h-4" />
                          <span>Submit Problem</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
          </div>
        )}
      </div>
    </div>
  )
}
