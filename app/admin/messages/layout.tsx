// app/admin/messages/layout.tsx
export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}
