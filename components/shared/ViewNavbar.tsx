"use client"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AddTaskForm from "../forms/AddTaskForm"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Board from "../board/Board"
import List from "../list/List"


const ViewNavbar = ({user, projectId, tasks, project}: any) => {
  
  return (
    <div className="px-10 pt-5 w-full">
      <div>
        <h4 className="text-xl mb-4 font-bold tracking-wider">{project.title}</h4>
      </div>
      <Tabs defaultValue="board" className="w-full">
        <div className="flex justify-between flex-wrap md:flex-nowrap">
          <TabsList className="grid grid-cols-3 w-full md:w-fit">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="my-2 md:m-0">
                <AiOutlinePlus className="mr-1" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <AddTaskForm user={user} projectId={projectId}/>
            </DialogContent>
          </Dialog>
        </div>
        <TabsContent value="board">
          <Board fetchedTasks={tasks}/>
        </TabsContent>
        <TabsContent value="list">
          <List tasks={tasks} />
        </TabsContent>
        <TabsContent value="calendar">
          <div>
            calender
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ViewNavbar