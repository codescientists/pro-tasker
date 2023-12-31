
import ViewNavbar from '@/components/shared/ViewNavbar'
import { fetchProject } from '@/lib/actions/project.action'
import { fetchAllUsers, fetchUser } from '@/lib/actions/user.action'
import { currentUser } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async ({params}) => {

  const user: User | null = await currentUser();

  const userOnDatabase = await fetchUser({userId: user?.id});

  const project = await fetchProject({projectId: params.id})
  
  if(project?.userId?.toString() != userOnDatabase._id.toString()) redirect("/projects");
  
  const users = await fetchAllUsers();

  return (
    <div>
      <ViewNavbar users={users} user={userOnDatabase} projectId={params.id} project={project}/>
    </div>
  )
}

export default Page