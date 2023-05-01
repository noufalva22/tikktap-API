import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

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
    

}, { timestamps: true })
export default mongoose.model("ProfileVisitLog", UserSchema);