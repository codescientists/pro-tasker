import Navbar from '@/components/shared/Navbar'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/shared/Sidebar'
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider, currentUser } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import { createUser, fetchUser } from '@/lib/actions/user.action'
import { Toaster } from '@/components/ui/toaster'
import { fetchProjects } from '@/lib/actions/project.action'

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

  const user: User | null = await currentUser();

  let userOnDatabase = await fetchUser({userId: user?.id});

  if(!userOnDatabase){
    userOnDatabase = await createUser({userId: user?.id, name: user?.firstName, email: user?.emailAddresses[0].emailAddress})
  }

  const projects = await fetchProjects({userId: userOnDatabase?._id})

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
              <Navbar user={userOnDatabase}/>
              <div className="flex">
                <Sidebar projects={projects}/>
                <div className="md:w-4/5">
                  {children}
                </div>
              </div>
              <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
