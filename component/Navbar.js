"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { FiMenu, FiX } from 'react-icons/fi'

const Navbar = () => {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-[#3D5A80]/30 bg-[#14213D] text-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Title */}
        <Link
          href="/"
          className="font-oswald text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-white flex items-center hover:opacity-95 transition truncate max-w-[70%] sm:max-w-none"
        >
          Jan Samadhaan<span className="text-[#E8A33D] font-oswald ml-1.5 not-italic">Setu</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-medium">
          <li>
            <Link
              href="/"
              className="text-white/80 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-white/5"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/#footer"
              className="text-white/80 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-white/5"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/#how-it-works"
              className="text-white/80 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-white/5"
            >
              How It Works
            </Link>
          </li>
          <li>
            <Link
              href="/challenges"
              className="text-white/80 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-white/5"
            >
              Browse Challenges
            </Link>
          </li>
          <li>
            <Link
              href="/submit-problem"
              className="text-[#E8A33D] hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-white/5"
            >
              Submit Problem
            </Link>
          </li>

          {status === 'loading' ? (
            <li>
              <span className="text-white/40 text-xs px-2">...</span>
            </li>
          ) : session ? (
            <li className="flex items-center gap-3 ml-2">
              <span className="text-xs sm:text-sm font-medium text-[#E8A33D] max-w-[140px] truncate">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs text-white/70 hover:text-rose-300 px-3 py-1 rounded-full border border-white/20 hover:border-rose-400/40 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </li>
          ) : (
            <li className="flex items-center gap-2 ml-1">
              <Link
                href="/login"
                className="text-white/80 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-semibold text-sm px-4 py-1.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Sign Up
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8A33D]"
        >
          {mobileMenuOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3D5A80]/40 bg-[#14213D] px-4 pt-3 pb-5 space-y-3 shadow-xl">
          <ul className="flex flex-col gap-1 text-sm font-medium">
            <li>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#footer"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="/challenges"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition"
              >
                Browse Challenges
              </Link>
            </li>
            <li>
              <Link
                href="/submit-problem"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-[#E8A33D] hover:bg-white/10 transition"
              >
                Submit Problem
              </Link>
            </li>
          </ul>

          <div className="pt-3 border-t border-[#3D5A80]/40">
            {status === 'loading' ? (
              <span className="text-xs text-white/50 px-3">...</span>
            ) : session ? (
              <div className="flex flex-col gap-2.5 px-1">
                <div className="text-xs text-[#E8A33D] font-medium truncate">
                  {session.user?.name || session.user?.email}
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="w-full text-center text-xs text-rose-300 hover:text-rose-200 py-2 px-3 rounded-lg bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-4 rounded-xl text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-4 rounded-xl bg-[#E8A33D] hover:bg-[#d9942e] text-[#14213D] font-semibold text-sm transition shadow-sm active:scale-98"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
