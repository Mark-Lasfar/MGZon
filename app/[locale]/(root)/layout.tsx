import React from 'react'

import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 flex flex-col p-4'>{children}</main>
      <Footer />
    </div>
  )
}
