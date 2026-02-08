import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import { ENV } from "./env.js";

//initialize arcjet with security rule

export const aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // Shield protects your app from common attacks.
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:TOOL",
                "CATEGORY:VERCEL",
                "CATEGORY:MONITOR",
            ],
        }),
        // Rate limit requests to prevent abuse.
        tokenBucket({
            mode: "LIVE",
            refillRate: 10,
            interval: 10,
            capacity: 10,
        }),

    ],
});




