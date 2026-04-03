import { sendPushNotificationToClassStudents } from "../../utils/notification.js";
import { turso } from "../../config/turso.js";

export const runFeeCheck = async () => {
    try {
        const now = new Date();

        const startToday = new Date(now);
        startToday.setHours(0, 0, 0, 0);

        const endToday = new Date(now);
        endToday.setHours(23, 59, 59, 999);

        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startTomorrow = new Date(tomorrow);
        startTomorrow.setHours(0, 0, 0, 0);

        const endTomorrow = new Date(tomorrow);
        endTomorrow.setHours(23, 59, 59, 999);

        const startTodayStr = startToday.toISOString();
        const endTodayStr = endToday.toISOString();
        const startTomorrowStr = startTomorrow.toISOString();
        const endTomorrowStr = endTomorrow.toISOString();

        const [todayFees, tomorrowFees] = await Promise.all([
            turso.execute(`SELECT * FROM fees WHERE dueDate BETWEEN ? AND ?`, [
                startTodayStr,
                endTodayStr
            ]),
            turso.execute(`SELECT * FROM fees WHERE dueDate BETWEEN ? AND ?`, [
                startTomorrowStr,
                endTomorrowStr
            ])
        ]);

        await Promise.all([
            ...todayFees.rows.map(fee => handleFee(fee, "today")),
            ...tomorrowFees.rows.map(fee => handleFee(fee, "tomorrow"))
        ]);
    } catch (err) {
        console.error("❌ Fee worker failed:", err);
    }
};

const handleFee = async (fee, type) => {
    try {
        await sendPushNotificationToClassStudents({
            course: fee.course,
            year: fee.year,
            title:
                type === "today" ? "💰 Fee Due Today" : "⏰ Fee Due Tomorrow",
            body: `${fee.details} fee of ₹${fee.amount} ${
                type === "today" ? "is due today" : "is due tomorrow"
            }`,
            data: {
                type: "FEE_DEADLINE"
            }
        });
    } catch (err) {
        console.error("❌ Fee handling failed:", err);
    }
};
