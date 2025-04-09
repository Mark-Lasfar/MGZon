'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function PaginationControls({
  currentPage,
  totalPages,
  paginationItems,
}: {
  currentPage: number
  totalPages: number
  paginationItems: (number | string)[]
}) {
  const searchParams = useSearchParams()
  
  const createPageURL = (page: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    return `?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <button>
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </Button>

      {paginationItems.map((item, index) => (
        <Button
          key={index}
          variant={item === currentPage ? 'default' : 'outline'}
          size="sm"
          asChild={typeof item === 'number'}
        >
          {typeof item === 'number' ? (
            <Link href={createPageURL(item)}>
              {item}
            </Link>
          ) : (
            <button>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <button>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </Button>
    </div>
  )
}
