import { Expo } from "expo-server-sdk";

import { turso } from "../config/turso.js";
import Notification from "../models/notification.js";

const expo = new Expo();

// Before/After calling this fn, make sure that the notification details are inserted into db.
export async function sendPushNotification(
    pushToken,
    title,
    body,
    data,
    image
) {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error("Invalid Expo push token");
        return;
    }

    const payloadData = JSON.parse(
        JSON.stringify({
            ...data
        })
    );

    const messages = [
        {
            to: pushToken,
            sound: "default",
            title,
            body,
            data: payloadData,
            color: "#f97bb0",
            // richContent: {
            //     image: image || ""
            // }
        }
    ];

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
        try {
            const response = await expo.sendPushNotificationsAsync(chunk);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
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
            `
        SELECT u.token FROM users u JOIN students s ON s.userId = u.userId WHERE s.course = ? AND s.year = ? AND u.role = 'student' AND u.token IS NOT NULL
    `,
            [course, year]
        );

        const notificationRes = await Notification.create({
            title,
            body,
            data: JSON.stringify(data),
            target: "class",
            yearCourse: `${year}-${course}`
        });

        data = {
            ...data,
            _id: notificationRes._id.toString()
        };

        await Promise.all(
            students.map(s =>
                sendPushNotification(s.token, title, body, data, image)
            )
        );

        return true;
    } catch (error) {
        console.error(
            "Error while sending notification to class students: ",
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

        const notificationRes = await Notification.create({
            title,
            body,
            data: JSON.stringify(data),
            target: "userIds",
            userIds: users
        });

        data = {
            ...data,
            _id: notificationRes._id.toString()
        };

        const validTokens = rows
            .map(u => u.token)
            .filter(t => Expo.isExpoPushToken(t));

        await Promise.all(
            validTokens.map(token =>
                sendPushNotification(token, title, body, data, image)
            )
        );

        return true;
    } catch (error) {
        console.error(
            "Error while sending notification to users list: ",
            error
        );
        return false;
    }
};
