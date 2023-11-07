import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: [String],
        default: ['active', 'completed', 'on hold']
    },
    startDate: {
        type: Date,
        required: true,
    },
    dueDate:{
        type:Date,
        required: true,
    },
    lists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List',
        }
    ],
    teamMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ],
      
});



const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
