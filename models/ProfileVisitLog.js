import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: { type: String },
    email: { type: String },
    username: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        
    },
    location: {
        type: String,
        
    },
    time: { type: String },
    


}, { timestamps: true })
export default mongoose.model("ProfileVisitLog", UserSchema);