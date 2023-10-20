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

const Sidebar = ({projects}: any) => {
  const { signOut } = useClerk();

  const {  user } = useUser();

  const pathname = usePathname();
  return (
    <div className="hidden border-r w-1/5 md:flex flex-col justify-between" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="p-4">
        <Link href="/projects" className="flex items-center mb-2 text-lg px-2 py-1 border-b rounded font-bold">
            <Kanban className="mr-2 h-4 w-4 text-xl" /> Projects
        </Link>
          <div className="ml-4 relative">
            {projects.length == 0 ?
              <Dialog>      
                  <DialogTrigger asChild>
                    <Button variant="outline" className='w-full border border-dashed'>
                      <PlusCircleIcon size={15} className="mr-1"/> New Project
                    </Button>
                  </DialogTrigger>        
                
                <DialogContent className="sm:max-w-[425px]">
                  <AddProjectForm user={user}/>
                </DialogContent>
              </Dialog>
            :      
            projects.map((project)=>(
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
                        <Button variant="outline" size="icon">
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                    </div>
                    <DialogContent className="sm:max-w-[425px]">
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
            
            <DialogContent className="sm:max-w-[425px]">
              <AddProjectForm user={user}/>
            </DialogContent>
          </Dialog>
          </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <UserButton afterSignOutUrl="/"/>
          <p className="flex flex-col mx-2">
            <span className='text-sm font-bold'>{user?.firstName}</span>
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
