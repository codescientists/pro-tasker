"use client"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock10Icon, PenBoxIcon, Trash2Icon, User2 } from "lucide-react";
import Moment from 'moment';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EditTaskForm from "../forms/EditTaskForm";
import { useToast } from "../ui/use-toast";
import { deleteTask } from "@/lib/actions/task.action";

// interface Props {
//   task: Task;
//   deleteTask: (id: Id) => void;
//   updateTask: (id: Id, content: string) => void;
// }

function TaskCard({ task, users }) {
  const { _id, taskName, priority , dueDate} = task;

  const {toast} = useToast();

  const handleDelete = async (taskId) =>{
      await deleteTask({
          taskId: taskId,
          path: '/'
      })

      toast({
          title: "Task Deleted",
      })  
  }

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };


  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30 bg-slate-200 dark:bg-slate-900 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-blue-500  cursor-grab relative
      "
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-slate-200 dark:bg-slate-900 p-2.5 min-h-[100px] items-center flex text-left rounded-md hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-grab relative task"
    >
      <Dialog>
        <div className="flex flex-col justify-between mb-2">
          <div className={`text-[11px] ${priority === "low" ? "text-green-500" : priority === "medium" ? "text-yellow-500" : priority === "high" ? "text-red-500" : "text-gray-500"} font-semibold mb-2 uppercase`}>
            {priority}
          </div>
          <div className="text-lg font-semibold">{taskName}</div>
          <div className="flex items-center space-x-1 text-sm mt-2">
            <User2 size={15}/>
            <span className="font-light text-[11px]">{task.assignee.name}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm mt-2">
            <Clock10Icon size={15}/>
            <span className="font-light text-[11px]">{Moment(dueDate).format('D MMMM')}</span>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <div className="flex space-x-2">
            <DialogTrigger asChild>
              <button
                className="text-blue-500 p-2 dark:bg-slate-700 rounded hover:dark:bg-slate-600 bg-slate-200 hover:bg-slate-300"
              >
                <PenBoxIcon className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <button
              onClick={() => handleDelete(_id)}
              className="text-red-500 p-2 dark:bg-slate-700 rounded hover:dark:bg-slate-600 bg-slate-200 hover:bg-slate-300"
            >
                <Trash2Icon className="h-4 w-4" />
            </button>
          </div>
        </div> 
        <DialogContent className="md:max-w-[625px]">
          <EditTaskForm task={task} users={users} />
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default TaskCard;