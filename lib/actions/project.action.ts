"use server"

import { revalidatePath } from "next/cache";
import Project from "../models/project.model";
import { connectToDB } from "../mongoose";

export async function fetchProjects({userId}) {
  try {
    connectToDB();

    return await Project.find({userId})
    
  } catch (error: any) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
}

export async function fetchProject({projectId}) {
  try {
    connectToDB();

    return await Project.findById(projectId)
    
  } catch (error: any) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
}

interface ProjectParams{
    userId: string, title:string, description: string,
}

export async function createProject({
    userId, title, description, 
}: ProjectParams): Promise<void> {
    try {
      connectToDB();
  
      await Project.create({
        userId: userId,
        title: title,
        description: description,
        },
      );

      revalidatePath('/')
      
    } catch (error: any) {
      throw new Error(`Failed to create task: ${error.message}`);
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
