export const protectRoute = async (req, res, next) => {
    if (process.env.NODE_ENV !== "production" && !req.auth.userId && req.body.userId) {
        req.auth.userId = req.body.userId;
    }

    if (!req.auth.userId) {
        return res.status(401).json({ message: "Unauthorized - you must login first" })
    }
    next();
}