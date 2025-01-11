import { Metadata } from 'next'

import OverviewReport from './overview-report'
import { auth } from '@/auth'
export const metadata: Metadata = {
  title: 'Admin Dashboard',
}
const DashboardPage = async () => {
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')

  return <OverviewReport />
}

export default DashboardPage
