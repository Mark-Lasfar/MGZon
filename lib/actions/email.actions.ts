'use server'

import nodemailer from 'nodemailer'

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string
  subject: string
  text: string
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,     
      },
    })

    await transporter.sendMail({
      from: `"MGZon Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    })

    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, message: 'Failed to send email' }
  }
}
