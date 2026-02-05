import { Expo } from "expo-server-sdk";

import { turso } from "../config/turso.js";
import Notification from "../models/notification.js";

const expo = new Expo();

// Before/After calling this fn, make sure that the notification details are inserted into db.
export async function sendPushNotification(pushToken, title, body, data) {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error("Invalid Expo push token");
        return;
    }

    const messages = [
        {
            to: pushToken,
            sound: "default",
            title,
            body,
            data,
            color: "#adfbf2"
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
    data = "{}",
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
            await sendPushNotification(student.token, title, body, data);

        await Notification.create({
            title,
            body,
            data,
            target: "class",
            yearCourse: `${year}-${course}`,
            image
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
    data = "{}",
    image = null
}) => {
    try {
        if (!users.length) return true;

        const { rows: users } = await turso.execute(
            `
        SELECT token FROM users WHERE userId IN (?)
    `,
            [course, year, users]
        );

        for (const user of users)
            await sendPushNotification(user.token, title, body, data);

        await Notification.create({
            title,
            body,
            data,
            target: "userIds",
            userIds: users,
            image
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
