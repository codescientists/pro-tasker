import mongoose from "mongoose";  

const listSchema = new mongoose.Schema({
    title: String,
    position: Number,
});

const List = mongoose.models.List || mongoose.model("List", listSchema);

export default List;
