'use server'

import { connectToDatabase } from '../db'
import Contact from '../db/models/contact.model'
import { revalidatePath } from 'next/cache'
import { formatError } from '../utils'

export type ContactMessage = {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'resolved'
  createdAt: Date
  updatedAt: Date
  ipAddress?: string
  userAgent?: string
}

export async function getContacts(): Promise<ContactMessage[]> {
  try {
    await connectToDatabase()
    const messages = await Contact.find().sort({ createdAt: -1 }).lean()
    return JSON.parse(JSON.stringify(messages))
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export async function getContactById(id: string): Promise<ContactMessage | null> {
  try {
    await connectToDatabase()
    const message = await Contact.findById(id).lean()
    return message ? JSON.parse(JSON.stringify(message)) : null
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export async function updateMessageStatus(
  id: string, 
  status: 'new' | 'in_progress' | 'resolved'
) {
  try {
    await connectToDatabase()
    await Contact.findByIdAndUpdate(id, { status })
    revalidatePath('/admin/messages')
    return { success: true }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}
