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
    account: {
        type: String,
        required: true,
    },
    

}, { timestamps: true })
export default mongoose.model("SocialAccountVisitLog", UserSchema);