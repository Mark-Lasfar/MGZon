import { ColumnDef } from "@tanstack/react-table"
import { ContactMessage } from "@/lib/db/models/contact.model"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Mail, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<ContactMessage>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("name")}
        <div className="text-sm text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.subject.includes('question') ? (
          <MessageSquare className="h-4 w-4 text-blue-500" />
        ) : row.original.subject.includes('call') ? (
          <Phone className="h-4 w-4 text-green-500" />
        ) : (
          <Mail className="h-4 w-4 text-purple-500" />
        )}
        {row.getValue("subject")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge 
          variant={
            status === 'new' ? 'secondary' : 
            status === 'in_progress' ? 'default' : 'success'
          }
        >
          {status.replace('_', ' ')}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const message = row.original
      return (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/messages/${message._id}`}>
            View
          </Link>
        </Button>
      )
    },
  },
]
