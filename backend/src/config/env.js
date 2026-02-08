import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: parseInt(process.env.PORT, 10) || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGO_URI: process.env.MONGO_URI,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    ARCJET_KEY: process.env.ARCJET_KEY,
};

const requiredVars = [
    "MONGO_URI",
    "CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "ARCJET_KEY",
    "PORT",
];

for (const key of requiredVars) {
    if (ENV[key] === undefined) {
        console.error(`Error: Missing ${key}. Loaded keys:`, Object.keys(ENV).filter(k => ENV[k] !== undefined));
        // console.log("Full process.env:", process.env); // Be careful with secrets in logs
        throw new Error(`Missing required environment variable: ${key}`);
    }
}
