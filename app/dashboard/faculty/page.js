"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {
  FiAward,
  FiUsers,
  FiCheck,
  FiFileText,
  FiCheckCircle,
  FiShield
} from 'react-icons/fi'
import DashboardRoleSwitcher from '@/component/DashboardRoleSwitcher'
import {
  DEFAULT_PROFILES,
  INITIAL_FACULTY_TEAMS,
  INITIAL_FACULTY_GRANTS
} from '@/lib/stakeholderData'

export default function FacultyDashboardPage() {
  const [profile] = useState(DEFAULT_PROFILES.faculty)
  const [teams, setTeams] = useState(INITIAL_FACULTY_TEAMS)
  const [grants] = useState(INITIAL_FACULTY_GRANTS)
  const [actionSuccess, setActionSuccess] = useState('')

  const handleApproveTeam = (id, teamName) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: 'Endorsed & Submitted to SIH', actionNeeded: 'None (Approved)' }
          : t
      )
    )
    setActionSuccess(`Successfully approved & endorsed ${teamName} for SIH funding!`)
    setTimeout(() => setActionSuccess(''), 3000)
  }

  return (
    <div className="w-full min-h-screen bg-[#F2EFE6] text-[#1A1A1A] font-roboto py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Role Switcher Bar */}
        <DashboardRoleSwitcher activeRole="faculty" />

        {/* ==================================================
            FACULTY HEADER CARD
            ================================================== */}
        <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[#3D5A80]">
                  Academic Mentorship & R&D Portal
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <FiShield className="w-3 h-3" />
                  Verified Faculty Mentor
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
                Faculty Mentor Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Welcome, <strong className="text-[#14213D]">{profile.name}</strong>. 
                Endorse student civic tech innovations, supervise applied municipal R&D grants, and review SIH proposals.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="px-4 py-2.5 rounded-lg bg-[#14213D] text-[#E8A33D] font-bold text-xs sm:text-sm flex items-center gap-2">
                <FiAward className="w-4 h-4" />
                <span>NIRF Impact: {profile.nirfImpactScore}/100</span>
              </div>
            </div>
          </div>

          {/* 4 Metric Strips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="p-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Mentored Teams
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#14213D] mt-0.5 block">
                {teams.length} Teams
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Active Research Grants
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                {profile.totalGrantValue}
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Patents / IP Published
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#3D5A80] mt-0.5 block">
                {profile.publishedPatents} Patents
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Pending Reviews
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                00
              </span>
            </div>
          </div>
        </div>

        {/* Action notification banner */}
        {actionSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3.5 text-xs flex items-center gap-2 animate-in fade-in">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* ==================================================
            MAIN CONTENT
            ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: TEAMS FOR ENDORSEMENT (8 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-4 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#14213D]">
                  Student Innovation Teams under Your Mentorship
                </h2>
                <p className="text-xs text-slate-500">
                  Review project milestones, endorse budget proposals, and verify prototype readiness.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                {teams.length} Teams
              </span>
            </div>

            {/* List of Student Teams or Clean Empty State */}
            {teams.length > 0 ? (
              <div className="space-y-3">
                {teams.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs hover:border-[#3D5A80]/60 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#14213D] bg-slate-100 px-2 py-0.5 rounded">
                            {item.teamName}
                          </span>
                          <span className="text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            Lead: {item.studentLead}
                          </span>
                          <span className="text-[11px] font-semibold text-[#3D5A80]">
                            Readiness: {item.readiness}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#14213D]">
                          {item.projectTitle}
                        </h3>

                        <p className="text-xs text-amber-800 bg-amber-50/60 p-2 rounded border border-amber-200/60">
                          <strong>Action Needed:</strong> {item.actionNeeded}
                        </p>

                        <div className="text-[11px] text-slate-400 pt-1">
                          Last milestone checked: {item.lastReview}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {item.status}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => alert(`Revisions requested for ${item.teamName}.`)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                          >
                            Request Revisions
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveTeam(item.id, item.teamName)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#4C8C6B] hover:bg-[#3d7256] text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
                          >
                            <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Endorse Proposal</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#D9D4C6] p-8 sm:p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg mb-3">
                  <FiUsers className="w-6 h-6" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#14213D]">
                  No student innovation teams assigned yet
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  When student teams submit civic tech prototypes or SIH proposals requesting your mentorship, they will appear here for review and endorsement.
                </p>
              </div>
            )}

            {/* Funded Applied Research & Civic Grants */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-[#14213D] text-sm">
                  Sponsored Research & Applied Municipal Grants
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {grants.length} Active Sanctions
                </span>
              </div>

              {grants.length > 0 ? (
                <div className="space-y-2.5 pt-1 text-xs">
                  {grants.map((grt) => (
                    <div key={grt.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{grt.id}</span>
                          <span className="font-bold text-[#14213D] text-sm">{grt.title}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{grt.fundingAgency} • Tenure: {grt.tenure}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-bold text-emerald-800">{grt.amount}</span>
                        <span className="block text-[11px] text-slate-500 font-medium">Progress: {grt.progress}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No active sponsored research grants registered yet.
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: FACULTY CREDENTIALS & NIRF (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Faculty Identity Card */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#14213D]">Faculty Profile</span>
                <span className="font-mono text-slate-500 text-[11px]">{profile.id}</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-medium text-slate-800">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Employee ID:</span>
                  <span className="font-mono font-medium text-slate-800">{profile.facultyId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Institution:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">{profile.institution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-medium text-slate-800">{profile.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Official Email:</span>
                  <span className="font-mono text-[11px] text-slate-800">{profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile:</span>
                  <span className="font-medium text-slate-800">{profile.mobile}</span>
                </div>
              </div>
            </div>

            {/* Academic Credit Contribution */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-3">
              <h3 className="font-bold text-[#14213D] uppercase tracking-wider text-[11px]">
                NIRF & NAAC Accreditation Credits
              </h3>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Student Mentorship Points</span>
                  <strong className="text-[#14213D]">0 pts</strong>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Gov / Municipal Consultancy</span>
                  <strong className="text-[#14213D]">0 pts</strong>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Civic Patents Published</span>
                  <strong className="text-[#14213D]">0 pts</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-center">
                Total Academic API Index: 0/100
              </div>
            </div>

            {/* Municipal Consultation Panel */}
            <div className="bg-[#14213D] text-white rounded-xl p-5 shadow-xs text-xs space-y-2">
              <h3 className="font-bold text-[#E8A33D] uppercase tracking-wider text-[11px]">
                Municipal Technical Advisory
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Connect with municipal engineering teams to provide academic expertise on urban infrastructure challenges.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/government"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E8A33D] hover:underline font-bold"
                >
                  <span>View Municipal Grievance Triage</span>
                  &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
