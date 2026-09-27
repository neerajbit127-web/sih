"use client"
import React, { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  FiPlus,
  FiSearch,
  FiCheck,
  FiClock,
  FiMapPin,
  FiFileText,
  FiCheckCircle,
  FiShield,
  FiStar,
  FiShare2,
  FiPrinter,
  FiPhoneCall,
  FiUser,
  FiAlertCircle,
  FiArrowRight
} from 'react-icons/fi'
import {
  CITIZEN_PROFILE,
  getCitizenGrievances,
  getCitizenActivities,
  saveGrievanceFeedback,
  calculateCitizenMetrics,
  clearAllCitizenData
} from '@/lib/citizenData'

function EnhancedDashboardContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const newSubmissionId = searchParams.get('newId')

  // Core Data
  const [grievances, setGrievances] = useState([])
  const [activities, setActivities] = useState([])
  const [selectedGrievance, setSelectedGrievance] = useState(null)
  const [feedbackGrievance, setFeedbackGrievance] = useState(null)
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('recent')
  const [quickTrackInput, setQuickTrackInput] = useState('')
  const [quickTrackError, setQuickTrackError] = useState('')

  // Interactive feedback
  const [ratingStars, setRatingStars] = useState(5)
  const [satisfactionChoice, setSatisfactionChoice] = useState('Yes')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [showNewAlert, setShowNewAlert] = useState(Boolean(newSubmissionId))

  // Load grievances on mount
  useEffect(() => {
    const list = getCitizenGrievances()
    setGrievances(list)
    setActivities(getCitizenActivities(list))

    if (newSubmissionId) {
      const match = list.find((g) => g.id === newSubmissionId)
      if (match) setSelectedGrievance(match)
    }
  }, [newSubmissionId])

  // Summary Metrics
  const metrics = useMemo(() => {
    return calculateCitizenMetrics(grievances)
  }, [grievances])

  // Filtered grievances list
  const filteredGrievances = useMemo(() => {
    return grievances
      .filter((item) => {
        if (statusFilter === 'In Progress') {
          if (item.status === 'Resolved' || item.status === 'Closed') return false
        } else if (statusFilter === 'Resolved') {
          if (item.status !== 'Resolved' && item.status !== 'Closed') return false
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const titleMatch = (item.title || '').toLowerCase().includes(q)
          const idMatch = (item.id || '').toLowerCase().includes(q)
          const locMatch = (item.locality || '').toLowerCase().includes(q)
          const catMatch = (item.category || '').toLowerCase().includes(q)
          return titleMatch || idMatch || locMatch || catMatch
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return (a.submittedDateRaw || '').localeCompare(b.submittedDateRaw || '')
        }
        return (b.lastUpdatedRaw || b.submittedDateRaw || '').localeCompare(a.lastUpdatedRaw || a.submittedDateRaw || '')
      })
  }, [grievances, statusFilter, searchQuery, sortBy])

  // Quick Tracker Search
  const handleQuickTrackSubmit = (e) => {
    e.preventDefault()
    setQuickTrackError('')
    const q = quickTrackInput.trim().toUpperCase()
    if (!q) {
      setQuickTrackError('Please enter a Grievance ID')
      return
    }

    const match = grievances.find(
      (g) => g.id.toUpperCase() === q || g.id.toUpperCase().includes(q)
    )
    if (match) {
      setSelectedGrievance(match)
      setQuickTrackInput('')
      setQuickTrackError('')
    } else {
      setQuickTrackError(`No record found matching "${q}".`)
    }
  }

  // Handle Feedback Submission
  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    if (!feedbackGrievance) return

    saveGrievanceFeedback(feedbackGrievance.id, ratingStars, feedbackText, satisfactionChoice)

    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === feedbackGrievance.id) {
          return {
            ...g,
            status: 'Closed',
            statusStep: 6,
            feedbackPending: false,
            feedback: {
              rating: ratingStars,
              comment: feedbackText || "Citizen acknowledged resolution.",
              satisfactory: satisfactionChoice,
              submittedAt: "Just now"
            }
          }
        }
        return g
      })
    )

    setFeedbackSuccess(true)
    setTimeout(() => {
      setFeedbackSuccess(false)
      setFeedbackGrievance(null)
      setFeedbackText('')
    }, 1500)
  }

  // Copy ID
  const handleCopyId = (id) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  // Clear all data
  const handleClearAll = () => {
    clearAllCitizenData()
    setGrievances([])
    setActivities([])
    setSelectedGrievance(null)
  }

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
      case 'Under Review':
      case 'Assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            In Progress
          </span>
        )
      case 'Resolved':
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <FiCheck className="w-3 h-3 text-emerald-600 stroke-[3]" />
            Resolved
          </span>
        )
      case 'Submitted':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#14213D] text-[#E8A33D]">
            <FiCheck className="w-3 h-3 stroke-[3]" />
            Submitted
          </span>
        )
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#F2EFE6] text-[#1A1A1A] font-roboto py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">

        {/* ==================================================
            DASHBOARD HEADER
            ================================================== */}
        <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[#3D5A80]">
                  Citizen Portal
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <FiShield className="w-3 h-3" />
                  Verified Account
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
                Citizen Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Welcome back, {session?.user?.name || CITIZEN_PROFILE.name}. Track the progress of public problems you have reported.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {grievances.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
                  title="Clear all stored data"
                >
                  Clear Data
                </button>
              )}
              <Link
                href="/submit-problem"
                className="inline-flex items-center gap-2 bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
              >
                <FiPlus className="w-4 h-4 stroke-[3]" />
                <span>Report a Problem</span>
              </Link>
            </div>
          </div>

          {/* 3 Metric Counters */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="p-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Total Reported
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#14213D] mt-0.5 block">
                {metrics.total}
              </span>
            </div>
            <div className="p-2 border-x border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                In Progress
              </span>
              <span className="text-xl sm:text-2xl font-bold text-amber-700 mt-0.5 block">
                {metrics.inProgress}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Resolved
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#4C8C6B] mt-0.5 block">
                {metrics.resolved}
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            NEW SUBMISSION ALERT (IF REDIRECTED)
            ================================================== */}
        {showNewAlert && newSubmissionId && (
          <div className="bg-[#4C8C6B]/15 border border-[#4C8C6B]/30 rounded-xl p-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-[#14213D]">
              <span className="w-5 h-5 rounded-full bg-[#4C8C6B] text-white flex items-center justify-center shrink-0">
                <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <span>
                Your grievance <strong>{newSubmissionId}</strong> has been registered and is now listed below for live tracking.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowNewAlert(false)}
              className="text-slate-500 hover:text-slate-800 text-base font-bold leading-none cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}

        {/* ==================================================
            MAIN CONTENT: 2-COLUMN BALANCED LAYOUT
            ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: PROBLEMS LIST (8 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by problem name, ID or locality..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#3D5A80]"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                {[
                  { key: 'All', label: `All (${metrics.total})` },
                  { key: 'In Progress', label: `In Progress (${metrics.inProgress})` },
                  { key: 'Resolved', label: `Resolved (${metrics.resolved})` }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
                      statusFilter === tab.key
                        ? 'bg-[#14213D] text-[#E8A33D] font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Grievances */}
            {filteredGrievances.length > 0 ? (
              <div className="space-y-3">
                {filteredGrievances.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-[#D9D4C6] p-4 sm:p-5 shadow-xs hover:border-[#3D5A80]/60 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#14213D] bg-slate-100 px-2 py-0.5 rounded">
                            {item.id}
                          </span>
                          <span className="text-[11px] text-slate-600 bg-[#F2EFE6] px-2 py-0.5 rounded font-medium">
                            {item.category}
                          </span>
                          {item.priority === 'High' && (
                            <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                              High Priority
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[#14213D]">
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.locality}</span>
                        </div>

                        {item.feedback && (
                          <div className="flex items-center gap-1.5 pt-1 text-xs text-amber-600">
                            <span className="text-slate-500">Your Rating:</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-3 h-3 ${i < item.feedback.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status & Action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                        <div>{renderStatusBadge(item.status)}</div>
                        <span className="text-[11px] text-slate-400">
                          {item.submittedAt || "Recently submitted"}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-1">
                          {item.status === 'Resolved' && !item.feedback && (
                            <button
                              type="button"
                              onClick={() => setFeedbackGrievance(item)}
                              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold text-xs transition cursor-pointer"
                            >
                              Rate Resolution
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedGrievance(item)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            Track
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* CLEAN EMPTY STATE */
              <div className="bg-white rounded-xl border border-[#D9D4C6] p-8 sm:p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg mb-3">
                  <FiFileText className="w-6 h-6" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#14213D]">
                  No problems reported yet
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  When you report a public problem, it will be listed here with its resolution progress.
                </p>
                <div className="mt-5">
                  <Link
                    href="/submit-problem"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4 stroke-[3]" />
                    <span>Report a Problem</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: UTILITY & HELPLINE CARDS (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Quick Track by ID Card */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-4 sm:p-5 shadow-xs">
              <h3 className="text-xs font-bold text-[#14213D] uppercase tracking-wider mb-1">
                Quick Track by Receipt ID
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">
                Have a grievance ID from SMS or receipt? Enter below to view progress.
              </p>
              <form onSubmit={handleQuickTrackSubmit} className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={quickTrackInput}
                    onChange={(e) => setQuickTrackInput(e.target.value)}
                    placeholder="e.g. JSS-2026-00101"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs uppercase focus:outline-none focus:ring-1 focus:ring-[#3D5A80]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-[#14213D] text-[#E8A33D] font-bold text-xs hover:bg-[#1a2b4f] transition cursor-pointer"
                  >
                    Track
                  </button>
                </div>
                {quickTrackError && (
                  <p className="text-[11px] text-red-600">{quickTrackError}</p>
                )}
              </form>
            </div>

            {/* Citizen Profile & Ward Info */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-4 sm:p-5 shadow-xs text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#14213D]">Citizen Profile</span>
                <span className="text-[10px] text-slate-500 font-mono">{CITIZEN_PROFILE.id}</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-medium text-slate-800">{session?.user?.name || CITIZEN_PROFILE.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ward / City:</span>
                  <span className="font-medium text-slate-800">{CITIZEN_PROFILE.locality}, {CITIZEN_PROFILE.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-medium text-slate-800">{CITIZEN_PROFILE.phone}</span>
                </div>
              </div>
            </div>

            {/* 24x7 Citizen Helpline */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-4 sm:p-5 shadow-xs text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#3D5A80]">
                <FiPhoneCall className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[11px]">Civic Helpline</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                For urgent emergencies, power hazards, or water pipeline burst:
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 font-mono font-bold text-[#14213D] text-sm text-center">
                Toll-Free Helpline: 181
              </div>
            </div>

            {/* Recent Status Updates (if any) */}
            {activities.length > 0 && (
              <div className="bg-white rounded-xl border border-[#D9D4C6] p-4 sm:p-5 shadow-xs text-xs">
                <h3 className="font-bold text-[#14213D] uppercase tracking-wider text-[11px] mb-2.5 pb-2 border-b border-slate-100">
                  Latest Status Updates
                </h3>
                <div className="space-y-2.5">
                  {activities.slice(0, 3).map((act) => (
                    <div key={act.id} className="text-[11px] space-y-0.5">
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>{act.dateGroup}</span>
                        <span>{act.time}</span>
                      </div>
                      <p className="text-slate-700 leading-snug">{act.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ==================================================
          DETAILED TRACKING MODAL WITH RECEIPT & COPY
          ================================================== */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-[#D9D4C6] max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#14213D] text-white p-5 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase font-semibold text-[#E8A33D] tracking-wide block">
                    Grievance Status
                  </span>
                  <span>•</span>
                  <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                    {selectedGrievance.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">
                  {selectedGrievance.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <FiMapPin className="w-3.5 h-3.5 text-[#E8A33D]" />
                  <span>{selectedGrievance.locality}, {selectedGrievance.city}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGrievance(null)}
                className="text-slate-300 hover:text-white text-xl font-bold leading-none p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              
              {/* Metadata strip */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">Current Status</span>
                  <div className="mt-1">{renderStatusBadge(selectedGrievance.status)}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">Submitted Date</span>
                  <span className="font-medium text-slate-800 mt-1 block">{selectedGrievance.submittedAt || "Recently"}</span>
                </div>
              </div>

              {/* Department Assigned */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Nodal Authority</span>
                <p className="text-slate-600">{selectedGrievance.department || "Municipal Corporation / Local Ward Office"}</p>
                <p className="text-slate-400 text-[10px]">Expected Resolution: {selectedGrievance.expectedResolution || "Within standard civic timeframe"}</p>
              </div>

              {/* 4-Stage Progress Timeline */}
              <div className="space-y-3 pt-2 pl-2">
                <span className="font-bold text-[#14213D] uppercase tracking-wider text-[11px] block mb-2">
                  Civic Progress Stages
                </span>

                {/* Step 1: Submitted */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <FiCheck className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#14213D]">1. Submitted</p>
                    <p className="text-slate-500 text-[11px]">Recorded in public grievance registry with digital receipt ID.</p>
                  </div>
                </div>

                {/* Step 2: Department Routing */}
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedGrievance.statusStep >= 2
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#E8A33D] text-[#14213D]'
                  }`}>
                    {selectedGrievance.statusStep >= 2 ? (
                      <FiCheck className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14213D]"></span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#14213D]">2. Department Routing</p>
                    <p className="text-slate-500 text-[11px]">
                      {selectedGrievance.statusStep >= 2
                        ? `Assigned to ${selectedGrievance.department || 'Nodal Department'}.`
                        : 'Categorizing problem and assigning to responsible field officer.'}
                    </p>
                  </div>
                </div>

                {/* Step 3: Action In Progress */}
                <div className={`flex items-start gap-3 ${selectedGrievance.statusStep < 3 ? 'opacity-60' : ''}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedGrievance.statusStep > 3
                      ? 'bg-emerald-600 text-white'
                      : selectedGrievance.statusStep === 3
                      ? 'bg-[#E8A33D] text-[#14213D]'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {selectedGrievance.statusStep > 3 ? (
                      <FiCheck className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span className="text-[10px]">3</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">3. Action In Progress</p>
                    <p className="text-slate-500 text-[11px]">Inspection scheduled and field maintenance team deployed.</p>
                  </div>
                </div>

                {/* Step 4: Resolved */}
                <div className={`flex items-start gap-3 ${selectedGrievance.statusStep < 5 ? 'opacity-50' : ''}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedGrievance.statusStep >= 5
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {selectedGrievance.statusStep >= 5 ? (
                      <FiCheck className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span className="text-[10px]">4</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">4. Resolved</p>
                    <p className="text-slate-500 text-[11px]">Work verified by department and ready for citizen confirmation.</p>
                  </div>
                </div>
              </div>

              {/* Citizen feedback note if already submitted */}
              {selectedGrievance.feedback && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-emerald-900">Your Confirmation</span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-3 h-3 ${i < selectedGrievance.feedback.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 italic text-[11px]">
                    &ldquo;{selectedGrievance.feedback.comment}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyId(selectedGrievance.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <FiShare2 className="w-3.5 h-3.5" />
                  <span>{copiedId ? "Copied!" : "Copy ID"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <FiPrinter className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGrievance(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          CITIZEN RESOLUTION FEEDBACK MODAL
          ================================================== */}
      {feedbackGrievance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-[#D9D4C6] max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-[#14213D] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-semibold text-[#E8A33D] tracking-wide">
                  Resolution Review
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">
                  Rate Service: {feedbackGrievance.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackGrievance(null)}
                className="text-slate-300 hover:text-white text-xl font-bold leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {feedbackSuccess ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-lg">
                  <FiCheck className="w-5 h-5 stroke-[3]" />
                </div>
                <h4 className="font-bold text-[#14213D] text-sm">
                  Feedback Submitted
                </h4>
                <p className="text-xs text-slate-600">
                  Thank you for rating civic resolution quality.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Problem Title
                  </label>
                  <p className="text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 truncate">
                    {feedbackGrievance.title}
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Was the problem resolved satisfactorily?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Yes', 'Partially', 'No'].map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setSatisfactionChoice(choice)}
                        className={`py-2 rounded-lg border font-semibold text-center transition cursor-pointer ${
                          satisfactionChoice === choice
                            ? 'bg-[#14213D] text-[#E8A33D] border-[#14213D]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingStars(star)}
                        className="p-1 cursor-pointer transition hover:scale-110"
                      >
                        <FiStar
                          className={`w-5 h-5 ${
                            star <= ratingStars
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {ratingStars}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Citizen Remarks (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Provide any feedback for the ground repair team..."
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#3D5A80]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackGrievance(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold transition cursor-pointer"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default function EnhancedDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F2EFE6] text-slate-600 font-roboto">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#E8A33D] border-t-transparent animate-spin" />
            <span>Loading Dashboard...</span>
          </div>
        </div>
      }
    >
      <EnhancedDashboardContent />
    </Suspense>
  )
}
