'use server'

import { connectToDatabase } from '../db'
import Contact from '../db/models/contact.model'
import { formatError } from '../utils'
import { sendEmail } from './email.actions'

export async function sendContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    await connectToDatabase()
    
    // Save to database
    const newContact = await Contact.create(formData)
    
    // Send email notification to admin
    await sendEmail({
      to: 'admin@mg-zon.vercel.app',
      subject: `New Contact Form Submission: ${formData.subject}`,
      text: `
        Name: ${formData.name}
        Email: ${formData.email}
        Subject: ${formData.subject}
        Message: ${formData.message}
      `,
    })

    return {
      success: true,
      message: 'Contact form submitted successfully',
      data: newContact,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
