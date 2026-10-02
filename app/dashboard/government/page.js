"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {
  FiShield,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiTruck,
  FiCheck,
  FiPhoneCall
} from 'react-icons/fi'
import DashboardRoleSwitcher from '@/component/DashboardRoleSwitcher'
import {
  DEFAULT_PROFILES,
  INITIAL_GOV_GRIEVANCES
} from '@/lib/stakeholderData'

export default function GovernmentDashboardPage() {
  const [profile] = useState(DEFAULT_PROFILES.government)
  const [grievances, setGrievances] = useState(INITIAL_GOV_GRIEVANCES)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishedProblems, setPublishedProblems] = useState([])

  // New challenge form state
  const [newTitle, setNewTitle] = useState('')
  const [newDept, setNewDept] = useState('Public Works (Roads & Bridges)')
  const [newGrant, setNewGrant] = useState('₹75,000 Municipal Seed Grant')

  const handleResolveTicket = (id) => {
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: 'Resolved (Pending Citizen Verification)', slaRemaining: 'Completed' }
          : g
      )
    )
  }

  const handlePublishChallenge = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const item = {
      id: `GOV-CHL-0${publishedProblems.length + 1}`,
      title: newTitle.trim(),
      department: newDept,
      incentive: newGrant,
      teamsSolving: 0
    }
    setPublishedProblems([item, ...publishedProblems])
    setShowPublishModal(false)
    setNewTitle('')
  }

  return (
    <div className="w-full min-h-screen bg-[#F2EFE6] text-[#1A1A1A] font-roboto py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Role Switcher Bar */}
        <DashboardRoleSwitcher activeRole="government" />

        {/* ==================================================
            GOVERNMENT HEADER CARD
            ================================================== */}
        <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[#3D5A80]">
                  Civic Authority & Municipal Command Center
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <FiShield className="w-3 h-3" />
                  Nodal Authority Account
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
                Government & Municipal Operations Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Welcome, <strong className="text-[#14213D]">{profile.name}</strong>. 
                Triage citizen grievances, dispatch maintenance work crews, and publish technical challenges for academic solvers.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowPublishModal(true)}
                className="inline-flex items-center gap-2 bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
              >
                <FiPlus className="w-4 h-4 stroke-[3]" />
                <span>Publish Problem Statement</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Strips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="p-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Active Civic Tickets
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#14213D] mt-0.5 block">
                {String(grievances.length).padStart(2, '0')}
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                SLA Compliance Rate
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                {profile.slaComplianceRate}
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Field Staff Deployed
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#3D5A80] mt-0.5 block">
                {profile.assignedStaff} Crew
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                181 Call Escalations
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
          
          {/* LEFT COLUMN: TICKET TRIAGE & WORK ORDERS (8 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-4 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#14213D]">
                  Ward-Level Citizen Grievance Triage
                </h2>
                <p className="text-xs text-slate-500">
                  Prioritize urgent complaints, allocate field maintenance crews, and monitor SLA compliance countdowns.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                {grievances.length} Active Tickets
              </span>
            </div>

            {/* Grievances List or Clean Empty State */}
            {grievances.length > 0 ? (
              <div className="space-y-3">
                {grievances.map((item) => (
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
                            {item.ward}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.priority === 'Critical'
                              ? 'bg-red-100 text-red-800'
                              : item.priority === 'Urgent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.priority} Priority
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#14213D] leading-snug">
                          {item.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1 text-slate-700">
                            <FiTruck className="w-3.5 h-3.5 text-slate-400" />
                            <span>Crew: <strong>{item.assignedTeam}</strong></span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-800 font-semibold">
                            <FiClock className="w-3.5 h-3.5" />
                            <span>SLA Remaining: {item.slaRemaining}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.status}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {item.status.includes('Resolved') ? (
                            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                              <FiCheckCircle className="w-3.5 h-3.5" />
                              Work Completed
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleResolveTicket(item.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-[#4C8C6B] hover:bg-[#3d7256] text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
                            >
                              <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Mark Resolved</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#D9D4C6] p-8 sm:p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg mb-3">
                  <FiShield className="w-6 h-6" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#14213D]">
                  No active civic tickets
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  No pending complaints in this jurisdiction. Reported citizen grievances will appear here for triage and crew dispatch.
                </p>
              </div>
            )}

            {/* Published Challenges for Student Teams */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-[#14213D] text-sm">
                  Technical Problem Statements Published for Universities & Hackathons
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {publishedProblems.length} Active Challenges
                </span>
              </div>

              {publishedProblems.length > 0 ? (
                <div className="space-y-2.5 pt-1 text-xs">
                  {publishedProblems.map((prob) => (
                    <div key={prob.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{prob.id}</span>
                          <span className="font-bold text-[#14213D] text-sm">{prob.title}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{prob.department} • Incentive: <strong className="text-emerald-700">{prob.incentive}</strong></p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold self-start sm:self-center">
                        {prob.teamsSolving} Student Teams Registered
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No problem statements published yet. Click &ldquo;Publish Problem Statement&rdquo; to invite university innovators.
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: NODAL PROFILE & JURISDICTION (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Officer ID Card */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#14213D]">Nodal Authority Profile</span>
                <span className="font-mono text-slate-500 text-[11px]">{profile.id}</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Officer Name:</span>
                  <span className="font-medium text-slate-800">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">{profile.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">{profile.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jurisdiction:</span>
                  <span className="font-medium text-slate-800">{profile.jurisdiction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Official Gov Email:</span>
                  <span className="font-mono text-[11px] text-slate-800">{profile.officialEmail}</span>
                </div>
              </div>
            </div>

            {/* Helpline 181 Command */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#3D5A80]">
                <FiPhoneCall className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[11px]">181 State Call Center Triage</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Direct hotline link for urgent utility bursts, electric wire snaps, and flooding complaints.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-bold text-center">
                System Active • 24x7 Monitoring
              </div>
            </div>

            {/* Collaborate with Student Innovators */}
            <div className="bg-[#14213D] text-white rounded-xl p-5 shadow-xs text-xs space-y-2">
              <h3 className="font-bold text-[#E8A33D] uppercase tracking-wider text-[11px]">
                Collaborate with Universities
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Tap into university engineering labs and student teams to solve recurring road and sewage problems.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/student"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E8A33D] hover:underline font-bold"
                >
                  <span>Explore Student Solutions & Prototypes</span>
                  &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          PUBLISH PROBLEM MODAL
          ================================================== */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-[#D9D4C6] max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-[#14213D] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-semibold text-[#E8A33D] tracking-wide block">
                  Municipal Problem Statement
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Publish Challenge for Academic Solvers
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="text-slate-300 hover:text-white text-xl font-bold leading-none p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePublishChallenge} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Problem Title <span className="text-[#E8A33D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI-based Underground Water Pipe Burst Location Detection"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#3D5A80]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Responsible Civic Department
                </label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option>Public Works (Roads & Bridges)</option>
                  <option>Public Health & Sewerage (PHED)</option>
                  <option>Solid Waste Management & Sanitation</option>
                  <option>Discom Electricity Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilot Incentive / Prototype Grant
                </label>
                <input
                  type="text"
                  value={newGrant}
                  onChange={(e) => setNewGrant(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Publish Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
