"use server"

import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function fetchUser({userId}) {
  try {
    connectToDB();

    return await User.findOne({ userId: userId })
    
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function createUser({
    userId,
    name,
    email, 
}): Promise<void> {
    try {
      connectToDB();
  
      await User.create({
        userId: userId,
        name: name,
        email: email
        },
      );
      
    } catch (error: any) {
      throw new Error(`Failed to create/update user: ${error.message}`);
    }
}
