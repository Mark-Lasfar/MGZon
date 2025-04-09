'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addNote, addActivityLog } from '@/lib/actions/admin.actions'
import { toast } from '@/components/ui/use-toast'

export default function NotesSection({
  messageId,
  initialNotes,
}: {
  messageId: string
  initialNotes: Array<{ content: string; createdAt: Date }>
}) {
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    
    setIsSubmitting(true)
    try {
      const result = await addNote(messageId, newNote)
      if (result.success) {
        setNotes([...notes, { content: newNote, createdAt: new Date() }])
        setNewNote('')
        
        await addActivityLog(messageId, {
          type: 'note',
          content: `Added note: ${newNote.substring(0, 50)}...`,
        })

        toast({
          title: "Note added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to add note",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a private note about this message..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            disabled={isSubmitting}
          />
          <Button 
            onClick={handleAddNote}
            disabled={!newNote.trim() || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </Button>
        </div>

        {notes.length > 0 && (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <p className="whitespace-pre-wrap">{note.content}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
