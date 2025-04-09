// app/admin/messages/[id]/page.tsx
import { getContactById, updateMessageStatus } from '@/lib/actions/admin.actions'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MessageSquare, Clock, Globe, Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatContactDate, getStatusBadgeVariant } from '@/lib/utils'
import MarkAsResolvedButton from './MarkAsResolvedButton'
import ReplyForm from './ReplyForm'
import NotesSection from './NotesSection'
import ActivityLog from './ActivityLog'

export default async function MessagePage({
  params,
}: {
  params: { id: string }
}) {
  const message = await getContactById(params.id)
  
  if (!message) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Button variant="outline" asChild>
        <Link href="/admin/messages" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Messages
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{message.subject}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getStatusBadgeVariant(message.status)}>
                      {message.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatContactDate(message.createdAt)}
                    </span>
                    {message.updatedAt > message.createdAt && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {formatContactDate(message.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <MarkAsResolvedButton 
                  id={message._id} 
                  currentStatus={message.status} 
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-medium">From</h3>
                  <p className="font-semibold">{message.name}</p>
                  <p className="text-muted-foreground">{message.email}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Contact Type</h3>
                  <p>
                    {message.subject.includes('question') ? (
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Question
                      </span>
                    ) : message.subject.includes('call') ? (
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Phone Request
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> General Inquiry
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Message</h3>
                <div className="prose dark:prose-invert bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {message.message}
                </div>
              </div>
            </CardContent>
          </Card>

          <NotesSection messageId={message._id} initialNotes={message.notes || []} />
        </div>

        <div className="space-y-6">
          <ReplyForm email={message.email} messageId={message._id} />
          
          <Card>
            <CardHeader>
              <CardTitle>Message Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">IP Address</h4>
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {message.ipAddress || 'Not available'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Device Info</h4>
                <p className="text-sm break-all flex items-start gap-2">
                  <Smartphone className="h-4 w-4 mt-0.5" />
                  {message.userAgent || 'Not available'}
                </p>
              </div>
            </CardContent>
          </Card>

          <ActivityLog 
            messageId={message._id} 
            initialActivities={message.activities || []} 
          />
        </div>
      </div>
    </div>
  )
}
