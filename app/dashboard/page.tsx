

import { DashboardWrapper } from '@/components/DashboardWrapper'

export default function DashboardPage() {
  // Authentication is handled client-side by DashboardWrapper
  return <DashboardWrapper serverUser={null} />
}

