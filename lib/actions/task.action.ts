"use server"

import { revalidatePath } from "next/cache";
import Task from "../models/task.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Project from "../models/project.model";

export async function fetchTasks({projectId}) {
  try {
    connectToDB();

    return await Task.find({projectId})
    
  } catch (error: any) {
    throw new Error(`Failed to fetch task: ${error.message}`);
  }
}

interface TaskParams{
    userId: string, projectId: string, taskName:string, description: string, dueDate: Date, status: string, priority: string, path: string
}

export async function createTask({
    userId, projectId, taskName, description, dueDate, status, listId, priority, path
}: TaskParams): Promise<void> {
    try {
      connectToDB();
  
      const createdTask = await Task.create({
        userId: userId,
        projectId: projectId,
        taskName: taskName,
        description: description,
        dueDate: dueDate,
        status: status,
        listId: listId,
        priority: priority,
        },
      );

      // update project model
      await Project.findByIdAndUpdate(projectId, {
        $push: { tasks: createdTask._id },
      });
        
      revalidatePath(`/`)

    } catch (error: any) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
}

export async function editTask({
    taskId, taskName, description, dueDate, status, priority, path
}: TaskParams): Promise<void> {
    try {
      connectToDB();
  
      await Task.findByIdAndUpdate(taskId, {
        taskName: taskName,
        description: description,
        dueDate: dueDate,
        status: status,
        priority: priority,
      })
        
      revalidatePath('/')

    } catch (error: any) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
}

export async function deleteTask({
    taskId, path
}: TaskParams): Promise<void> {
    try {
      connectToDB();
  
      await Task.findByIdAndDelete(taskId);
      console.log(path)
      revalidatePath(path)

    } catch (error: any) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
}
