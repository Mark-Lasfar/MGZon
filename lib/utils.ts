import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import qs from 'query-string'
import { ZodError } from 'zod'
import mongoose from 'mongoose'
import { VariantProps } from "@/components/ui/badge"

// Utility Functions
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// URL Handling
interface UrlQueryParams {
  params: string
  key: string
  value: string | null
}

interface FilterUrlParams {
  params: {
    q?: string
    category?: string
    tag?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }
  tag?: string
  category?: string
  sort?: string
  price?: string
  rating?: string
  page?: string
}

export function formUrlQuery({ params, key, value }: UrlQueryParams): string {
  const currentUrl = qs.parse(params)
  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { 
      skipNull: true,
      skipEmptyString: true,
      encode: false 
    }
  )
}

export const getFilterUrl = ({
  params,
  category,
  tag,
  sort,
  price,
  rating,
  page,
}: FilterUrlParams): string => {
  const newParams = { ...params }
  if (category) newParams.category = category
  if (tag) newParams.tag = toSlug(tag)
  if (price) newParams.price = price
  if (rating) newParams.rating = rating
  if (page) newParams.page = page
  if (sort) newParams.sort = sort
  
  return `/search?${new URLSearchParams(newParams)}`
}

// Text Formatting
export const toSlug = (text: string): string => {
  return text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const truncateText = (
  text: string, 
  length: number = 50, 
  ellipsis: string = '...'
): string => {
  return text?.length > length 
    ? `${text.substring(0, length)}${ellipsis}` 
    : text || ''
}

export const formatId = (id: string, visibleChars: number = 6): string => {
  return id.length > visibleChars 
    ? `..${id.slice(-visibleChars)}` 
    : id
}

// Number Formatting
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2
})

export const formatCurrency = (amount: number): string => {
  return CURRENCY_FORMATTER.format(amount)
}

export const formatCompactNumber = (number: number): string => {
  return COMPACT_NUMBER_FORMATTER.format(number)
}

export const roundTo = (
  num: number, 
  decimals: number = 2
): number => {
  const factor = Math.pow(10, decimals)
  return Math.round((num + Number.EPSILON) * factor) / factor
}

// Date & Time Handling
interface DateTimeFormats {
  dateTime: string
  dateOnly: string
  timeOnly: string
  iso: string
}

export const formatDateTime = (
  dateInput: Date | string,
  timeZone: string = 'UTC'
): DateTimeFormats => {
  const date = new Date(dateInput)
  const formatterOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone
  }

  return {
    dateTime: date.toLocaleString('en-US', formatterOptions),
    dateOnly: date.toLocaleDateString('en-US', formatterOptions),
    timeOnly: date.toLocaleTimeString('en-US', formatterOptions),
    iso: date.toISOString()
  }
}

export const formatContactDate = (
  dateInput: Date | string | null
): string => {
  if (!dateInput) return 'N/A'
  
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return 'Invalid Date'

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  })
}

export const calculateRelativeDate = (
  days: number,
  direction: 'future' | 'past' = 'future'
): Date => {
  const date = new Date()
  const modifier = direction === 'future' ? days : -days
  date.setDate(date.getDate() + modifier)
  return date
}

export const getTimeUntil = (
  targetTime: string,
  timeZone: string = 'UTC'
): { hours: number; minutes: number } => {
  const now = new Date()
  const target = new Date(
    new Date().toLocaleString('en-US', { timeZone })
  )
  
  target.setHours(...targetTime.split(':').map(Number), 0, 0)

  if (target < now) target.setDate(target.getDate() + 1)

  const diff = target.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes }
}

// ID Generation
export const generateSecureId = (length: number = 24): string => {
  const buffer = new Uint8Array(length)
  crypto.getRandomValues(buffer)
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length)
}

// Status Handling
export const getStatusVariant = (
  status: string
): VariantProps<typeof Badge>['variant'] => {
  const statusMap: Record<string, VariantProps<typeof Badge>['variant']> = {
    new: 'secondary',
    in_progress: 'default',
    resolved: 'success',
    spam: 'destructive'
  }
  
  return statusMap[status.toLowerCase()] || 'outline'
}

// Error Handling
interface MongoError extends Error {
  code?: number
  keyValue?: Record<string, unknown>
  errors?: Record<string, { message: string }>
}

const isMongoError = (error: unknown): error is MongoError => {
  return error instanceof Error && 
    ('code' in error || 'keyValue' in error || 'errors' in error)
}

export const formatError = (error: unknown): string => {
  if (error instanceof ZodError) {
    return error.errors
      .map(e => `${e.path.join('.')}: ${e.message}`)
      .join('. ')
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return Object.values(error.errors)
      .map(e => e.message)
      .join('. ')
  }

  if (isMongoError(error)) {
    if (error.code === 11000 && error.keyValue) {
      const field = Object.keys(error.keyValue)[0]
      return `${field} already exists`
    }
    if (error.errors) {
      return Object.values(error.errors)
        .map(e => e.message)
        .join('. ')
    }
  }

  if (error instanceof Error) return error.message
  
  return typeof error === 'string' ? error : 'Unknown error occurred'
}

// Security
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>"'&/\\#!()$^%]/g, '')
}

// Pagination
interface PaginationOptions {
  current: number
  total: number
  visiblePages?: number
}

export const generatePagination = ({
  current,
  total,
  visiblePages = 3
}: PaginationOptions): (number | string)[] => {
  if (total <= visiblePages + 4) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const start = Math.max(2, current - Math.floor(visiblePages/2))
  const end = Math.min(total - 1, current + Math.floor(visiblePages/2))

  return [
    1,
    ...(start > 2 ? ['...'] : []),
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    ...(end < total - 1 ? ['...'] : []),
    total
  ]
}

// Type Guards
interface ContactMessage {
  _id: string
  name: string
  email: string
  createdAt: Date
}

export const isContactMessage = (obj: unknown): obj is ContactMessage => {
  return (
    !!obj &&
    typeof obj === 'object' &&
    '_id' in obj &&
    'name' in obj &&
    'email' in obj &&
    'createdAt' in obj &&
    typeof (obj as ContactMessage)._id === 'string' &&
    typeof (obj as ContactMessage).name === 'string' &&
    typeof (obj as ContactMessage).email === 'string' &&
    (obj as ContactMessage).createdAt instanceof Date
  )
}

// Validation Helpers
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  return /^\+?[1-9]\d{1,14}$/.test(phone)
}
