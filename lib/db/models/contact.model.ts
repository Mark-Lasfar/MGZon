import { Schema, model, Document } from 'mongoose'

interface IContact extends Document {
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'resolved'
  ipAddress?: string
  userAgent?: string
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved'],
      default: 'new',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret._id = ret._id.toString()
        return ret
      }
    }
  }
)

const Contact = model<IContact>('Contact', contactSchema)
export default Contact
