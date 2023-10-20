"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EditTaskFrom from "../forms/EditTaskFrom";
import Moment from 'moment';
import { Clock10Icon, PenBoxIcon, Trash2Icon } from "lucide-react";

const KanbanCard = ({ task, onDragStart, onDelete }) => {

  const { _id, taskName, priority , dueDate} = task;

  return (
    <div
      key={_id}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="border bg-gray-200 dark:bg-slate-900 hover:border-black dark:hover:border-white rounded p-4 mb-2 relative transition"
    >
      <Dialog>
        <div className="flex flex-col justify-between mb-2">
          <div className={`text-[11px] ${priority === "low" ? "text-green-500" : priority === "medium" ? "text-yellow-500" : priority === "high" ? "text-red-500" : "text-gray-500"} font-semibold mb-2 uppercase`}>
            {priority}
          </div>
          <div className="text-lg font-semibold">{taskName}</div>
          <div className="flex items-center space-x-1 text-sm mt-2">
            <Clock10Icon size={15}/>
            <span className="font-bold">{Moment(dueDate).format('D MMMM')}</span>
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
              onClick={() => onDelete(_id)}
              className="text-red-500 p-2 dark:bg-slate-700 rounded hover:dark:bg-slate-600 bg-slate-200 hover:bg-slate-300"
            >
                <Trash2Icon className="h-4 w-4" />
            </button>
          </div>
        </div>        
        <DialogContent className="sm:max-w-[425px]">
          <EditTaskFrom task={task} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanCard;
