import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import { ENV } from "./env.js";

//initialize arcjet with security rule

const arcjetMode = ENV.NODE_ENV === "production" ? "LIVE" : "DRY_RUN";

export const aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // Shield protects your app from common attacks.
        shield({ mode: arcjetMode }),
        detectBot({
            mode: arcjetMode,
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:TOOL",
            ],
        }),
        // Rate limit requests to prevent abuse.
        tokenBucket({
            mode: arcjetMode,
            refillRate: 5,
            interval: 10,
            capacity: 10,
        }),

    ],
});




