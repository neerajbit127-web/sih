// Stakeholder Profiles, Datasets, and Storage Helpers for Jan Samadhaan Setu
// Roles: student, faculty, university, citizen, government, company

export const STAKEHOLDER_ROLES = [
  { id: 'citizen', label: 'Citizen', icon: 'FiUser', badge: 'Public User', path: '/dashboard/citizen' },
  { id: 'student', label: 'Student', icon: 'FiBookOpen', badge: 'Civic Innovator', path: '/dashboard/student' },
  { id: 'faculty', label: 'Faculty', icon: 'FiAward', badge: 'Academic Mentor', path: '/dashboard/faculty' },
  { id: 'university', label: 'University', icon: 'FiLayers', badge: 'Institution Node', path: '/dashboard/university' },
  { id: 'government', label: 'Government', icon: 'FiShield', badge: 'Nodal Authority', path: '/dashboard/government' },
  { id: 'company', label: 'Company', icon: 'FiBriefcase', badge: 'CSR & Industry', path: '/dashboard/company' },
]

// Default Clean Profiles (Empty / Zero-state)
export const DEFAULT_PROFILES = {
  student: {
    role: 'student',
    name: 'Student Innovator',
    id: 'STU-NEW',
    college: 'Not specified',
    department: 'General Engineering',
    degree: 'Student',
    rollNo: '-',
    email: '-',
    mobile: '-',
    cgpa: '-',
    innovationPoints: 0,
    solvedChallenges: 0,
    activeTeam: 'None',
    mentorName: 'None Assigned'
  },
  faculty: {
    role: 'faculty',
    name: 'Faculty Member',
    id: 'FAC-NEW',
    institution: 'Not specified',
    designation: 'Faculty Mentor',
    department: 'Academic Department',
    facultyId: '-',
    email: '-',
    mobile: '-',
    teamsMentored: 0,
    publishedPatents: 0,
    activeGrantsCount: 0,
    totalGrantValue: '₹0',
    nirfImpactScore: 0
  },
  university: {
    role: 'university',
    name: 'Registered University / Institute',
    id: 'UNI-NEW',
    aisheCode: '-',
    nodalOfficer: 'Nodal Officer',
    adminEmail: '-',
    state: '-',
    city: '-',
    iicRating: 'Not Rated',
    totalStudentTeams: 0,
    approvedProposals: 0,
    activeMoUs: 0,
    incubationFund: '₹0',
    nirfRank: '-'
  },
  citizen: {
    role: 'citizen',
    name: 'Citizen',
    id: 'JSS-CIT-NEW',
    locality: '-',
    city: '-',
    state: '-',
    email: '-',
    phone: '-'
  },
  government: {
    role: 'government',
    name: 'Nodal Officer',
    id: 'GOV-NODAL-NEW',
    agency: 'Municipal / Civic Authority',
    department: 'Department',
    designation: 'Officer',
    jurisdiction: 'Civic Zone',
    officialEmail: '-',
    helplineActive: '181 Citizen Portal',
    assignedStaff: 0,
    slaComplianceRate: '0%',
    activeWorkOrders: 0
  },
  company: {
    role: 'company',
    name: 'Corporate Partner',
    id: 'CORP-NEW',
    cin: '-',
    representative: 'CSR Representative',
    designation: 'Representative',
    corporateEmail: '-',
    sector: '-',
    committedCsrBudget: '₹0',
    disbursedBudget: '₹0',
    fundedPrototypes: 0,
    recruitedTalent: 0
  }
}

// All datasets default to empty arrays
export const INITIAL_STUDENT_PROJECTS = []
export const INITIAL_FACULTY_TEAMS = []
export const INITIAL_FACULTY_GRANTS = []
export const INITIAL_UNIVERSITY_DEPARTMENTS = []
export const INITIAL_UNIVERSITY_MOUS = []
export const INITIAL_GOV_GRIEVANCES = []
export const INITIAL_COMPANY_PROJECTS = []

// Storage utilities
export function getActiveRole() {
  if (typeof window === 'undefined') return 'citizen'
  try {
    return localStorage.getItem('jss_active_role') || 'citizen'
  } catch {
    return 'citizen'
  }
}

export function setActiveRole(role) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('jss_active_role', role)
  } catch {}
}

export function getStakeholderProfile(role) {
  if (typeof window === 'undefined') return DEFAULT_PROFILES[role] || DEFAULT_PROFILES.citizen
  try {
    const raw = localStorage.getItem(`jss_profile_${role}`)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_PROFILES[role] || DEFAULT_PROFILES.citizen
}

export function saveStakeholderProfile(role, profileData) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`jss_profile_${role}`, JSON.stringify(profileData))
  } catch {}
}
