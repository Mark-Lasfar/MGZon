import { Schema, model, Document, Types } from 'mongoose'

interface IContactMessage extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  subject: string
  message?: string
  phone?: string
  status: 'new' | 'in_progress' | 'resolved' | 'spam'
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { 
      type: String, 
      required: true, 
      trim: true, 
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, trim: true, maxlength: 2000 },
    phone: { type: String, trim: true, maxlength: 20 },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'spam'],
      default: 'new'
    },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.ipAddress
        delete ret.userAgent
      }
    }
  }
)

// Indexes for better query performance
ContactSchema.index({ email: 1, status: 1 })
ContactSchema.index({ createdAt: -1 })

export const ContactModel = model<IContactMessage>('ContactMessage', ContactSchema)

// Frontend Type (without Mongoose internals)
export type ContactMessage = Omit<IContactMessage, keyof Document> & {
  _id: string
}
