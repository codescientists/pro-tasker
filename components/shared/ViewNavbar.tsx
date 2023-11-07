import Link from "next/link"
import { Button } from "../ui/button"
import { AiOutlinePlus } from "react-icons/ai"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddTaskForm from "../forms/AddTaskForm"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Board from "../board/Board"
import List from "../list/List"


const ViewNavbar = ({user, projectId, project}: any) => {  
  return (
    <div className="px-10 pt-5 w-full">
      <div>
        <h4 className="text-xl mb-4 font-bold tracking-wider">{project.title}</h4>
      </div>
      <Dialog>
      <Tabs defaultValue="board" className="w-full">
        <div className="flex justify-between flex-wrap md:flex-nowrap">
          <TabsList className="grid grid-cols-3 w-full md:w-fit">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
            <DialogTrigger asChild>
              <Button className="my-2 md:m-0">
                <AiOutlinePlus className="mr-1" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[625px]">
              <AddTaskForm user={user} projectId={projectId} project={project}/>
            </DialogContent>
        </div>
        <TabsContent value="board">
          <Board fetchedTasks={project.tasks} lists={project.lists} projectId={projectId}/>
        </TabsContent>
        <TabsContent value="list">
          <List tasks={project.tasks} />
        </TabsContent>
        <TabsContent value="calendar">
          <div>
            calender
          </div>
        </TabsContent>
      </Tabs>
      </Dialog>
    </div>
  )
}

export default ViewNavbar