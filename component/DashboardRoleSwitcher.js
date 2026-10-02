"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FiUser,
  FiBookOpen,
  FiAward,
  FiLayers,
  FiShield,
  FiBriefcase
} from 'react-icons/fi'

const ROLES = [
  { id: 'citizen', label: 'Citizen', icon: FiUser, path: '/dashboard/citizen', badge: 'Public' },
  { id: 'student', label: 'Student', icon: FiBookOpen, path: '/dashboard/student', badge: 'Innovator' },
  { id: 'faculty', label: 'Faculty', icon: FiAward, path: '/dashboard/faculty', badge: 'Academic' },
  { id: 'university', label: 'University', icon: FiLayers, path: '/dashboard/university', badge: 'Institution' },
  { id: 'government', label: 'Government', icon: FiShield, path: '/dashboard/government', badge: 'Authority' },
  { id: 'company', label: 'Company', icon: FiBriefcase, path: '/dashboard/company', badge: 'CSR & Industry' },
]

export default function DashboardRoleSwitcher({ activeRole = 'citizen' }) {
  const pathname = usePathname()

  return (
    <div className="bg-white rounded-xl border border-[#D9D4C6] p-3 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Portal View:
          </span>
          <span className="text-xs font-semibold text-[#14213D] capitalize">
            {activeRole} Dashboard
          </span>
        </div>

        {/* Role tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {ROLES.map((role) => {
            const Icon = role.icon
            const isCurrent =
              activeRole === role.id ||
              pathname === role.path ||
              (role.id === 'citizen' && pathname === '/dashboard')

            return (
              <Link
                key={role.id}
                href={role.path}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isCurrent
                    ? 'bg-[#14213D] text-[#E8A33D] shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{role.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
