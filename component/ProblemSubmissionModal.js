"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { FiX, FiCheck, FiFileText, FiMapPin, FiLayers, FiMaximize2 } from 'react-icons/fi'
import { DOMAINS } from '@/lib/challengesData'

export default function ProblemSubmissionModal({ isOpen, onClose, onSubmitSuccess }) {
  const [form, setForm] = useState({
    title: '',
    organization: '',
    region: '',
    domain: 'Domain 1',
    summary: '',
    bounty: 'Grant Amount',
    urgency: 'New',
    objectives: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const domainOptions = DOMAINS.filter(d => d !== "All Domains")

  const handleSubmit = (e) => {
    e.preventDefault()

    const objectivesList = form.objectives
      ? form.objectives.split('\n').map(s => s.trim()).filter(Boolean)
      : ["Core objective 1", "Core objective 2"]

    const newChallenge = {
      id: `CHALLENGE-${Date.now().toString().slice(-4)}`,
      title: form.title.trim() || "Untitled Challenge",
      organization: form.organization.trim() || "Public Authority / Organization",
      region: form.region.trim() || "Location / Region",
      domain: form.domain || "Domain 1",
      status: "Open for Solutions",
      urgency: form.urgency || "New",
      summary: form.summary.trim() || "Problem statement summary goes here.",
      impact: "Measurable public impact",
      teamsCount: 0,
      upvotes: 0,
      bounty: form.bounty.trim() || "Grant Amount",
      deadline: "30 days left",
      tags: [form.domain || "General"],
      background: form.summary.trim(),
      objectives: objectivesList.length > 0 ? objectivesList : ["Implement core solution prototype", "Conduct pilot testing"],
      submissionDeliverables: "Solution prototype, source code repository, and deployment guide."
    }

    if (onSubmitSuccess) {
      onSubmitSuccess(newChallenge)
    }

    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      onClose()
      setForm({
        title: '',
        organization: '',
        region: '',
        domain: 'Domain 1',
        summary: '',
        bounty: 'Grant Amount',
        urgency: 'New',
        objectives: ''
      })
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-roboto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#D9D4C6] overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#14213D] text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiFileText className="w-5 h-5 text-[#E8A33D]" />
              Submit a Problem Statement
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 font-normal">
              Register a societal challenge for innovators and solver teams.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/submit-problem"
              onClick={onClose}
              title="Open full page editor"
              className="text-white/60 hover:text-[#E8A33D] transition p-1.5 rounded hover:bg-white/10"
            >
              <FiMaximize2 className="w-4 h-4" />
            </Link>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#4C8C6B]/20 text-[#4C8C6B] mx-auto flex items-center justify-center text-xl font-bold">
              <FiCheck className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-lg font-bold text-[#14213D]">
              Problem Statement Submitted!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto font-normal">
              Your problem statement has been validated and published to the challenges board.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs font-normal max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Organization / Authority Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Municipal Corporation, Department of Health"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Domain / Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none bg-white cursor-pointer"
                >
                  {domainOptions.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Region / Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Maharashtra"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Problem Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smart IoT Monitoring for Rural Water Distribution"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Problem Statement Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe the challenge, current bottleneck, and required technological intervention..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Grant / Bounty Amount
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹50,000 / Grant"
                  value={form.bounty}
                  onChange={(e) => setForm({ ...form, bounty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Urgency Level
                </label>
                <select
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Priority">Priority</option>
                  <option value="Featured">Featured</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/submit-problem"
                onClick={onClose}
                className="text-[#3D5A80] hover:text-[#14213D] font-medium underline underline-offset-2 flex items-center gap-1"
              >
                Need full submission form?
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold shadow-sm transition active:scale-95 cursor-pointer"
                >
                  Publish Challenge
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
