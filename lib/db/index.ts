import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) return cached.conn

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'mgzon',
    bufferCommands: false,
  })

  cached.conn = await cached.promise

  require('@/lib/db/models/contact.model')
  require('@/lib/db/models/rating.model')

  return cached.conn
}
