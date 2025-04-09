'use server'

import { connectToDatabase } from '../db'
import Contact from '../db/models/contact.model'
import { revalidatePath } from 'next/cache'
import { formatError } from '../utils'
import { FilterQuery } from 'mongoose'

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

type GetContactsOptions = {
  skip?: number
  limit?: number
  status?: string
  searchQuery?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function getContacts({
  skip = 0,
  limit = 10,
  status,
  searchQuery,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: GetContactsOptions): Promise<{ messages: ContactMessage[]; total: number }> {
  try {
    await connectToDatabase()

    const query: FilterQuery<typeof Contact> = {}
    
    // Filter by status if provided
    if (status) {
      query.status = status
    }

    // Search by name, email or subject if searchQuery is provided
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { subject: { $regex: searchQuery, $options: 'i' } },
        { message: { $regex: searchQuery, $options: 'i' } },
      ]
    }

    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const [messages, total] = await Promise.all([
      Contact.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query)
    ])

    return {
      messages: JSON.parse(JSON.stringify(messages)),
      total
    }
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
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase()
    await Contact.findByIdAndUpdate(id, { status })
    revalidatePath('/admin/messages')
    return { success: true }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

export async function deleteMessage(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase()
    await Contact.findByIdAndDelete(id)
    revalidatePath('/admin/messages')
    return { success: true }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

export async function getMessagesStats(): Promise<{
  total: number
  new: number
  inProgress: number
  resolved: number
}> {
  try {
    await connectToDatabase()

    const [total, newCount, inProgress, resolved] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ status: 'in_progress' }),
      Contact.countDocuments({ status: 'resolved' }),
    ])

    return {
      total,
      new: newCount,
      inProgress,
      resolved,
    }
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export async function getRecentMessages(limit: number = 5): Promise<ContactMessage[]> {
  try {
    await connectToDatabase()
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    return JSON.parse(JSON.stringify(messages))
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export async function bulkUpdateMessages(
  ids: string[],
  status: 'new' | 'in_progress' | 'resolved'
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase()
    await Contact.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    )
    revalidatePath('/admin/messages')
    return { success: true }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

export async function searchMessages(
  query: string,
  limit: number = 10
): Promise<ContactMessage[]> {
  try {
    await connectToDatabase()
    const messages = await Contact.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { subject: { $regex: query, $options: 'i' } },
        { message: { $regex: query, $options: 'i' } },
      ],
    })
    .limit(limit)
    .lean()

    return JSON.parse(JSON.stringify(messages))
  } catch (error) {
    throw new Error(formatError(error))
  }
}
