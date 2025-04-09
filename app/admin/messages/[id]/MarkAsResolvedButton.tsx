'use client'

import { Button } from '@/components/ui/button'
import { updateMessageStatus } from '@/lib/actions/admin.actions'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

export default function MarkAsResolvedButton({
  id,
  currentStatus,
}: {
  id: string
  currentStatus: string
}) {
  const router = useRouter()

  const handleClick = async () => {
    const newStatus = currentStatus === 'resolved' ? 'new' : 'resolved'
    const result = await updateMessageStatus(id, newStatus)
    
    if (result.success) {
      toast({
        title: `Message marked as ${newStatus.replace('_', ' ')}`,
        description: 'The status has been updated successfully',
      })
      router.refresh()
    } else {
      toast({
        title: "Error updating status",
        description: result.error || 'Please try again',
        variant: "destructive",
      })
    }
  }

  return (
    <Button 
      variant={currentStatus === 'resolved' ? 'default' : 'success'}
      size="sm"
      onClick={handleClick}
    >
      {currentStatus === 'resolved' ? 'Re-open' : 'Mark Resolved'}
    </Button>
  )
}
