"use client"

import { Button } from "../ui/button"
import { AiOutlinePlus } from "react-icons/ai"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

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


const ViewNavbar = ({users, user, projectId, project}: any) => {  
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
              <AddTaskForm users={users} user={user} projectId={projectId} project={project}/>
            </DialogContent>
        </div>
        <TabsContent value="board">
          <Board fetchedTasks={project.tasks} lists={project.lists} projectId={projectId} users={users}/>
        </TabsContent>
        <TabsContent value="list">
          <List tasks={project.tasks} />
        </TabsContent>
        <TabsContent value="calendar">
          <div>
            This Feature Coming Sooon! Stay Tuned!
          </div>
        </TabsContent>
      </Tabs>
      </Dialog>
    </div>
  )
}

export default ViewNavbar