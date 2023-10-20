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
    members: [{
        name: {
        type: String,
        required: true,
        },
        email: {
        type: String,
        required: true,
        },
    }],
});



const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
