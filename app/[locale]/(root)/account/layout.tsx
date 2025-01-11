import React from 'react'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=' flex-1 p-4'>
      <div className='max-w-5xl mx-auto space-y-4'>{children}</div>
    </div>
  )
}
