'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { sendEmail } from '@/lib/actions/email.actions'
import { toast } from '@/components/ui/use-toast'

const formSchema = z.object({
  reply: z.string().min(10, {
    message: "Reply must be at least 10 characters.",
  }),
})

export default function ReplyForm({ email }: { email: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reply: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await sendEmail({
        to: email,
        subject: "Re: Your Contact Message",
        text: values.reply,
      })
      
      toast({
        title: "Reply sent successfully",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Failed to send reply",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reply to Message</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reply"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Type your reply here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send Reply
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
