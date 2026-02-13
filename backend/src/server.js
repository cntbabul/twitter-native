import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import { connectToDB } from "./config/db.js";
import { ENV } from "./config/env.js";

import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

//error handler
app.use((err, req, res, next) => {
    console.error("Unhandles error", err);
    res.status(500).json({ error: err.message || "Internal server error" });
})

const startServer = async () => {
    try {
        await connectToDB();

        if (ENV.NODE_ENV !== 'production')
            app.listen(ENV.PORT, "0.0.0.0", () => {
                console.log(`Server is running on port ${ENV.PORT}`);
            })
    } catch (error) {
        console.error("Failed to start server", error.message);
        process.exit(1);

    }
}
if (process.env.VERCEL === '1') {
    // Vercel handles the server, just connect to DB
    connectToDB();
} else {
    // valid for local development
    startServer();
}

//export for vercel
export default app;


