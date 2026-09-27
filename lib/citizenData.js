// Citizen Data & Storage Module for Jan Samadhaan Setu

export const CITIZEN_PROFILE = {
  name: "Neeraj Meena",
  id: "JSS-CIT-98421",
  role: "Verified Citizen",
  locality: "Shastri Nagar",
  city: "Jaipur",
  state: "Rajasthan",
  pincode: "302016",
  email: "neeraj.meena@example.gov.in",
  phone: "+91 98XXX-XX127",
  registeredDate: "12 August 2025",
  aadhaarLinked: true,
  preferredLanguage: "English / हिन्दी"
}

export const GRIEVANCE_STAGES = [
  { key: 'submitted', label: 'Submitted', description: 'Stored in public registry' },
  { key: 'assigned', label: 'Assigned', description: 'Assigned to nodal department' },
  { key: 'under_review', label: 'Under Review', description: 'Field officer reviewing issue' },
  { key: 'in_progress', label: 'In Progress', description: 'Work/repair underway on ground' },
  { key: 'resolved', label: 'Resolved', description: 'Resolution submitted by department' },
  { key: 'closed', label: 'Closed', description: 'Citizen confirmed & case closed' }
]

// All entries default to empty
export const DEFAULT_GRIEVANCES = []
export const RECENT_ACTIVITIES = []
export const INITIAL_NOTIFICATIONS = []
export const COMMUNITY_CHALLENGES_SNIPPET = []

// Storage Keys (v2 clean storage)
export const STORAGE_GRIEVANCES_KEY = "jss_citizen_grievances_v2"
export const STORAGE_FEEDBACK_KEY = "jss_citizen_feedback_v2"
export const STORAGE_NOTIFS_KEY = "jss_citizen_notifs_v2"

/**
 * Clear all stored citizen data from browser localStorage
 */
export function clearAllCitizenData() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_GRIEVANCES_KEY)
    localStorage.removeItem(STORAGE_FEEDBACK_KEY)
    localStorage.removeItem(STORAGE_NOTIFS_KEY)
    localStorage.removeItem('jss_submitted_problems')
    localStorage.removeItem('jss_grievance_feedback')
    localStorage.removeItem('jss_notifications')
    localStorage.removeItem('jss_challenges_data')
  } catch (err) {
    console.error("Failed to clear citizen data:", err)
  }
}

/**
 * Get all citizen grievances from local storage submissions.
 * Returns empty array if none submitted yet.
 */
export function getCitizenGrievances() {
  if (typeof window === 'undefined') return []

  try {
    // Purge legacy test keys if present
    if (localStorage.getItem('jss_submitted_problems')) {
      localStorage.removeItem('jss_submitted_problems')
    }
    if (localStorage.getItem('jss_grievance_feedback')) {
      localStorage.removeItem('jss_grievance_feedback')
    }

    const rawLocal = localStorage.getItem(STORAGE_GRIEVANCES_KEY)
    const localSubmissions = rawLocal ? JSON.parse(rawLocal) : []

    if (!Array.isArray(localSubmissions) || localSubmissions.length === 0) {
      return []
    }

    // Read any feedback updates
    const rawFeedback = localStorage.getItem(STORAGE_FEEDBACK_KEY)
    const feedbackMap = rawFeedback ? JSON.parse(rawFeedback) : {}

    // Map local submissions to standard grievance structure
    return localSubmissions.map((item, idx) => {
      const fb = feedbackMap[item.id] || null
      const isResolved = item.status === 'Resolved'
      const isClosed = item.status === 'Closed' || Boolean(fb)
      const currentStatus = isClosed ? 'Closed' : item.status || 'Submitted'
      const statusStep = isClosed ? 6 : isResolved ? 5 : item.status === 'In Progress' ? 4 : item.status === 'Under Review' ? 3 : item.status === 'Assigned' ? 2 : 1

      return {
        id: item.id || `JSS-2026-${String(100 + idx).padStart(5, '0')}`,
        title: item.title || "Reported Public Problem",
        category: item.category || "General Public Service",
        department: "Municipal Corporation / Assigned Dept",
        division: "Regional Civic Zone",
        assignedOfficer: "Nodal Grievance Officer",
        state: item.state || "Rajasthan",
        district: item.district || "Jaipur",
        city: item.city || "Jaipur",
        locality: item.locality ? `${item.locality}${item.landmark ? ` (${item.landmark})` : ''}` : "Reported Location",
        landmark: item.landmark || "",
        description: item.description || "Details submitted by citizen.",
        status: currentStatus,
        statusStep,
        currentStageLabel: currentStatus,
        submittedAt: item.submittedAt || "Recently submitted",
        submittedDateRaw: new Date().toISOString().split('T')[0],
        lastUpdated: "Just now",
        lastUpdatedRaw: new Date().toISOString(),
        expectedResolution: "Within 7 business days",
        priority: item.impactFrequency === 'Daily issue' ? 'High' : 'Normal',
        impactWho: item.impactWho || "Local residents",
        impactFrequency: item.impactFrequency || "Observed issue",
        safetyConcern: item.safetyConcern ? "Yes" : "No",
        evidenceCount: item.evidenceCount || 0,
        feedbackPending: isResolved && !fb,
        feedback: fb || null,
        timeline: [
          {
            stage: "Submitted",
            date: item.submittedAt || "Today",
            completed: true,
            current: statusStep === 1,
            note: "Report registered in Jan Samadhaan public registry."
          },
          {
            stage: "Assigned",
            date: statusStep >= 2 ? "Completed" : "Automated routing in progress",
            completed: statusStep >= 2,
            current: statusStep === 2,
            note: "Evaluating department triage algorithms."
          },
          {
            stage: "Under Review",
            date: statusStep >= 3 ? "Completed" : "Pending",
            completed: statusStep >= 3,
            current: statusStep === 3,
            note: "Field inspection scheduling."
          },
          {
            stage: "In Progress",
            date: statusStep >= 4 ? "Completed" : "Pending",
            completed: statusStep >= 4,
            current: statusStep === 4,
            note: "Work initiation."
          },
          {
            stage: "Resolved",
            date: statusStep >= 5 ? "Completed" : "Pending",
            completed: statusStep >= 5,
            current: statusStep === 5,
            note: "Quality confirmation."
          },
          {
            stage: "Closed",
            date: statusStep === 6 ? "Completed" : "Pending",
            completed: statusStep === 6,
            current: statusStep === 6,
            note: "Citizen feedback recorded."
          }
        ]
      }
    })
  } catch (err) {
    console.error("Error retrieving citizen grievances:", err)
    return []
  }
}

/**
 * Get dynamic activity logs derived from submitted grievances
 */
export function getCitizenActivities(grievances = []) {
  if (!Array.isArray(grievances) || grievances.length === 0) {
    return []
  }

  return grievances.map((g, idx) => ({
    id: `act-${g.id}-${idx}`,
    dateGroup: idx === 0 ? "Today" : "Recently",
    time: g.submittedAt?.split(',')[1]?.trim() || "Just now",
    grievanceId: g.id,
    title: "Submission Registered",
    message: `You submitted problem '${g.title}' (${g.id}). Assigned to public registry.`,
    type: "submission",
    highlight: idx === 0
  }))
}

/**
 * Save citizen rating and feedback for a resolved problem
 */
export function saveGrievanceFeedback(grievanceId, rating, comment, satisfactory = 'Yes') {
  if (typeof window === 'undefined') return false

  try {
    const raw = localStorage.getItem(STORAGE_FEEDBACK_KEY)
    const existing = raw ? JSON.parse(raw) : {}
    existing[grievanceId] = {
      rating,
      comment,
      satisfactory,
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
    localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify(existing))
    return true
  } catch (err) {
    console.error("Error saving feedback:", err)
    return false
  }
}

/**
 * Helper to compute dashboard summary metrics
 */
export function calculateCitizenMetrics(grievances = []) {
  const total = grievances.length
  const inProgress = grievances.filter((g) => g.status === 'In Progress' || g.status === 'Under Review' || g.status === 'Assigned').length
  const resolved = grievances.filter((g) => g.status === 'Resolved' || g.status === 'Closed').length
  const actionRequired = grievances.filter((g) => g.feedbackPending === true).length

  return {
    total: String(total).padStart(2, '0'),
    inProgress: String(inProgress).padStart(2, '0'),
    resolved: String(resolved).padStart(2, '0'),
    actionRequired: String(actionRequired).padStart(2, '0')
  }
}
