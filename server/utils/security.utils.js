import "dotenv/config";
import { sendPushNotificationToAllUsers } from "./notification.js";

/**
 * Send security alert notification to all admins
 * @param {string} alertType - Type of security alert (TOKEN_REUSE, etc.)
 * @param {string} userId - User ID involved in the security incident
 * @param {string} message - Custom message for the alert
 * @param {Object} details - Additional details about the incident
 */
export const notifyAdminsOfSecurityThreat = async (
    alertType,
    userId,
    message = "",
    details = {}
) => {
    try {
        // Create alert message based on type
        const alertMessages = {
            TOKEN_REUSE: {
                title: "🚨 Token Reuse Detected - Possible Account Compromise",
                body: `User ${userId} attempted to use a revoked/compromised refresh token. Account may be compromised. IP: ${details.ipAddress || "unknown"}`
            },
            UNUSUAL_LOGIN: {
                title: "⚠️ Unusual Login Activity",
                body: `User ${userId} logged in from an unusual location/device. IP: ${details.ipAddress || "unknown"}`
            },
            MULTIPLE_FAILED_ATTEMPTS: {
                title: "🔐 Multiple Failed Login Attempts",
                body: `User ${userId} has multiple failed login attempts. Account may be under brute force attack.`
            },
            SUSPICIOUS_TOKEN_ACTIVITY: {
                title: "⚠️ Suspicious Token Activity",
                body: `Suspicious token activity detected for user ${userId}. ${message}`
            },
            SESSION_ANOMALY: {
                title: "🔍 Session Anomaly Detected",
                body: `Unusual session behavior detected for user ${userId}.`
            }
        };

        const alertMsg = alertMessages[alertType] || {
            title: `Security Alert: ${alertType}`,
            body: `User ${userId}: ${message}`
        };

        // Send notification to admins only
        await sendPushNotificationToAllUsers(
            alertMsg.title,
            alertMsg.body,
            {
                type: "SECURITY_ALERT",
                alertType,
                userId,
                ipAddress: details.ipAddress,
                timestamp: new Date().toISOString()
            },
            "admin" // Send only to admins
        );

        console.log(
            `✅ Security alert (${alertType}) sent to admins for user: ${userId}`
        );
        return true;
    } catch (error) {
        console.error("Error notifying admins of security threat:", error);
        return false;
    }
};
