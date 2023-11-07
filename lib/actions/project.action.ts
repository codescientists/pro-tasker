"use server"

import { revalidatePath } from "next/cache";
import Project from "../models/project.model";
import { connectToDB } from "../mongoose";
import Task from "../models/task.model";
import List from "../models/list.model";

export async function fetchProjects({userId}) {
  try {
    connectToDB();

    return await Project.find({ userId: userId }).lean()
    
  } catch (error: any) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
}

export async function fetchProject({projectId}) {
  try {
    connectToDB();

    return await Project.findById(projectId).lean().populate([
      {
        path: "tasks",
        model: Task,
      },
      {
        path: "lists",
        model: List,  
      }
    ]);
  
    
  } catch (error: any) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
}

interface ProjectParams{
    userId: string, title:string, description: string, startDate: Date, dueDate: Date,
}

export async function createProject({
  userId,
  title,
  description,
  startDate,
  dueDate,
}: ProjectParams): Promise<void> {
  try {
    await connectToDB();

    // Default lists
    const defaultLists = [
      {
          title: 'To do',
          position: 1,
      },
      {
          title: 'In Progress',
          position: 2,
      },
      {
          title: 'Completed',
          position: 3,
      },
    ]

    const createdLists = await List.insertMany(defaultLists);

    const listIds = createdLists.map((list) => list._id);

    const project = new Project({
      userId: userId,
      title: title,
      description: description,
      startDate: startDate,
      dueDate: dueDate,
      lists : listIds,
    });

    await project.save();

    revalidatePath('/')

  } catch (error: any) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
}

export async function updateProject({
    projectId, title, description, 
}: ProjectParams): Promise<void> {
    try {
      connectToDB();
  
      await Project.findByIdAndUpdate(projectId, {
        title: title,
        description: description,
      })

      revalidatePath('/')
      
    } catch (error: any) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
}


export async function insertList({
  projectId,
  title,
  position,
}: ProjectParams): Promise<void> {
  try {
    await connectToDB(); // Make sure you await the connection

    // Create the new list
    const createdList = await List.create({
      title: title,
      position: position,
    });

    // Find the project by ID and push the new list's _id into the lists array
    await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { lists: createdList._id },
      },
      { new: true }
    );

    revalidatePath('/');
    return createdList

  } catch (error: any) {
    throw new Error(`Failed to create list: ${error.message}`);
  }
}

export async function updateList(listId, updates) {
  try {
    await connectToDB(); 

    const updatedList = await List.findByIdAndUpdate(
      listId,
      updates,
      { new: true }
    );

    if (!updatedList) {
      throw new Error('List not found'); 
    }
  } catch (error: any) {
    throw new Error(`Failed to update list: ${error.message}`);
  }
}


export async function deleteListAndTasks(listId, projectId) {
  try {
    await connectToDB(); // Ensure you have an active database connection

    // Find the list by its ID and retrieve its title
    const list = await List.findById(listId);
    if (!list) {
      throw new Error('List not found');
    }

    // Get the position of the list to be deleted
    const deletedPosition = list.position;

    // Delete all tasks that belong to the list
    await Task.deleteMany({ listId });

    // Find the project by its ID and remove the list from its "lists" array
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { lists: listId } },
      { new: true }
    );

    if (!project) {
      throw new Error('Project not found');
    }

    // Finally, delete the list itself
    await List.findByIdAndDelete(listId);

    // Find all other lists that belong to the same project and have a position greater than the deleted list's position
    const remainingLists = await List.find({ projectId, position: { $gt: deletedPosition } });

    // Update the positions of the remaining lists
    for (const remainingList of remainingLists) {
      remainingList.position -= 1;
      await remainingList.save();
    }

  } catch (error) {
    throw new Error(`Failed to delete list and tasks: ${error.message}`);
  }
}
