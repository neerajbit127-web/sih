"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {
  FiLayers,
  FiAward,
  FiUsers,
  FiShield,
  FiDownload
} from 'react-icons/fi'
import DashboardRoleSwitcher from '@/component/DashboardRoleSwitcher'
import {
  DEFAULT_PROFILES,
  INITIAL_UNIVERSITY_DEPARTMENTS,
  INITIAL_UNIVERSITY_MOUS
} from '@/lib/stakeholderData'

export default function UniversityDashboardPage() {
  const [profile] = useState(DEFAULT_PROFILES.university)
  const [departments] = useState(INITIAL_UNIVERSITY_DEPARTMENTS)
  const [mous] = useState(INITIAL_UNIVERSITY_MOUS)
  const [pendingRoster, setPendingRoster] = useState([])

  const handleVerify = (id) => {
    setPendingRoster((prev) => prev.filter((item) => item.id !== id))
    alert(`Verified & Authorized roster ID: ${id}`)
  }

  return (
    <div className="w-full min-h-screen bg-[#F2EFE6] text-[#1A1A1A] font-roboto py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Role Switcher Bar */}
        <DashboardRoleSwitcher activeRole="university" />

        {/* ==================================================
            UNIVERSITY HEADER CARD
            ================================================== */}
        <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[#3D5A80]">
                  Institutional Innovation Council (IIC) Node
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <FiShield className="w-3 h-3" />
                  AISHE Code: {profile.aisheCode}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
                University Administration & Innovation Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                <strong className="text-[#14213D]">{profile.name}</strong> • Head: {profile.nodalOfficer}. 
                Oversee campus-wide civic innovations, municipal pilot collaborations, and IIC seed grants.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => alert('No data available to export yet.')}
                className="px-4 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <FiDownload className="w-4 h-4" />
                <span>Export NIRF Report</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Strips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="p-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Registered Student Teams
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#14213D] mt-0.5 block">
                {profile.totalStudentTeams} Teams
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Approved Civic Solutions
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                {profile.approvedProposals}
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Total Grants & Seed Fund
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                {profile.incubationFund}
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Active Civic MoUs
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#3D5A80] mt-0.5 block">
                {profile.activeMoUs} Signed
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            MAIN CONTENT
            ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: DEPARTMENT PERFORMANCE & MOUs (8 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Department Innovation Index Table */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-[#14213D]">
                    Departmental Civic Innovation Performance
                  </h2>
                  <p className="text-xs text-slate-500">
                    Breakdown of registered student teams, prototypes shortlisted, and grants secured.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded">
                  IIC Rating: {profile.iicRating}
                </span>
              </div>

              {departments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2.5 font-bold">Academic Department</th>
                        <th className="py-2.5 font-bold text-center">Active Teams</th>
                        <th className="py-2.5 font-bold text-center">Shortlisted</th>
                        <th className="py-2.5 font-bold text-right">Grants Secured</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {departments.map((d, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 font-semibold text-[#14213D]">{d.dept}</td>
                          <td className="py-2.5 text-center font-mono">{d.teams}</td>
                          <td className="py-2.5 text-center font-mono font-bold text-amber-700">{d.shortlisted}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{d.grantsWon}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No departmental civic innovation records submitted yet.
                </div>
              )}
            </div>

            {/* Active Institutional MoUs */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-[#14213D] text-sm">
                  Active MoUs & Municipal Deployment Partnerships
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {mous.length} Active Agreements
                </span>
              </div>

              {mous.length > 0 ? (
                <div className="space-y-2.5 pt-1 text-xs">
                  {mous.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-[#14213D] text-sm">{m.partner}</h4>
                        <p className="text-slate-500 text-[11px] mt-0.5">Scope: {m.type} • Signed: {m.signedOn}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded self-start sm:self-center">
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No active municipal or industry deployment MoUs registered yet.
                </div>
              )}
            </div>

            {/* Campus Roster Verification Queue */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-[#14213D] text-sm">
                  Campus Registrations Awaiting University Verification
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {pendingRoster.length} Action Needed
                </span>
              </div>

              {pendingRoster.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {pendingRoster.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-500">{r.id}</span>
                          <span className="font-bold text-[#14213D]">{r.name}</span>
                          <span className="text-slate-500 text-[11px]">({r.role})</span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{r.team}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleVerify(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#4C8C6B] hover:bg-[#3d7256] text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        Verify & Sign-off
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No pending campus registrations awaiting verification.
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: INSTITUTION PROFILE (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Institute Identity Card */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#14213D]">Institution Node</span>
                <span className="font-mono text-slate-500 text-[11px]">{profile.id}</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Institution:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AISHE Code:</span>
                  <span className="font-mono font-medium text-slate-800">{profile.aisheCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nodal Head:</span>
                  <span className="font-medium text-slate-800">{profile.nodalOfficer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Official Domain:</span>
                  <span className="font-mono text-[11px] text-slate-800">{profile.adminEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-800">{profile.city}, {profile.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NIRF Standing:</span>
                  <span className="font-medium text-slate-800">{profile.nirfRank}</span>
                </div>
              </div>
            </div>

            {/* Incubation Fund Grants */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-3">
              <h3 className="font-bold text-[#14213D] uppercase tracking-wider text-[11px]">
                IIC Innovation Seed Grants
              </h3>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Hardware Prototype Seed</span>
                  <strong className="text-slate-800">₹0</strong>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Patent Filing Support</span>
                  <strong className="text-slate-800">₹0</strong>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                  <span>Field Trial & Civic Pilots</span>
                  <strong className="text-slate-800">₹0</strong>
                </div>
              </div>
            </div>

            {/* Corporate CSR Tie-ups */}
            <div className="bg-[#14213D] text-white rounded-xl p-5 shadow-xs text-xs space-y-2">
              <h3 className="font-bold text-[#E8A33D] uppercase tracking-wider text-[11px]">
                Corporate Co-Innovation
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Connect with CSR sponsors who fund student prototypes and recruit verified civic tech innovators.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/company"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E8A33D] hover:underline font-bold"
                >
                  <span>Explore CSR Sponsoring Companies</span>
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
