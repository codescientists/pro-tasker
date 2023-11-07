"use client"

import { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { PlusIcon } from "lucide-react";
import { deleteListAndTasks, insertList, updateList } from "@/lib/actions/project.action";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";


function Board({fetchedTasks, lists, projectId}) {
  
  const [tasks, setTasks] = useState<Task[]>(fetchedTasks);

  const sortedColumns = lists.slice().sort((a, b) => a.position - b.position);
  
  const [columns, setColumns] = useState<Column[]>(sortedColumns);
  
  const columnsId = useMemo(() => columns.map((col) => col.position), [columns]);
  
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const {toast} = useToast();

  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  async function createNewColumn(projectId) {
    const columnToAdd = await insertList({projectId: projectId, title: `Column ${columns.length + 1}`, position: columns.length + 1})

    setColumns([...columns, columnToAdd]);

    console.log(columns)

  }

  async function deleteColumn(listId, projectId) {

    await deleteListAndTasks(listId, projectId)

    toast({
        title: "List Deleted",
        description: "List deleted successfully",
    }) 

    router.refresh();
    
  }

  async function updateColumn(listId, title: string, position: Number) {
    const updates = {
      title: title,
      position: position
    }

    const updatedColumn = await updateList(listId, updates)
    
    const newColumns = columns.map((col) => {
      if (col._id !== listId) return col;
      return { ...col, title, position };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.position === activeId); 
      const overColumnIndex = columns.findIndex((col) => col.position === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return; 

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const overIndex = tasks.findIndex((t) => t._id === overId);

        if (tasks[activeIndex].listId != tasks[overIndex].listId) {
          tasks[activeIndex].listId = tasks[overIndex].listId;
          
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        
        // searching column with overId(position) to set task's status
        const foundColumn = sortedColumns.find(column => column.position === overId);

        tasks[activeIndex].listId = foundColumn._id;
        
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <div
      className=" flex w-full items-center overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4 py-2">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.position}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  tasks={tasks.filter((task) => task.listId === col._id)}
                  projectId={projectId}
                />
                ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn(projectId);
            }}
            className=" h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg border-2 border-slate-800 p-4  ring-blue-500 hover:ring-1 flex gap-2 ">
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                tasks={tasks.filter(
                  (task) => task.listId === activeColumn._id
                )}
              />
            )}
            {activeTask && (  
              <TaskCard
                task={activeTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default Board;