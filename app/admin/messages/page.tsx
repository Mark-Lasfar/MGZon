import { getContacts } from '@/lib/actions/admin.actions'
import { DataTable } from '@/components/admin/DataTable'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DownloadIcon, PlusIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

export default async function MessagesPage() {
  const messages = await getContacts()
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard">
              Back to Dashboard
            </Link>
          </Button>
          <Button>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Messages" 
          value={messages.length.toString()} 
          icon={<PlusIcon />}
        />
        <StatCard 
          title="New Today" 
          value={messages.filter(m => 
            new Date(m.createdAt).toDateString() === new Date().toDateString()
          ).length.toString()} 
        />
        <StatCard 
          title="Response Rate" 
          value={`${Math.round(
            (messages.filter(m => m.status === 'resolved').length / messages.length) * 100
          )}%`} 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={messages.map(m => ({
              ...m,
              createdAt: format(new Date(m.createdAt), 'PPpp'),
            }))} 
          />
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
