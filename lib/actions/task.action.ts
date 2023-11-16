"use server"

import { revalidatePath } from "next/cache";
import Task from "../models/task.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Project from "../models/project.model";
import mongoose from "mongoose";

interface TaskParams{
    userId: string, projectId: string, taskName:string, description: string, dueDate: Date, status: string, priority: string, path: string
}

export async function createTask({
    userId, projectId, taskName, description, dueDate, status, listId, priority, assignee, path
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
        assignee: assignee,
        priority: priority,
        },
      );

      // update project model
      await Project.findByIdAndUpdate(projectId, {
        $push: { tasks: createdTask._id },
      });
        
      revalidatePath(path, 'layout')

    } catch (error: any) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
}

export async function editTask({
    taskId, taskName, description, dueDate, status, priority, assignee, path
}: TaskParams): Promise<void> {
    try {
      connectToDB();
  
      await Task.findByIdAndUpdate(taskId, {
        taskName: taskName,
        description: description,
        dueDate: dueDate,
        status: status,
        priority: priority,
        assignee: new mongoose.Types.ObjectId(assignee),
      })
        
      revalidatePath(path, 'layout')

    } catch (error: any) {
      throw new Error(`Failed to edit task: ${error.message}`);
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
      throw new Error(`Failed to delete task: ${error.message}`);
    }
}
