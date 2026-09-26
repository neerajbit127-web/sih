// Shared data and storage module for Challenges and Problem Statements

export const DOMAINS = [
  "All Domains",
  "Domain 1",
  "Domain 2",
  "Domain 3",
  "Domain 4"
]

export const DEFAULT_TEMPLATE_CHALLENGES = [
  {
    id: "CHALLENGE-001",
    title: "Challenge Title Goes Here",
    organization: "Department / Organization Name",
    region: "City, Region / State",
    domain: "Domain 1",
    status: "Open for Solutions",
    urgency: "Priority",
    summary: "Brief summary describing the problem statement, affected stakeholders, and required technological solution.",
    impact: "Impact Metric / Beneficiaries",
    teamsCount: 0,
    upvotes: 0,
    bounty: "Grant Amount",
    deadline: "Deadline",
    tags: ["Category 1", "Category 2", "Category 3"],
    background: "Detailed background, operational context, and constraints for this challenge.",
    objectives: [
      "Key objective or technical milestone 1",
      "Key objective or technical milestone 2",
      "Key objective or technical milestone 3"
    ],
    submissionDeliverables: "Expected solution deliverables, prototype documentation, and evaluation criteria."
  },
  {
    id: "CHALLENGE-002",
    title: "Second Challenge Title Goes Here",
    organization: "Department / Organization Name",
    region: "City, Region / State",
    domain: "Domain 2",
    status: "Open for Solutions",
    urgency: "Featured",
    summary: "Brief summary describing the problem statement, affected stakeholders, and required technological solution.",
    impact: "Impact Metric / Beneficiaries",
    teamsCount: 0,
    upvotes: 0,
    bounty: "Grant Amount",
    deadline: "Deadline",
    tags: ["Category 1", "Category 2"],
    background: "Detailed background, operational context, and constraints for this challenge.",
    objectives: [
      "Key objective or technical milestone 1",
      "Key objective or technical milestone 2"
    ],
    submissionDeliverables: "Expected solution deliverables, prototype documentation, and evaluation criteria."
  }
]

const STORAGE_KEY = "jss_challenges_data"

export function getStoredChallenges() {
  if (typeof window === "undefined") {
    return DEFAULT_TEMPLATE_CHALLENGES
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error("Failed to read challenges from localStorage:", err)
  }
  return DEFAULT_TEMPLATE_CHALLENGES
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
