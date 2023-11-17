import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pro Tasker',
  description: 'Pro Tasker by Piyush Patil',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
              {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
