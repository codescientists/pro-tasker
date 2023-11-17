import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
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


function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  tasks,
  projectId,
  users,
}) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task, i) => i);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.position,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
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
        className="bg-slate-200 dark:bg-slate-950 opacity-40 border-2  border-blue-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-100 dark:bg-slate-950 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-slate-100 dark:bg-slate-950 text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between "
      >
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-slate-100 dark:bg-black border rounded outline-none px-2 py-2"
              value={column.title}
              onChange={(e) => updateColumn(column._id, e.target.value, column.position)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger>
            <button
              className=" stroke-gray-500 hover:stroke-white hover:bg-slate-800 text-[10px] rounded px-2 py-2 "
            >
              <Trash2Icon />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                If you delete this list, you will lose all the tasks under this list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  deleteColumn(column._id, projectId);
                }}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              users={users}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <DialogTrigger asChild>
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-blue-500 active:bg-black"
        >
        <PlusIcon />
        Add task
      </button>
      </DialogTrigger>
    </div>
  );
}

export default ColumnContainer;