import { AiOutlineQuestion,AiOutlineBell, AiFillPlusCircle } from "react-icons/ai";
import ThemeToggleButton from "./ThemeToggleButton";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import AddProjectForm from "../forms/AddProjectForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AlignJustify } from "lucide-react";
import ResponsiveSidebar from "./ResponsiveSidebar";
import { fetchProjects } from "@/lib/actions/project.action";

const Navbar = async ({user}) => {

  const projects = await fetchProjects({userId: user?._id})

  return (
    <div className="flex items-center justify-between p-4 border-b">

      <div className="flex">
        <div className="">
          <Sheet>
            <SheetTrigger>
              <AlignJustify />
            </SheetTrigger>
            <SheetContent side="left" className="w-full">
              <SheetHeader>
                <SheetTitle>Pro Tasker</SheetTitle>
              </SheetHeader>
              <ResponsiveSidebar projects={projects} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <img src="/logo.png" alt="" className="h-8 w-8 hidden md:block"/>
          <div className="text-lg font-bold">Pro Tasker</div>
        </div>
      </div>

      <Dialog>
        <Input type="search" placeholder="Search..." className="hidden xl:block w-96" />

        <div className="flex items-center space-x-4">
          <DialogTrigger asChild>
            <Button variant="outline" className="hidden lg:flex">
              <AiFillPlusCircle size={15} className="mr-1"/> New Project
            </Button>
          </DialogTrigger>
          <ThemeToggleButton />
          <AiOutlineQuestion className="cursor-pointer text-2xl" />
          <div className="relative">
            <AiOutlineBell className="cursor-pointer text-2xl" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>

        
        <DialogContent className="sm:max-w-[425px]">
          <AddProjectForm user={user}/>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Navbar