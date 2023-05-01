import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema({

    name: { type: String },
    bio: { type: String }, userId: { type: String },
    username: { type: String, unique: true, required: true },
    emailId: { type: String, required: true, },
    mobile: { type: String },
    fullAddress: { type: String },
    pinCode: { type: String },
    state: { type: String },
    city: { type: String },
    country: { type: String },
    directLanding: {
        status: {
            type: Boolean,
        },
        link: {
            type: String,
        },
    },
    status: { type: String },
    userId: { type: String },
    image: { type: String },
    theme: { type:Number },
    accounts: [
        {
            account: {
                type: String,
            },
            link: {
                type: String,
            },
            status: {
                type: String,
                default: "Inactive",
            },
            

        },
    ],
  

}, { timestamps: true })
export default mongoose.model("UserData", UserDataSchema);