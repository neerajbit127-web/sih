"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const pathname = usePathname()

  // Do not render footer on sign up and login window pages
  if (pathname === '/signup' || pathname === '/login') {
    return null
  }

  return (
    <footer id="footer" className="border-t border-[#3D5A80]/30 bg-[#14213D] text-white/70 py-12 text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-oswald text-xl font-semibold tracking-wide text-white inline-flex items-center hover:opacity-95 transition"
            >
              Jan Samadhaan<span className="text-[#E8A33D] font-oswald ml-1.5 not-italic">Setu</span>
            </Link>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              A digital platform for transparent and citizen-centric public problem solving. Connecting citizens with responsible authorities for trackable, verified grievance resolution.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#E8A33D] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-[#E8A33D] transition-colors">
                  Browse Challenges
                </Link>
              </li>
              <li>
                <Link href="/submit-problem" className="hover:text-[#E8A33D] transition-colors">
                  Submit Problem Statement
                </Link>
              </li>
              <li>
                <Link href="/#submit-grievance" className="hover:text-[#E8A33D] transition-colors">
                  Submit Grievance
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=tracker" className="hover:text-[#E8A33D] transition-colors">
                  Track Grievance
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#E8A33D] transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-200">
              Information
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-[#E8A33D] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#E8A33D] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#E8A33D] transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-200">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#terms" className="hover:text-[#E8A33D] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#E8A33D] transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#E8A33D] transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#3D5A80]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-slate-400 text-xs">
          <div>
            © 2026 <span className="text-white font-medium">Jan Samadhaan Setu</span>. All rights reserved.
          </div>
          <div className="text-[11px] text-slate-400">
            Smart India Hackathon • Digital Governance Initiative
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
