import { Expo } from "expo-server-sdk";

import { turso } from "../config/turso.js";
import Notification from "../models/notification.js";

const expo = new Expo();

function buildMessages(tokens, title, body, data, image) {
    return tokens.map(token => ({
        to: token,
        sound: "default",
        title,
        body,
        data,
        color: "#f97bb0",
        ...(image ? { richContent: { image } } : {})
    }));
}

async function sendPushNotifications(tokens, title, body, data, image) {
    const validTokens = tokens.filter(t => Expo.isExpoPushToken(t));
    if (!validTokens.length) return [];

    const messages = buildMessages(validTokens, title, body, data, image);
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
        try {
            const chunkTickets = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...chunkTickets);
        } catch (error) {
            console.error("Error sending push notification chunk:", error);
        }
    }

    return tickets;
}

export async function checkPushReceipts(ticketTokenMap) {
    const receiptIds = Object.keys(ticketTokenMap);
    if (!receiptIds.length) return;

    const receiptChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    for (const chunk of receiptChunks) {
        try {
            const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

            for (const [receiptId, receipt] of Object.entries(receipts)) {
                if (receipt.status === "error") {
                    console.error(
                        `Push receipt error [${receiptId}]:`,
                        receipt.message,
                        receipt.details
                    );

                    if (receipt.details?.error === "DeviceNotRegistered") {
                        const deadToken = ticketTokenMap[receiptId];
                        if (deadToken) {
                            await turso.execute(
                                `UPDATE users SET token = NULL WHERE token = ?`,
                                [deadToken]
                            );
                            console.log(`Removed dead token: ${deadToken}`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error checking push receipts:", error);
        }
    }
}

async function sendAndScheduleReceipts(tokens, title, body, data, image) {
    const validTokens = tokens.filter(t => Expo.isExpoPushToken(t));
    if (!validTokens.length) return;

    const messages = buildMessages(validTokens, title, body, data, image);
    const chunks = expo.chunkPushNotifications(messages);

    const ticketTokenMap = {};
    let messageIndex = 0;

    for (const chunk of chunks) {
        try {
            const chunkTickets = await expo.sendPushNotificationsAsync(chunk);

            chunkTickets.forEach((ticket, i) => {
                if (ticket.status === "ok" && ticket.id) {
                    ticketTokenMap[ticket.id] = messages[messageIndex + i].to;
                }
            });

            messageIndex += chunk.length;
        } catch (error) {
            console.error("Error sending push notification chunk:", error);
            messageIndex += chunk.length;
        }
    }

    if (Object.keys(ticketTokenMap).length) {
        setTimeout(() => checkPushReceipts(ticketTokenMap), 15 * 60 * 1000);
    }
}

export const sendPushNotificationToClassStudents = async ({
    course,
    year,
    title = "",
    body = "",
    data = {},
    image = null
}) => {
    try {
        if (!course || !year) {
            console.error("Invalid year and course");
            return false;
        }

        const { rows: students } = await turso.execute(
            `SELECT u.token 
             FROM users u 
             JOIN students s ON s.userId = u.userId 
             WHERE s.course = ? AND s.year = ? AND u.role = 'student' AND u.token IS NOT NULL`,
            [course, year]
        );

        const validTokens = students
            .map(s => s.token)
            .filter(t => Expo.isExpoPushToken(t));

        if (!validTokens.length) return true;

        const notificationRes = await Notification.create({
            title,
            body,
            data: JSON.stringify(data),
            target: "class",
            yearCourse: `${year}-${course}`
        });

        data = { ...data, _id: notificationRes._id.toString() };

        await sendAndScheduleReceipts(validTokens, title, body, data, image);

        return true;
    } catch (error) {
        console.error(
            "Error while sending notification to class students:",
            error
        );
        return false;
    }
};

export const sendNotificationForListOfUsers = async ({
    users = [],
    title = "",
    body = "",
    data = {},
    image = null
}) => {
    try {
        if (!users.length) return true;

        const placeholders = users.map(() => "?").join(",");

        const { rows } = await turso.execute(
            `SELECT token 
             FROM users 
             WHERE userId IN (${placeholders}) 
               AND token IS NOT NULL`,
            users
        );

        const validTokens = rows
            .map(u => u.token)
            .filter(t => Expo.isExpoPushToken(t));

        if (!validTokens.length) return true;

        const notificationRes = await Notification.create({
            title,
            body,
            data: JSON.stringify(data),
            target: "userIds",
            userIds: users
        });

        data = { ...data, _id: notificationRes._id.toString() };

        await sendAndScheduleReceipts(validTokens, title, body, data, image);

        return true;
    } catch (error) {
        console.error("Error while sending notification to users list:", error);
        return false;
    }
};

export const sendPushNotificationToAllUsers = async (
    title,
    body,
    data,
    role
) => {
    try {
        const condition = role ? `AND role = ?` : "";

        const { rows } = await turso.execute({
            sql: `SELECT token 
                  FROM users 
                  WHERE token IS NOT NULL ${condition}`,
            args: role ? [role] : []
        });

        const validTokens = rows
            .map(u => u.token)
            .filter(t => Expo.isExpoPushToken(t));

        if (!validTokens.length) return true;

        await Notification.create({
            title,
            body,
            data: JSON.stringify(data),
            target: role || "all"
        });

        await sendAndScheduleReceipts(validTokens, title, body, data, null);

        return true;
    } catch (error) {
        console.error("Error while sending notification to all users:", error);
        return false;
    }
};

export const sendPushNotificationToParentsOfStudents = async ({
    students = [],
    title = "",
    body = "",
    data = {},
    image = null
}) => {
    try {
        if (!students.length) return true;

        const placeholders = students.map(() => "?").join(",");

        const { rows } = await turso.execute(
            `SELECT DISTINCT u.token, u.userId
             FROM users u
             INNER JOIN parent_child pc ON pc.parentId = u.userId
             WHERE pc.studentId IN (${placeholders})
               AND pc.is_verified = TRUE
               AND u.token IS NOT NULL`,
            students
        );

        const validTokens = rows
            .map(row => row.token)
            .filter(t => Expo.isExpoPushToken(t));

        if (!validTokens.length) return true;

        const notificationRes = await Notification.create({
            title,
            body,
            data: JSON.stringify(data),
            target: "userIds",
            userIds: rows.map(item => item.userId)
        });

        data = { ...data, _id: notificationRes._id.toString() };

        await sendAndScheduleReceipts(validTokens, title, body, data, image);

        return true;
    } catch (err) {
        console.error(
            "Error while sendPushNotificationToParentsOfStudents:",
            err
        );
        return false;
    }
};
