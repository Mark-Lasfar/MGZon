'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineContent, TimelineConnector } from '@/components/ui/timeline'
import { Mail, Phone, Check, FileText, ArrowLeft } from 'lucide-react'

export default function ActivityLog({
  messageId,
  initialActivities,
}: {
  messageId: string
  initialActivities: Array<{
    type: string
    content: string
    createdAt: Date
  }>
}) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return <Mail className="h-4 w-4" />
      case 'status':
        return <Check className="h-4 w-4" />
      case 'note':
        return <FileText className="h-4 w-4" />
      default:
        return <ArrowLeft className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline>
          {initialActivities.map((activity, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot>
                  {getActivityIcon(activity.type)}
                </TimelineDot>
                {index < initialActivities.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <p className="text-sm">{activity.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}
