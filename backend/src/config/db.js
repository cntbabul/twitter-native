import mongoose from "mongoose";
import { ENV } from "../config/env.js";

export const connectToDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("Connected to MongoDB ✅");
    } catch (error) {
        console.error("Failed to connect to MongoDB ❌", error);
        process.exit(1);
    }
};
