"use client"
import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  FiPlus,
  FiSearch,
  FiX,
  FiBookmark,
  FiHeart,
  FiMapPin,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi'
import {
  DOMAINS,
  DEFAULT_TEMPLATE_CHALLENGES,
  getStoredChallenges,
  saveStoredChallenges,
  addStoredChallenge
} from '@/lib/challengesData'
import ProblemSubmissionModal from '@/component/ProblemSubmissionModal'

export default function BrowseChallengesPage() {
  const [challenges, setChallenges] = useState([])
  const [selectedDomain, setSelectedDomain] = useState("All Domains")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState("recent")

  // Interactive state
  const [upvotesState, setUpvotesState] = useState({})
  const [savedChallenges, setSavedChallenges] = useState({})

  // Modals
  const [activeModalChallenge, setActiveModalChallenge] = useState(null)
  const [proposalModalChallenge, setProposalModalChallenge] = useState(null)
  const [proposalSubmitted, setProposalSubmitted] = useState(false)
  const [problemModalOpen, setProblemModalOpen] = useState(false)

  // Forms
  const [proposalForm, setProposalForm] = useState({
    teamName: '',
    leadEmail: '',
    solutionTitle: '',
    summary: '',
    repoUrl: ''
  })

  const toggleUpvote = (e, id) => {
    e.stopPropagation()
    setUpvotesState(prev => {
      const current = prev[id] || { count: 0, hasUpvoted: false }
      const newHasUpvoted = !current.hasUpvoted
      return {
        ...prev,
        [id]: {
          count: newHasUpvoted ? current.count + 1 : Math.max(0, current.count - 1),
          hasUpvoted: newHasUpvoted
        }
      }
    })
  }

  const toggleBookmark = (e, id) => {
    e.stopPropagation()
    setSavedChallenges(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  useEffect(() => {
    setChallenges(getStoredChallenges())
    const handleUpdate = () => {
      setChallenges(getStoredChallenges())
    }
    window.addEventListener('challenges-updated', handleUpdate)
    return () => window.removeEventListener('challenges-updated', handleUpdate)
  }, [])

  const clearAllData = () => {
    setChallenges([])
    saveStoredChallenges([])
  }

  const resetTemplateData = () => {
    setChallenges(DEFAULT_TEMPLATE_CHALLENGES)
    saveStoredChallenges(DEFAULT_TEMPLATE_CHALLENGES)
  }

  const handleProblemSubmitted = (newEntry) => {
    const updated = addStoredChallenge(newEntry)
    setChallenges(updated)
  }

  const filteredChallenges = useMemo(() => {
    return challenges.filter(item => {
      const matchesDomain = selectedDomain === "All Domains" || item.domain === selectedDomain
      const matchesStatus = statusFilter === "All" || item.status === statusFilter
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.organization.toLowerCase().includes(query) ||
        item.region.toLowerCase().includes(query)

      return matchesDomain && matchesStatus && matchesSearch
    })
  }, [challenges, selectedDomain, statusFilter, searchQuery])

  const handleProposalSubmit = (e) => {
    e.preventDefault()
    setProposalSubmitted(true)
    setTimeout(() => {
      setProposalSubmitted(false)
      setProposalModalChallenge(null)
      setProposalForm({ teamName: '', leadEmail: '', solutionTitle: '', summary: '', repoUrl: '' })
    }, 2000)
  }

  return (
    <div className="w-full min-h-screen bg-[#F2EFE6] text-[#1A1A1A] font-roboto">
      {/* Hero Header Section */}
      <section className="w-full bg-[#14213D] text-white py-12 sm:py-16 border-b border-[#3D5A80]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Browse <span className="text-[#E8A33D]">Challenges</span>
              </h1>
              <p className="mt-3 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal">
                Discover problem statements, collaborate with solver teams, and propose technological solutions.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {challenges.length > 0 ? (
                <button
                  onClick={clearAllData}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-[#182746] hover:bg-[#1f3156] border border-[#3D5A80]/60 transition cursor-pointer"
                  title="Clear all cards to see empty state"
                >
                  Empty Data
                </button>
              ) : (
                <button
                  onClick={resetTemplateData}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-white/90 hover:text-white bg-[#182746] hover:bg-[#1f3156] border border-[#3D5A80]/60 transition cursor-pointer"
                  title="Show sample template cards"
                >
                  Show Template Cards
                </button>
              )}

              <button
                onClick={() => setProblemModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-sm transition shadow-sm active:scale-95 cursor-pointer"
              >
                <FiPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Submit Problem Statement</span>
              </button>
            </div>
          </div>

          {/* Interactive Search Bar & Filters */}
          <div className="mt-8 bg-[#182746] p-3 sm:p-4 rounded-xl border border-[#3D5A80]/50 shadow-sm flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges by keyword, region, or organization..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#14213D] text-white placeholder-slate-400 text-sm border border-[#3D5A80]/50 focus:border-[#E8A33D] focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-[#14213D] text-white text-sm border border-[#3D5A80]/50 focus:border-[#E8A33D] focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Open for Solutions">Open for Solutions</option>
                <option value="In Progress">In Progress</option>
                <option value="Solved">Solved</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-[#14213D] text-white text-sm border border-[#3D5A80]/50 focus:border-[#E8A33D] focus:outline-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="upvotes">Most Upvoted</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DOMAINS.map(domain => {
              const active = selectedDomain === domain
              return (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "bg-[#E8A33D] text-[#14213D] font-bold"
                      : "bg-[#182746] hover:bg-[#1f3156] text-white/80 border border-[#3D5A80]/50"
                  }`}
                >
                  {domain}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-xl bg-white border border-[#D9D4C6] shadow-sm">
          <div className="p-3 text-center sm:text-left border-r border-[#D9D4C6]/60 last:border-none">
            <div className="text-xs uppercase font-semibold text-[#3D5A80] tracking-wider">Active Challenges</div>
            <div className="text-xl sm:text-2xl font-bold text-[#14213D] mt-0.5">{challenges.length}</div>
          </div>
          <div className="p-3 text-center sm:text-left border-r border-[#D9D4C6]/60 last:border-none">
            <div className="text-xs uppercase font-semibold text-[#3D5A80] tracking-wider">Innovation Grants</div>
            <div className="text-xl sm:text-2xl font-bold text-[#E8A33D] mt-0.5">₹0</div>
          </div>
          <div className="p-3 text-center sm:text-left border-r border-[#D9D4C6]/60 last:border-none">
            <div className="text-xs uppercase font-semibold text-[#3D5A80] tracking-wider">Registered Solvers</div>
            <div className="text-xl sm:text-2xl font-bold text-[#14213D] mt-0.5">0</div>
          </div>
          <div className="p-3 text-center sm:text-left">
            <div className="text-xs uppercase font-semibold text-[#3D5A80] tracking-wider">Partner Institutions</div>
            <div className="text-xl sm:text-2xl font-bold text-[#4C8C6B] mt-0.5">0</div>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#14213D]">
              {selectedDomain === "All Domains" ? "Problem Statements" : selectedDomain}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-normal">
              Showing {filteredChallenges.length} challenges
            </p>
          </div>

          {(searchQuery || selectedDomain !== "All Domains" || statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedDomain('All Domains')
                setStatusFilter('All')
              }}
              className="text-xs font-semibold text-[#E8A33D] hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#D9D4C6] shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#14213D]/10 text-[#3D5A80] mx-auto flex items-center justify-center mb-3">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#14213D]">No challenges available</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto font-normal">
              There are currently no problem statements matching this view. Publish a new challenge or connect your data source.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setProblemModalOpen(true)}
                className="px-5 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] text-xs font-bold transition shadow-xs cursor-pointer"
              >
                + Post First Challenge
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChallenges.map(item => {
              const currentVotes = upvotesState[item.id] || { count: item.upvotes, hasUpvoted: false }
              const isSaved = !!savedChallenges[item.id]

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#D9D4C6] hover:border-[#3D5A80] transition flex flex-col justify-between overflow-hidden shadow-sm"
                >
                  {/* Card Content */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Domain Tag */}
                        <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#14213D]/10 text-[#14213D]">
                          {item.domain}
                        </span>

                        {/* Status Tag */}
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium inline-flex items-center gap-1.5 ${
                          item.status === 'Open for Solutions' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'Open for Solutions' ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}></span>
                          {item.status}
                        </span>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => toggleBookmark(e, item.id)}
                        aria-label={isSaved ? "Remove bookmark" : "Save challenge"}
                        className={`p-1.5 rounded border transition cursor-pointer ${
                          isSaved
                            ? "bg-[#E8A33D]/20 border-[#E8A33D] text-[#14213D]"
                            : "bg-transparent border-transparent hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <FiBookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Meta info */}
                    <div className="text-xs text-[#3D5A80] font-medium flex items-center gap-1.5 mb-1.5">
                      <span className="font-mono text-[#E8A33D] font-bold">{item.id}</span>
                      <span>•</span>
                      <span className="truncate">{item.organization}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#14213D] leading-snug">
                      {item.title}
                    </h3>

                    {/* Summary */}
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 font-normal">
                      {item.summary}
                    </p>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Meta Stats Bar */}
                  <div className="px-6 py-3 bg-[#FAF9F5] border-t border-b border-[#D9D4C6]/60 flex items-center justify-between text-xs text-slate-600 font-normal">
                    <div className="flex items-center gap-1.5">
                      <FiMapPin className="w-3.5 h-3.5 text-[#3D5A80]" />
                      <span className="truncate max-w-[150px] sm:max-w-[180px]">{item.region}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#14213D]">{item.bounty}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-amber-800 font-medium">{item.deadline}</span>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 sm:px-6 flex items-center justify-between gap-3 bg-white">
                    {/* Upvote Button */}
                    <button
                      onClick={(e) => toggleUpvote(e, item.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer border ${
                        currentVotes.hasUpvoted
                          ? "bg-rose-50 border-rose-300 text-rose-600"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <FiHeart className={`w-3.5 h-3.5 ${currentVotes.hasUpvoted ? 'fill-current' : ''}`} />
                      <span>{currentVotes.count}</span>
                    </button>

                    {/* CTA Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalChallenge(item)}
                        className="px-3.5 py-1.5 rounded text-xs font-semibold text-[#14213D] hover:bg-[#14213D]/10 transition cursor-pointer border border-[#14213D]/20"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => setProposalModalChallenge(item)}
                        className="px-4 py-1.5 rounded text-xs font-bold bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] transition shadow-sm active:scale-95 cursor-pointer"
                      >
                        Propose Solution
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-xl bg-[#14213D] text-white border border-[#3D5A80]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#E8A33D]">
              Community Problem Submissions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Have an Unsolved Societal Challenge?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
              Publish problem statements to Jan Samadhaan Setu and collaborate with developers, researchers, and innovators.
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => setProblemModalOpen(true)}
              className="px-6 py-3 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-sm transition shadow-sm active:scale-95 cursor-pointer"
            >
              Post a Problem Statement
            </button>
          </div>
        </div>
      </main>

      {/* DETAIL MODAL */}
      {activeModalChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 font-roboto">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl border border-[#D9D4C6] overflow-hidden flex flex-col">
            <div className="p-6 bg-[#14213D] text-white relative">
              <button
                onClick={() => setActiveModalChallenge(null)}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#182746] hover:bg-[#1f3156] text-[#D9D4C6] hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-[#E8A33D]/20 text-[#E8A33D] border border-[#E8A33D]/30 mb-2">
                {activeModalChallenge.id} • {activeModalChallenge.domain}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                {activeModalChallenge.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
                {activeModalChallenge.organization} • {activeModalChallenge.region}
              </p>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm font-normal">
              <div>
                <h4 className="text-xs uppercase font-bold text-[#3D5A80] tracking-wider mb-1.5">
                  Context & Background
                </h4>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {activeModalChallenge.background}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-[#3D5A80] tracking-wider mb-2">
                  Key Objectives
                </h4>
                <ul className="space-y-2">
                  {activeModalChallenge.objectives?.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-700 font-normal">
                      <span className="w-5 h-5 rounded bg-[#E8A33D]/20 text-[#14213D] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#D9D4C6] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-normal">Beneficiary Impact:</span>
                  <span className="font-semibold text-[#14213D]">{activeModalChallenge.impact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-normal">Innovation Grant:</span>
                  <span className="font-semibold text-[#E8A33D]">{activeModalChallenge.bounty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-normal">Submission Deliverables:</span>
                  <span className="font-medium text-slate-700 text-right max-w-xs">{activeModalChallenge.submissionDeliverables}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-[#D9D4C6] flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveModalChallenge(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const target = activeModalChallenge
                  setActiveModalChallenge(null)
                  setProposalModalChallenge(target)
                }}
                className="px-5 py-2.5 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold text-xs transition shadow-sm active:scale-95 cursor-pointer"
              >
                Propose Solution Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT PROPOSAL MODAL */}
      {proposalModalChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 font-roboto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#D9D4C6] overflow-hidden">
            <div className="p-5 bg-[#14213D] text-white">
              <button
                onClick={() => setProposalModalChallenge(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-mono text-[#E8A33D]">Proposal Submission</span>
              <h3 className="text-lg font-bold text-white truncate mt-0.5">
                {proposalModalChallenge.title}
              </h3>
            </div>

            {proposalSubmitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#4C8C6B]/20 text-[#4C8C6B] mx-auto flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-[#14213D]">
                  Solution Proposal Received!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto font-normal">
                  Your proposal has been logged to the review board.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="p-5 space-y-3.5 text-xs font-normal">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Team / Solver Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Team name"
                    value={proposalForm.teamName}
                    onChange={(e) => setProposalForm({...proposalForm, teamName: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={proposalForm.leadEmail}
                    onChange={(e) => setProposalForm({...proposalForm, leadEmail: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Solution Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief concept title"
                    value={proposalForm.solutionTitle}
                    onChange={(e) => setProposalForm({...proposalForm, solutionTitle: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Technical Architecture / Summary</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Summary of your proposed technological approach..."
                    value={proposalForm.summary}
                    onChange={(e) => setProposalForm({...proposalForm, summary: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub / Project Repository URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={proposalForm.repoUrl}
                    onChange={(e) => setProposalForm({...proposalForm, repoUrl: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#D9D4C6] focus:border-[#E8A33D] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setProposalModalChallenge(null)}
                    className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-bold shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modular Problem Statement Submission Modal */}
      <ProblemSubmissionModal
        isOpen={problemModalOpen}
        onClose={() => setProblemModalOpen(false)}
        onSubmitSuccess={handleProblemSubmitted}
      />
    </div>
  )
}
