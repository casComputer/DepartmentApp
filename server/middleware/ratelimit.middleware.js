import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const getClientIP = req => {
    return (
        req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
        req.ip ||
        req.connection.remoteAddress ||
        "unknown"
    );
};

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: {
        success: false,
        error: "Too many authentication attempts. Please try again after 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count successful requests
    skipFailedRequests: false // Count failed requests too
});

export const strictAuthLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 requests per hour
    message: {
        success: false,
        error: "Account temporarily locked due to too many failed attempts. Try again in 1 hour."
    },
    skipSuccessfulRequests: true // Don't count successful logins
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: {
        success: false,
        error: "Too many requests from this IP. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: req => req.user?.userId || getClientIP(req)
});

export const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // Allow 50 requests per 15 minutes at full speed
    delayMs: hits => hits * 100, // Add 100ms delay per request after delayAfter
    maxDelayMs: 5000, // Maximum delay of 5 seconds
    keyGenerator: req => req.user?.userId || getClientIP(req)
});

export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per 15 minutes
    message: {
        success: false,
        error: "Too many admin requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: req => req.user?.userId || getClientIP(req)
});
