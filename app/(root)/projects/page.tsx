import AddProjectForm from "@/components/forms/AddProjectForm";
import EditProjectForm from "@/components/forms/EditProjectForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fetchProjects } from "@/lib/actions/project.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { ChevronRight, PenBoxIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";


const Page = async () => {
    const user = await currentUser();

  const userOnDatabase = await fetchUser({userId: user?.id});

  const projects = await fetchProjects({userId: userOnDatabase?._id})

  return (
    <div>
        <div className="flex flex-wrap items-center justify-center m-5">
            {projects.length == 0 ?
                <div className="w-full mb-5">
                    <h5 className="text-lg">You don't have any projects</h5>
                </div>
            :
                projects.map((project)=>(
                    <div key={project._id} className={`flex flex-col rounded py-2 px-4 dark:hover:bg-slate-800 hover:bg-slate-100 group/item h-32 w-64 relative border m-4`}>
                        <Link href={`/projects/${project._id}`}>
                            <span className="text-lg font-bold mb-2 tracking-wider">{project.title}</span>
                            <p className="text-gray-600 text-sm">{project.description}</p>
                        </Link>
                        <Dialog>
                        <div className="absolute right-0 top-0 hidden group-hover/item:flex">
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
                    </div>
                ))
            }
            <Dialog>      
                <DialogTrigger asChild>
                <Button variant="outline" className='h-32 w-64 relative border border-dashed'>
                    <PlusCircleIcon size={15} className="mr-1 text-lg"/> Create New Project
                </Button>
                </DialogTrigger>        
            
                <DialogContent className="sm:max-w-[425px]">
                    <AddProjectForm user={userOnDatabase}/>
                </DialogContent>
            </Dialog>
        </div>
    </div>
  )
}

export default Page