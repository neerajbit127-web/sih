"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {
  FiBriefcase,
  FiPlus,
  FiCheck,
  FiShield
} from 'react-icons/fi'
import DashboardRoleSwitcher from '@/component/DashboardRoleSwitcher'
import {
  DEFAULT_PROFILES,
  INITIAL_COMPANY_PROJECTS
} from '@/lib/stakeholderData'

export default function CompanyDashboardPage() {
  const [profile] = useState(DEFAULT_PROFILES.company)
  const [projects, setProjects] = useState(INITIAL_COMPANY_PROJECTS)
  const [showPledgeModal, setShowPledgeModal] = useState(false)

  // New grant pledge state
  const [pledgeTitle, setPledgeTitle] = useState('')
  const [pledgePartner, setPledgePartner] = useState('University Innovation Hub')
  const [pledgeAmount, setPledgeAmount] = useState('₹5,00,000')

  const handleCreatePledge = (e) => {
    e.preventDefault()
    if (!pledgeTitle.trim()) return

    const newP = {
      id: `CSR-PRJ-0${projects.length + 1}`,
      title: pledgeTitle.trim(),
      partnerUniversity: pledgePartner,
      studentLead: 'Campus Innovation Cell',
      committedFund: pledgeAmount,
      disbursed: '₹0 (Sanctioned)',
      beneficiaries: 'Under Assessment',
      status: 'Pledged & Sanctioned'
    }

    setProjects([newP, ...projects])
    setShowPledgeModal(false)
    setPledgeTitle('')
  }

  return (
    <div className="w-full min-h-screen bg-[#F2EFE6] text-[#1A1A1A] font-roboto py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Role Switcher Bar */}
        <DashboardRoleSwitcher activeRole="company" />

        {/* ==================================================
            COMPANY HEADER CARD
            ================================================== */}
        <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[#3D5A80]">
                  Corporate Social Responsibility (CSR) & Industry Co-Innovation
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <FiShield className="w-3 h-3" />
                  Corporate Account
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
                Corporate Partner & CSR Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Welcome, <strong className="text-[#14213D]">{profile.name}</strong>. 
                Sponsor university civic tech prototypes, fund SIH innovation challenges, and scout top engineering talent.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowPledgeModal(true)}
                className="inline-flex items-center gap-2 bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
              >
                <FiPlus className="w-4 h-4 stroke-[3]" />
                <span>Pledge CSR Grant</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Strips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="p-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Committed CSR Budget
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                {profile.committedCsrBudget}
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Fund Disbursed to Date
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                {profile.disbursedBudget}
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Prototypes Funded
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#3D5A80] mt-0.5 block">
                {projects.length} Projects
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Talent Recruited
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                00
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            MAIN CONTENT
            ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: CSR INITIATIVES (8 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-4 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#14213D]">
                  Funded University Prototypes & Civic Impact Initiatives
                </h2>
                <p className="text-xs text-slate-500">
                  Track project milestone deliverables, university partners, and citizen beneficiaries.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                {projects.length} Initiatives
              </span>
            </div>

            {/* Projects List or Clean Empty State */}
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs hover:border-[#3D5A80]/60 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#14213D] bg-slate-100 px-2 py-0.5 rounded">
                            {item.id}
                          </span>
                          <span className="text-[11px] text-slate-600 bg-[#F2EFE6] px-2 py-0.5 rounded font-medium">
                            Partner: {item.partnerUniversity}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {item.committedFund} Committed
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#14213D] leading-snug">
                          {item.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="text-slate-700">
                            Student Lead: <strong>{item.studentLead}</strong>
                          </span>
                          <span>•</span>
                          <span className="text-emerald-800 font-semibold">
                            Beneficiaries: {item.beneficiaries}
                          </span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                          <FiCheck className="w-3 h-3 text-emerald-600 stroke-[3]" />
                          {item.status}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Disbursed: {item.disbursed}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#D9D4C6] p-8 sm:p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg mb-3">
                  <FiBriefcase className="w-6 h-6" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#14213D]">
                  No funded prototypes yet
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Click &ldquo;Pledge CSR Grant&rdquo; to sponsor university engineering prototypes and civic tech solutions.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowPledgeModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4 stroke-[3]" />
                    <span>Pledge CSR Grant</span>
                  </button>
                </div>
              </div>
            )}

            {/* Talent Scouting Leaderboard */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-[#14213D] text-sm">
                  Civic Innovators Talent Scouting Pipeline
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  0 Candidates
                </span>
              </div>

              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No active applicant profiles in scouting pipeline. When student innovators publish verified solutions, they will be discoverable here.
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CORPORATE PROFILE & ESG METRICS (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Corporate Profile Card */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#14213D]">Corporate Entity</span>
                <span className="font-mono text-slate-500 text-[11px]">{profile.id}</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Company:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Representative:</span>
                  <span className="font-medium text-slate-800">{profile.representative}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">{profile.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Core Sector:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">{profile.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CSR Email:</span>
                  <span className="font-mono text-[11px] text-slate-800">{profile.corporateEmail}</span>
                </div>
              </div>
            </div>

            {/* ESG & Sustainability Tracker */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-3">
              <h3 className="font-bold text-[#14213D] uppercase tracking-wider text-[11px]">
                ESG & Sustainability Impact Tracker
              </h3>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Carbon Offset via Microgrids</span>
                  <strong className="text-slate-700">0 Tonnes CO2</strong>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Clean Water Supplied</span>
                  <strong className="text-slate-700">0 Litres</strong>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Citizens Reached</span>
                  <strong className="text-slate-700">0 Citizens</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-center">
                CSR Portfolio Status: Clean
              </div>
            </div>

            {/* University R&D MoUs */}
            <div className="bg-[#14213D] text-white rounded-xl p-5 shadow-xs text-xs space-y-2">
              <h3 className="font-bold text-[#E8A33D] uppercase tracking-wider text-[11px]">
                Partner University Innovation Hubs
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Fund academic hardware labs and co-sponsor patent filings for student innovators.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/university"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E8A33D] hover:underline font-bold"
                >
                  <span>View University Innovation Hub</span>
                  &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          PLEDGE CSR GRANT MODAL
          ================================================== */}
      {showPledgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-[#D9D4C6] max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-[#14213D] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-semibold text-[#E8A33D] tracking-wide block">
                  CSR Grant Allocation
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Pledge Innovation Seed Grant
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPledgeModal(false)}
                className="text-slate-300 hover:text-white text-xl font-bold leading-none p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePledge} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  CSR Initiative Title <span className="text-[#E8A33D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pledgeTitle}
                  onChange={(e) => setPledgeTitle(e.target.value)}
                  placeholder="e.g. Solar LED Streetlights for Slum Clusters"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#3D5A80]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Partner Academic Institution
                </label>
                <input
                  type="text"
                  value={pledgePartner}
                  onChange={(e) => setPledgePartner(e.target.value)}
                  placeholder="e.g. State Technical University"
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Committed Grant Amount
                </label>
                <input
                  type="text"
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPledgeModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Confirm & Sanction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
