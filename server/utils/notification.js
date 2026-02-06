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
    
    console.log(image);

    const messages = [
        {
            to: pushToken,
            sound: "default",
            title,
            body,
            data,
            color: "#f97bb0",
            image
        }
    ];

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
        try {
            await expo.sendPushNotificationsAsync(chunk);
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
        SELECT token FROM users u JOIN students s ON s.userId = u.userId WHERE s.course = ? AND s.year = ? AND u.role = 'student'
    `,
            [course, year]
        );

        for (const student of students)
            await sendPushNotification(student.token, title, body, data, image);

        await Notification.create({
            title,
            body,
            data: JSON.stringify(data),
            target: "class",
            yearCourse: `${year}-${course}`
        });
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
            `SELECT token FROM users WHERE userId IN (${placeholders})`,
            [...users]
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
        for (const user of rows)
            await sendPushNotification(user.token, title, body, data, image);

        return true;
    } catch (error) {
        console.error(
            "Error while sending notification to class students: ",
            error
        );
        return false;
    }
};
