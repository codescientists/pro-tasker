import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'to-do',
  },
  listId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
  },
  priority: {
    type: String,
    default: 'low',
  },
  dueDate: {
    type: Date,
  },  
  assignees: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt:{
    type: Date,
    default: Date.now,
  }
});



const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
