// Shared data and storage module for Challenges and Problem Statements

export const DOMAINS = [
  "All Domains",
  "Environment & Sanitation",
  "Transport & Mobility",
  "Public Health & Water",
  "Education & Governance"
]

export const DEFAULT_TEMPLATE_CHALLENGES = []

const STORAGE_KEY = "jss_challenges_data"

export function getStoredChallenges() {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (err) {
    console.error("Failed to read challenges from localStorage:", err)
  }
  return []
}

export function saveStoredChallenges(challenges) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges))
    window.dispatchEvent(new Event("challenges-updated"))
  } catch (err) {
    console.error("Failed to save challenges to localStorage:", err)
  }
}

export function addStoredChallenge(challenge) {
  const current = getStoredChallenges()
  const updated = [challenge, ...current]
  saveStoredChallenges(updated)
  return updated
}
