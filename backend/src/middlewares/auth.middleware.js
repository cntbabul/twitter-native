import { getAuth } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
    const auth = getAuth(req);

    if (process.env.NODE_ENV !== "production" && !auth.userId && req.body.userId) {
        // mock auth in dev if needed
        auth.userId = req.body.userId;
    }

    if (!auth.userId) {
        return res.status(401).json({ message: "Unauthorized - you must login first" })
    }
    next();
}