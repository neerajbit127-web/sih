"use client"
import React, { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  FiPlus,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiAlertTriangle,
  FiEye,
  FiMessageSquare,
  FiUsers,
  FiFileText,
  FiShare2,
  FiActivity,
  FiBell,
  FiBarChart2,
  FiStar,
  FiX,
  FiMapPin,
  FiCheck,
  FiImage
} from "react-icons/fi"

export default function Home() {
  const { data: session } = useSession()

  // State for interactive features
  const [selectedChallengeCategory, setSelectedChallengeCategory] = useState("All")
  const [grievanceModalOpen, setGrievanceModalOpen] = useState(false)
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false)
  const [grievanceForm, setGrievanceForm] = useState({
    title: "",
    category: "Infrastructure",
    location: "",
    description: "",
    urgency: "Medium"
  })

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackCategory, setFeedbackCategory] = useState("Platform Usability")
  const [feedbackComment, setFeedbackComment] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // Challenge Category Filter
  const challengesList = [

  ]

  const filteredChallenges = selectedChallengeCategory === "All"
    ? challengesList
    : challengesList.filter(c => c.category === selectedChallengeCategory)

  const handleGrievanceSubmit = (e) => {
    e.preventDefault()
    setGrievanceSubmitted(true)
    setTimeout(() => {
      setGrievanceSubmitted(false)
      setGrievanceModalOpen(false)
      setGrievanceForm({ title: "", category: "Infrastructure", location: "", description: "", urgency: "Medium" })
    }, 2000)
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    setFeedbackSubmitted(true)
    setTimeout(() => {
      setFeedbackSubmitted(false)
      setFeedbackComment("")
    }, 2200)
  }

  return (
    <div className="w-full bg-[#F2EFE6] text-[#1A1A1A]">
      {/* ==================================================
          SECTION 2: HERO SECTION
          ================================================== */}
      <section className="w-full bg-[#14213D] text-white py-14 sm:py-20 lg:py-22 border-b border-[#3D5A80]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Content */}
            <div className="lg:col-span-7"> 
              {session && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded bg-[#182746] border border-[#3D5A80]/50 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4C8C6B]"></span>
                  <span>Signed in as <strong className="text-white font-medium">{session.user?.email}</strong></span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-white leading-[1.18] tracking-tight">
                Your Voice. <span className="text-[#E8A33D]">Our Action.</span>
              </h1>

              <p className="mt-3 text-slate-300 font-medium text-base sm:text-lg">
                A smarter way to report, track and resolve public issues.
              </p>

              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Jan Samadhaan Setu connects citizens with the right authorities through a transparent and trackable digital platform for public grievances and community challenges.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <button
                  onClick={() => setGrievanceModalOpen(true)}
                  className="px-6 py-3 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-semibold text-sm transition shadow-sm active:scale-[0.99] cursor-pointer inline-flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Submit a Grievance</span>
                </button>

                <Link
                  href="/challenges"
                  className="px-5 py-3 rounded-lg bg-[#182746] hover:bg-[#1f3156] text-white font-medium text-sm border border-[#3D5A80]/60 transition inline-flex items-center gap-2"
                >
                  <span>Explore Challenges</span>
                  <FiArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ==================================================
          SECTION 5: WHY JAN SAMADHAAN SETU?
          ================================================== */}
      <section className="w-full bg-[#F2EFE6] py-14 sm:py-20 border-b border-[#D9D4C6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3D5A80]">
              The Core Problem
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#14213D] mt-1.5">
              Why Jan Samadhaan Setu?
            </h2>
            <p className="mt-3 text-slate-700 text-sm sm:text-base leading-relaxed">
              Public issues often involve multiple departments, communication channels and follow-ups. The platform brings these interactions into one structured digital workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="p-5 rounded-xl bg-white border border-[#D9D4C6] shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#14213D]/10 text-[#14213D] flex items-center justify-center mb-4">
                <FiAlertTriangle className="w-5 h-5 text-[#14213D]" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#14213D]">
                Fragmented Systems
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Citizens may need to navigate different channels and departments to report public issues.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-xl bg-white border border-[#D9D4C6] shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#14213D]/10 text-[#14213D] flex items-center justify-center mb-4">
                <FiEye className="w-5 h-5 text-[#14213D]" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#14213D]">
                Limited Visibility
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                After reporting an issue, it can be difficult to understand where it stands or who is handling it.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-xl bg-white border border-[#D9D4C6] shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#14213D]/10 text-[#14213D] flex items-center justify-center mb-4">
                <FiClock className="w-5 h-5 text-[#14213D]" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#14213D]">
                Delayed Communication
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Communication between citizens and responsible authorities can be difficult to track.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-xl bg-white border border-[#D9D4C6] shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-[#14213D]/10 text-[#14213D] flex items-center justify-center mb-4">
                <FiUsers className="w-5 h-5 text-[#14213D]" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#14213D]">
                Citizen Participation
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Communities need a structured way to contribute information, feedback and possible solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 6: HOW IT WORKS
          ================================================== */}
      <section id="how-it-works" className="w-full bg-white py-14 sm:py-20 border-b border-[#D9D4C6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3D5A80]">
              Lifecycle of a Grievance
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#14213D] mt-1.5">
              How It Works
            </h2>
            <p className="mt-3 text-slate-700 text-sm sm:text-base leading-relaxed">
              From reporting an issue to tracking its resolution, every step is visible through a simple digital workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-xl bg-[#F2EFE6] border border-[#D9D4C6] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#E8A33D] block mb-2">01</span>
                <h3 className="text-lg font-serif font-bold text-[#14213D]">Report</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Submit an issue with relevant details, location and supporting information.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#D9D4C6] text-[11px] font-medium text-[#3D5A80]">
                • Photo & Location Tagging
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl bg-[#F2EFE6] border border-[#D9D4C6] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#E8A33D] block mb-2">02</span>
                <h3 className="text-lg font-serif font-bold text-[#14213D]">Route</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The platform identifies the relevant category and department.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#D9D4C6] text-[11px] font-medium text-[#3D5A80]">
                • Auto-Classification & Assigning
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl bg-[#F2EFE6] border border-[#D9D4C6] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#E8A33D] block mb-2">03</span>
                <h3 className="text-lg font-serif font-bold text-[#14213D]">Track</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Monitor the progress of your grievance through its lifecycle.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#D9D4C6] text-[11px] font-medium text-[#3D5A80]">
                • Real-Time Status Updates
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-xl bg-[#F2EFE6] border border-[#D9D4C6] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#E8A33D] block mb-2">04</span>
                <h3 className="text-lg font-serif font-bold text-[#14213D]">Resolve</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Receive updates as the responsible authority works toward resolution.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#D9D4C6] text-[11px] font-medium text-[#4C8C6B]">
                • Citizen Feedback & Closure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 13: FINAL CTA
          ================================================== */}
      <section className="w-full bg-[#14213D] text-white py-14 sm:py-18 border-t border-[#3D5A80]/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#E8A33D]">
            Take Action Today
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mt-1.5">
            Have an issue that needs attention?
          </h2>
          <p className="mt-2 text-slate-300 font-medium text-base sm:text-lg">
            Report it. Track it. Resolve it.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setGrievanceModalOpen(true)}
              className="px-6 py-3 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-semibold text-sm transition shadow-sm active:scale-95 cursor-pointer"
            >
              Submit a Grievance
            </button>

            <Link
              href="/challenges"
              className="px-5 py-3 rounded-lg bg-[#182746] hover:bg-[#1f3156] text-white font-medium text-sm border border-[#3D5A80]/60 transition"
            >
              Explore Challenges
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Smart India Hackathon Innovation Platform • Empowering citizen-government collaboration
          </p>
        </div>
      </section>

      {/* ==================================================
          SUBMIT GRIEVANCE MODAL
          ================================================== */}
      {grievanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#D9D4C6] overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-[#14213D] text-white">
              <button
                onClick={() => setGrievanceModalOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-mono text-[#E8A33D]">Citizen Grievance Redressal</span>
              <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                Submit Public Grievance
              </h3>
            </div>

            {grievanceSubmitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#4C8C6B]/20 text-[#4C8C6B] mx-auto flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-serif font-bold text-[#14213D]">
                  Grievance Registered Successfully!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your reference ID is <strong className="font-mono text-[#14213D]">#JSS-2026-00481</strong>. It has been automatically routed to the designated nodal officer.
                </p>
              </div>
            ) : (
              <form onSubmit={handleGrievanceSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Title / Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broken drainage pipe causing water logging"
                    value={grievanceForm.title}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={grievanceForm.category}
                      onChange={(e) => setGrievanceForm({ ...grievanceForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none"
                    >
                      <option>Infrastructure</option>
                      <option>Water Supply</option>
                      <option>Healthcare</option>
                      <option>Sanitation & Waste</option>
                      <option>Electricity</option>
                      <option>Transport</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Urgency</label>
                    <select
                      value={grievanceForm.urgency}
                      onChange={(e) => setGrievanceForm({ ...grievanceForm, urgency: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none"
                    >
                      <option>Standard</option>
                      <option>Medium</option>
                      <option>High Priority</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Landmark / Ward</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ward 14, Main Market Road, Near Primary Health Centre"
                    value={grievanceForm.location}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide specific details about the issue, duration of problem, and impact on local residents..."
                    value={grievanceForm.description}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setGrievanceModalOpen(false)}
                    className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    Submit Grievance
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