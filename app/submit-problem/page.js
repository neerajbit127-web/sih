"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FiArrowLeft,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiAward,
  FiCalendar,
  FiMapPin,
  FiLayers,
  FiEye,
  FiCheck,
  FiShield,
  FiHelpCircle
} from 'react-icons/fi'
import { DOMAINS, addStoredChallenge } from '@/lib/challengesData'

export default function SubmitProblemPage() {
  const router = useRouter()
  const domainOptions = DOMAINS.filter(d => d !== "All Domains")

  const [form, setForm] = useState({
    title: '',
    organization: '',
    department: '',
    leadEmail: '',
    contactPhone: '',
    region: '',
    domain: domainOptions[0] || 'Domain 1',
    urgency: 'Priority',
    summary: '',
    background: '',
    impact: '10,000+ Citizens affected',
    bounty: '₹1,00,000 Grant',
    deadline: '45 Days Remaining',
    objectives: 'Design scalable MVP architecture\nBuild working software prototype\nDeliver documentation and API endpoints',
    deliverables: 'Functional prototype, GitHub source code repository, architecture design document, and evaluation dataset.',
    tags: 'Civic Tech, Innovation, Public Service'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdChallengeId, setCreatedChallengeId] = useState(null)
  const [activeTab, setActiveTab] = useState('editor') // 'editor' | 'preview'

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const objectivesList = form.objectives
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean)

    const tagsList = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const newChallenge = {
      id: `CHALLENGE-${Date.now().toString().slice(-4)}`,
      title: form.title.trim() || "Untitled Public Challenge",
      organization: form.organization.trim() || "Public Authority / Institution",
      region: form.region.trim() || "National / Multi-Region",
      domain: form.domain,
      status: "Open for Solutions",
      urgency: form.urgency,
      summary: form.summary.trim() || "Problem statement summary.",
      impact: form.impact.trim() || "Broad Civic Impact",
      teamsCount: 0,
      upvotes: 0,
      bounty: form.bounty.trim() || "Grant Amount",
      deadline: form.deadline.trim() || "30 days left",
      tags: tagsList.length > 0 ? tagsList : [form.domain],
      background: form.background.trim() || form.summary.trim(),
      objectives: objectivesList.length > 0 ? objectivesList : ["Design solution architecture", "Develop functional prototype"],
      submissionDeliverables: form.deliverables.trim() || "Prototype repository and documentation."
    }

    // Save to shared localStorage module
    addStoredChallenge(newChallenge)
    setCreatedChallengeId(newChallenge.id)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 800)
  }

  return (
    <div className="w-full min-h-screen bg-[#F2EFE6] text-[#1A1A1A] font-roboto">
      {/* Top Hero Section */}
      <section className="w-full bg-[#14213D] text-white py-10 sm:py-14 border-b border-[#3D5A80]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
            <Link href="/" className="hover:text-[#E8A33D] transition">Home</Link>
            <span>/</span>
            <Link href="/challenges" className="hover:text-[#E8A33D] transition">Challenges</Link>
            <span>/</span>
            <span className="text-[#E8A33D]">Submit Problem Statement</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Submit a <span className="text-[#E8A33D]">Problem Statement</span>
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
                Empower innovators, researchers, and tech developers across India to solve critical civic, administrative, and societal challenges.
              </p>
            </div>

            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium border border-white/10 transition self-start md:self-auto cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Challenges</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {isSuccess ? (
          <div className="bg-white rounded-2xl border border-[#D9D4C6] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#4C8C6B]/15 text-[#4C8C6B] mx-auto flex items-center justify-center text-3xl font-bold mb-5">
              <FiCheck className="w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14213D]">
              Problem Statement Successfully Published!
            </h2>
            <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
              Your problem statement has been assigned ID <strong className="text-[#14213D]">{createdChallengeId}</strong> and is now live on the public challenge board for solver teams.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/challenges"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-sm transition shadow-sm"
              >
                View on Challenges Board
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false)
                  setForm({
                    title: '',
                    organization: '',
                    department: '',
                    leadEmail: '',
                    contactPhone: '',
                    region: '',
                    domain: domainOptions[0] || 'Domain 1',
                    urgency: 'Priority',
                    summary: '',
                    background: '',
                    impact: '',
                    bounty: '',
                    deadline: '45 Days Remaining',
                    objectives: '',
                    deliverables: '',
                    tags: ''
                  })
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
              >
                Submit Another Statement
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form (8 cols) */}
            <div className="lg:col-span-8">
              {/* Tab Toggle for Mobile/Preview */}
              <div className="flex lg:hidden items-center gap-2 mb-6 p-1 bg-white rounded-lg border border-[#D9D4C6]">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${activeTab === 'editor' ? 'bg-[#14213D] text-white' : 'text-slate-600'}`}
                >
                  Edit Form
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${activeTab === 'preview' ? 'bg-[#14213D] text-white' : 'text-slate-600'}`}
                >
                  Live Preview
                </button>
              </div>

              <div className={`bg-white rounded-2xl border border-[#D9D4C6] p-6 sm:p-8 shadow-sm ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Submitting Organization */}
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                      <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                        1
                      </span>
                      <h3 className="text-base font-bold text-[#14213D]">
                        Authority & Proposer Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-normal">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Organization / Public Department <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ministry of Jal Shakti / PMC"
                          value={form.organization}
                          onChange={(e) => setForm({ ...form, organization: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Department / Division
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Urban Water Resources Division"
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Lead Contact Official Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="official@gov.in"
                          value={form.leadEmail}
                          onChange={(e) => setForm({ ...form, leadEmail: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Region / Jurisdiction Location <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="City, State (e.g. Nagpur, Maharashtra)"
                          value={form.region}
                          onChange={(e) => setForm({ ...form, region: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Problem Classification */}
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                      <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                        2
                      </span>
                      <h3 className="text-base font-bold text-[#14213D]">
                        Problem Classification & Scope
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-normal">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Domain / Theme <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={form.domain}
                          onChange={(e) => setForm({ ...form, domain: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none bg-white cursor-pointer"
                        >
                          {domainOptions.map(domain => (
                            <option key={domain} value={domain}>{domain}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Priority / Urgency
                        </label>
                        <select
                          value={form.urgency}
                          onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none bg-white cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Priority">Priority</option>
                          <option value="Featured">Featured</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Target Beneficiaries / Impact
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 50,000 Commuters"
                          value={form.impact}
                          onChange={(e) => setForm({ ...form, impact: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Problem Description */}
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                      <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                        3
                      </span>
                      <h3 className="text-base font-bold text-[#14213D]">
                        Problem Statement Details
                      </h3>
                    </div>

                    <div className="space-y-4 text-xs font-normal">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Challenge Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="A clear, actionable title for the challenge..."
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Executive Summary (Brief Overview) <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Summarize the core problem statement, affected public groups, and the required technological intervention..."
                          value={form.summary}
                          onChange={(e) => setForm({ ...form, summary: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Detailed Background & Operational Constraints
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Provide in-depth contextual information, current manual workflows, existing infrastructure limitations, and why prior attempts failed..."
                          value={form.background}
                          onChange={(e) => setForm({ ...form, background: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Objectives & Deliverables */}
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                      <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                        4
                      </span>
                      <h3 className="text-base font-bold text-[#14213D]">
                        Milestones & Expected Deliverables
                      </h3>
                    </div>

                    <div className="space-y-4 text-xs font-normal">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Key Technical Objectives (one per line)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="e.g.&#10;Objective 1: Real-time telemetry data collection&#10;Objective 2: Low-latency alert dispatch system&#10;Objective 3: Public verification dashboard"
                          value={form.objectives}
                          onChange={(e) => setForm({ ...form, objectives: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none font-mono text-[11px]"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Submission Deliverables Required From Solvers
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Working web/mobile MVP, open source repository, architecture documentation"
                          value={form.deliverables}
                          onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 5: Incentive & Timeline */}
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 mb-5">
                      <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#E8A33D] font-bold text-xs flex items-center justify-center">
                        5
                      </span>
                      <h3 className="text-base font-bold text-[#14213D]">
                        Incentives, Tags & Timeline
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-normal">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Innovation Grant / Bounty
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹1,00,000 or Grant Amount"
                          value={form.bounty}
                          onChange={(e) => setForm({ ...form, bounty: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Submission Window / Deadline
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 30 days left / Nov 15, 2026"
                          value={form.deadline}
                          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. IoT, Civic, Healthcare"
                          value={form.tags}
                          onChange={(e) => setForm({ ...form, tags: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submission Action */}
                  <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <FiShield className="w-4 h-4 text-[#4C8C6B]" />
                      Verified submission complies with Jan Samadhaan Setu governance standards.
                    </p>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Link
                        href="/challenges"
                        className="px-5 py-2.5 rounded-lg border border-[#D9D4C6] hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm text-center flex-1 sm:flex-none transition cursor-pointer"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 flex-1 sm:flex-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-[#14213D] border-t-transparent rounded-full animate-spin"></span>
                            <span>Publishing Statement...</span>
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="w-4 h-4" />
                            <span>Publish Problem Statement</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Live Card Preview & Submission Guidelines (4 cols) */}
            <div className={`lg:col-span-4 space-y-6 ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
              {/* Live Preview Card */}
              <div className="bg-white rounded-2xl border border-[#D9D4C6] p-5 shadow-sm sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#14213D] uppercase tracking-wider">
                    <FiEye className="w-4 h-4 text-[#E8A33D]" />
                    <span>Live Card Preview</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                    Live Sync
                  </span>
                </div>

                {/* Rendered Challenge Card */}
                <div className="rounded-xl border border-[#D9D4C6] bg-white p-4 shadow-sm hover:border-[#E8A33D] transition">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-[#3D5A80] truncate max-w-[150px]">
                      {form.organization || "Organization Name"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium text-[10px] border border-amber-200">
                      {form.urgency || "New"}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#14213D] text-sm line-clamp-2 leading-snug">
                    {form.title || "Challenge Title Goes Here"}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {form.summary || "Brief summary describing the problem statement, affected stakeholders, and required technological solution."}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                      <FiMapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[120px]">{form.region || "Region / Location"}</span>
                    </span>
                    <span className="font-bold text-[#14213D] text-xs">
                      {form.bounty || "Grant Amount"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-medium text-[#4C8C6B]">
                      Open for Solutions
                    </span>
                    <span className="text-[11px] text-[#3D5A80] font-medium">
                      {form.domain}
                    </span>
                  </div>
                </div>

                {/* Guidelines Box */}
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-[#14213D] flex items-center gap-1.5 uppercase tracking-wider">
                    <FiHelpCircle className="w-3.5 h-3.5 text-[#3D5A80]" />
                    Submission Guidelines
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#4C8C6B] font-bold">•</span>
                      <span>Specify clear metrics and measurable outcomes to attract quality solver teams.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#4C8C6B] font-bold">•</span>
                      <span>Mention any APIs, open data, or existing hardware constraints up front.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#4C8C6B] font-bold">•</span>
                      <span>Proposals submitted by solvers will be routed to your lead official email.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
