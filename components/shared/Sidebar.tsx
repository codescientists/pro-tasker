"use client"

import { ChevronRight, Kanban, PenBoxIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';


import {  AiOutlineLogout } from 'react-icons/ai';
import { Button } from '../ui/button';
import { UserButton, useClerk, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import EditProjectForm from '../forms/EditProjectForm';
import AddProjectForm from '../forms/AddProjectForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from '../ui/use-toast';
import { deleteProject } from '@/lib/actions/project.action';

const Sidebar = ({user, projects}: any) => {
  const { signOut } = useClerk();

  const pathname = usePathname();

  async function handleDeleteProject(projectId) {

    await deleteProject(projectId)

    toast({
        title: "Project Deleted",
    })  
    
  }

  return (
    <div className="hidden border-r w-1/5 md:flex flex-col justify-between" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="p-4">
        <Link href="/projects" className="flex items-center mb-2 text-md px-2 py-1 border-b rounded font-semibold uppercase">
            <Kanban className="mr-2 h-4 w-4 text-xl" /> Projects
        </Link>
          <div className="ml-4 relative">
            {projects.map((project)=>(
              <Link href={`/projects/${project._id}`} key={project._id} className={`${pathname === `/projects/${project._id}` ? 'dark:bg-slate-800 bg-slate-100' : ''} flex items-center mb-2 rounded py-2 px-2 dark:hover:bg-slate-800 hover:bg-slate-100 group/item`}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-md">{project.title}</span>
                  <Dialog>
                    <div className="absolute right-0 hidden group-hover/item:flex">
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <PenBoxIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      
                      <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant="outline" size="icon">
                                <Trash2Icon className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={()=> handleDeleteProject(project._id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>
                    <DialogContent className="nd:max-w-[625px]">
                      <EditProjectForm project={project} />
                    </DialogContent>
                  </Dialog>
                </Link>
            ))}
            <Dialog>      
              <DialogTrigger asChild>
                <Button variant="outline" className='w-full border border-dashed'>
                  <PlusCircleIcon size={15} className="mr-1"/> New Project
                </Button>
              </DialogTrigger>        
            
            <DialogContent className="md:max-w-[625px]">
              <AddProjectForm user={user}/>
            </DialogContent>
          </Dialog>
          </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <UserButton afterSignOutUrl="/"/>
          <p className="flex flex-col mx-2">
            <span className='text-sm font-bold'>{user?.name}</span>
            {/* <span className='text-slate-700 text-[10px]'>{user?.emailAddresses[0]}</span> */}
          </p>
          <Button variant="outline" className='ml-auto' onClick={() => signOut()} >
            <AiOutlineLogout className="text-xl" />
          </Button>
        </div>
    
      </div>
    </div>
  );
};

export default Sidebar;
