import { aj } from "../config/arcjet.js";

// Arcjet middleware for rate limiting, bot protection, and security
export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1, //each request consume 1 token
        })

        //handle denied request
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    message: "Too many requests. Please try again later.",
                })

            } else if (decision.reason.isBot()) {
                return res.status(403).json({
                    error: "bot access denied",
                    message: "Bot detected. Access denied.",
                })
            } else {
                return res.status(400).json({
                    error: "bad request",
                    message: "Bad request.",
                })
            }
        }
        //check for spoof bots
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({
                error: "bot access denied",
                message: "Bot detected. Access denied.",
            })
        }

        next();
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        // allow request to continue if Arcjet fails
        next();
    }
};
