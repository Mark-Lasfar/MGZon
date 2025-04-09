import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import qs from 'query-string'
import { VariantProps } from "@/components/ui/badge"

// Utility Functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL Handling
export function formUrlQuery({ params, key, value }: { params: string; key: string; value: string | null }) {
  const currentUrl = qs.parse(params)
  currentUrl[key] = value
  return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl }, { skipNull: true })
}

// Text Formatting
export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

export const truncateText = (text: string, length: number = 50): string => 
  text?.length > length ? `${text.substring(0, length)}...` : text || ''

// Number Formatting
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

export const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

// Date Handling
export const formatContactDate = (date: Date | string): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculateFutureDate(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

// Status Handling
export const getStatusBadgeVariant = (status: string): VariantProps<typeof Badge>['variant'] => {
  switch (status?.toLowerCase()) {
    case 'new': return 'secondary'
    case 'in_progress': return 'default'
    case 'resolved': return 'success'
    case 'spam': return 'destructive'
    default: return 'outline'
  }
}

// Error Handling
export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === 'ZodError') {
      return Object.entries((error as any).errors)
        .map(([field, err]) => `${field}: ${(err as any).message}`)
        .join('. ')
    }
    return error.message
  }
  return 'An unknown error occurred'
}

// Security
export const sanitizeInput = (input: string): string => 
  input.replace(/[<>"'&]/g, '')

// Pagination
export const generatePagination = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, '...', total - 1, total]
  if (current >= total - 2) return [1, 2, '...', total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

// Type Guards
export const isContactMessage = (obj: any): obj is ContactMessage => 
  obj && typeof obj._id === 'string' && typeof obj.name === 'string'
