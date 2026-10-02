"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {
  FiBookOpen,
  FiPlus,
  FiAward,
  FiCheckCircle,
  FiCode,
  FiUsers,
  FiCheck,
  FiFileText,
  FiShield
} from 'react-icons/fi'
import DashboardRoleSwitcher from '@/component/DashboardRoleSwitcher'
import {
  DEFAULT_PROFILES,
  INITIAL_STUDENT_PROJECTS
} from '@/lib/stakeholderData'

export default function StudentDashboardPage() {
  const [profile] = useState(DEFAULT_PROFILES.student)
  const [projects, setProjects] = useState(INITIAL_STUDENT_PROJECTS)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  // New proposal form
  const [newProposal, setNewProposal] = useState({
    title: '',
    domain: 'Transport & Mobility',
    team: 'Team Innovators',
    abstract: '',
    githubUrl: ''
  })
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleCreateProposal = (e) => {
    e.preventDefault()
    if (!newProposal.title.trim()) return

    const created = {
      id: `PRJ-2026-${String(projects.length + 1).padStart(2, '0')}`,
      title: newProposal.title.trim(),
      domain: newProposal.domain,
      team: newProposal.team,
      mentor: profile.mentorName,
      status: 'Ideation & Mentor Verification',
      statusStep: 1,
      fundingStatus: 'Eligible for Stage-1 Seed',
      submittedDate: 'Just now',
      githubUrl: newProposal.githubUrl.trim(),
      abstract: newProposal.abstract.trim() || 'Civic innovation proposal submitted for faculty review.'
    }

    setProjects([created, ...projects])
    setSubmitSuccess(true)
    setTimeout(() => {
      setSubmitSuccess(false)
      setShowSubmitModal(false)
      setNewProposal({
        title: '',
        domain: 'Transport & Mobility',
        team: 'Team Innovators',
        abstract: '',
        githubUrl: ''
      })
    }, 1200)
  }

  return (
    <div className="w-full min-h-screen bg-[#F2EFE6] text-[#1A1A1A] font-roboto py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Role Switcher Bar */}
        <DashboardRoleSwitcher activeRole="student" />

        {/* ==================================================
            STUDENT HEADER CARD
            ================================================== */}
        <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[#3D5A80]">
                  Academic Innovation Portal
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <FiShield className="w-3 h-3" />
                  Verified Student Account
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
                Student Innovator Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Welcome, <strong className="text-[#14213D]">{profile.name}</strong>. 
                Build solutions for real civic challenges, collaborate with faculty mentors, and track your hackathon submissions.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/challenges"
                className="px-3.5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                Browse Challenges
              </Link>
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-2 bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
              >
                <FiPlus className="w-4 h-4 stroke-[3]" />
                <span>Submit Solution</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Strips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="p-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Active Projects
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#14213D] mt-0.5 block">
                {String(projects.length).padStart(2, '0')}
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Shortlisted in SIH
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                00
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Grants Secured
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-700 mt-0.5 block">
                ₹0
              </span>
            </div>
            <div className="p-2 border-l border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                Innovation Points
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#3D5A80] mt-0.5 block">
                {profile.innovationPoints} pts
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            MAIN CONTENT
            ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: PROJECTS & SUBMISSIONS (8 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-4 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#14213D]">
                  My Project Submissions & Civic Solutions
                </h2>
                <p className="text-xs text-slate-500">
                  Track prototype evaluations, faculty sign-offs, and grant status.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                {projects.length} Proposals
              </span>
            </div>

            {/* List of Student Projects or Clean Empty State */}
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
                            {item.domain}
                          </span>
                          <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                            {item.fundingStatus}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#14213D] leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {item.abstract}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1.5">
                            <FiUsers className="w-3.5 h-3.5 text-slate-400" />
                            <span>Team: {item.team}</span>
                          </span>
                          <span>•</span>
                          <span>Mentor: {item.mentor}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          {item.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Submitted: {item.submittedDate}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {item.githubUrl && (
                            <a
                              href={item.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                              title="GitHub Repository"
                            >
                              <FiCode className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedProject(item)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            View Details
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
                  <FiFileText className="w-6 h-6" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#14213D]">
                  No project submissions yet
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Submit your civic innovation prototype or register a team to solve municipal challenges and compete for SIH grants.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4 stroke-[3]" />
                    <span>Submit Solution</span>
                  </button>
                </div>
              </div>
            )}

            {/* SIH Challenges CTA */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#14213D] text-sm">
                  Looking for Civic Challenges to Solve?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explore open problem statements published by government ministries and municipal departments.
                </p>
              </div>
              <Link
                href="/challenges"
                className="px-4 py-2 rounded-lg bg-[#14213D] text-[#E8A33D] font-bold text-xs hover:bg-slate-800 transition shrink-0 ml-3"
              >
                Browse Challenges &rarr;
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: STUDENT PROFILE & ACHIEVEMENTS (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Student ID Card */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#14213D]">Student Innovator Profile</span>
                <span className="font-mono text-slate-500 text-[11px]">{profile.id}</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-medium text-slate-800">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roll / PRN:</span>
                  <span className="font-mono font-medium text-slate-800">{profile.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Institution:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">{profile.college}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-medium text-slate-800">{profile.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mentor:</span>
                  <span className="font-medium text-slate-800">{profile.mentorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-[11px] text-slate-800">{profile.email}</span>
                </div>
              </div>
            </div>

            {/* Badges & Certificates */}
            <div className="bg-white rounded-xl border border-[#D9D4C6] p-5 shadow-xs text-xs space-y-3">
              <h3 className="font-bold text-[#14213D] uppercase tracking-wider text-[11px]">
                Civic Badges & Certifications
              </h3>

              <div className="p-4 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-slate-500 text-xs">
                No badges earned yet. Submit solutions and get endorsed by your faculty mentor to unlock verified badges.
              </div>
            </div>

            {/* University Incubation Cell */}
            <div className="bg-[#14213D] text-white rounded-xl p-5 shadow-xs text-xs space-y-2">
              <h3 className="font-bold text-[#E8A33D] uppercase tracking-wider text-[11px]">
                University IIC & Incubation Hub
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Connect with your campus innovation council to apply for seed grants and patent filing support.
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
          SUBMIT SOLUTION MODAL
          ================================================== */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-[#D9D4C6] max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="bg-[#14213D] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-semibold text-[#E8A33D] tracking-wide block">
                  New Proposal Submission
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Submit Civic Solution / Prototype
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-300 hover:text-white text-xl font-bold leading-none p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-lg">
                  <FiCheck className="w-5 h-5 stroke-[3]" />
                </div>
                <h4 className="font-bold text-[#14213D] text-base">
                  Proposal Registered Successfully!
                </h4>
                <p className="text-xs text-slate-600">
                  Assigned for mentor review. Track status on your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateProposal} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Problem / Solution Title <span className="text-[#E8A33D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    placeholder="e.g. Low-Cost IoT Sensor for Sewage Blockage Prediction"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#3D5A80]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Civic Domain
                    </label>
                    <select
                      value={newProposal.domain}
                      onChange={(e) => setNewProposal({ ...newProposal, domain: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option>Transport & Mobility</option>
                      <option>Public Health & Water</option>
                      <option>Environment & Sanitation</option>
                      <option>Energy & Governance</option>
                      <option>Disaster Management</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={newProposal.team}
                      onChange={(e) => setNewProposal({ ...newProposal, team: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    GitHub / Prototype Demo Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={newProposal.githubUrl}
                    onChange={(e) => setNewProposal({ ...newProposal, githubUrl: e.target.value })}
                    placeholder="https://github.com/your-team/repo"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Technical Abstract & Ground Impact
                  </label>
                  <textarea
                    rows={3}
                    value={newProposal.abstract}
                    onChange={(e) => setNewProposal({ ...newProposal, abstract: e.target.value })}
                    placeholder="Describe how your hardware/software architecture solves the civic challenge..."
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#3D5A80]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================================================
          PROJECT DETAIL MODAL
          ================================================== */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-[#D9D4C6] max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="bg-[#14213D] text-white p-5 flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-xs text-[#E8A33D] font-bold">{selectedProject.id}</span>
                <h3 className="text-base font-bold text-white mt-1">{selectedProject.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{selectedProject.domain}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="text-slate-300 hover:text-white text-xl font-bold leading-none p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Status & Funding</span>
                <p className="text-slate-800 font-medium">{selectedProject.status}</p>
                <p className="text-emerald-700 font-semibold mt-0.5">{selectedProject.fundingStatus}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Abstract</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedProject.abstract}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>Team: <strong className="text-slate-800">{selectedProject.team}</strong></div>
                <div>Faculty Mentor: <strong className="text-slate-800">{selectedProject.mentor}</strong></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-1.5 rounded-lg bg-[#14213D] text-[#E8A33D] font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
