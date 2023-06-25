import mongoose from "mongoose";

const WebsiteTrafficSchema = new mongoose.Schema(
    {
        ip: { type: String },
        // remarks: { type: String },
        source: { type: String },
       

    },
    { timestamps: true }
);
export default mongoose.model("WebsiteTraffic", WebsiteTrafficSchema);