import { redirect } from 'next/navigation'

export const metadata = {
  title: "My Grievances | Jan Samadhaan Setu",
  description: "View and track all public problems reported on Jan Samadhaan Setu.",
}

export default function MyGrievancesPage() {
  redirect('/dashboard?tab=grievances')
}
