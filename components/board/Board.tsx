"use client"
import React, { useState } from 'react';
import KanbanCard from './KanbanCard';
import { deleteTask } from '@/lib/actions/task.action';
import { usePathname } from 'next/navigation';
import { toast } from '../ui/use-toast';

const Board = ({fetchedTasks}) => {
  const [tasks, setTasks] = useState(fetchedTasks);
  const pathname = usePathname();

    const handleDragStart = (e, task) => {
      e.dataTransfer.setData('text/plain', task._id.toString());
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e, status) => {
        const taskId = e.dataTransfer.getData('text/plain');

        const updatedTasks = tasks.map((task) => {
          if (task._id.toString() === taskId) {
              return { ...task, status };
          }
          console.log(task)
          return task;
        });
        setTasks(updatedTasks)
    };

    const handleDelete = async (taskId) => {
      await deleteTask({taskId: taskId, path: pathname});
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId))
      
      toast({
          title: "Done!",
          description: "Task Deleted",
      })  
    };

  return (
    <div className="flex mt-4 px-2  min-w-full">
      <div
        className="w-full p-4 border mr-4"
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, 'to-do')}
      >
        <h2 className="text-md bg-red-600  text-white mb-4 inline-block px-2 rounded">Todo</h2>
        {
        tasks
          .filter((task) => task.status === 'to-do')
          .map((task) => (
            <KanbanCard
              key={task._id}
              task={task}
              onDragStart={handleDragStart}
              onDelete={handleDelete}
            />
          ))
        }
      </div>
      <div
        className="w-full p-4 border mr-4"
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, 'in-progress')}
      >
        <h2 className="text-md bg-yellow-600 text-white mb-4 inline-block px-2 rounded">In Progress</h2>
        {tasks
          .filter((task) => task.status === 'in-progress')
          .map((task) => (
            <KanbanCard
              key={task._id}
              task={task}
              onDragStart={handleDragStart}
              onDelete={handleDelete}
            />
          ))}
      </div>
      <div
        className="w-full p-4 border"
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, 'completed')}
      >
        <h2 className="text-md bg-green-600 text-white mb-4 inline-block px-2 rounded">Done</h2>
        {tasks
          .filter((task) => task.status === 'completed')
          .map((task) => (
            <KanbanCard
              key={task._id}
              task={task}
              onDragStart={handleDragStart}
              onDelete={handleDelete}
            />
          ))}
      </div>
    </div>
  );
};

export default Board;
