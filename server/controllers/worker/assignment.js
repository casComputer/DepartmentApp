import Assignment from "../../models/assignment.js";
import { sendNotificationForListOfUsers } from "../../utils/notification.js";
import { turso } from "../../config/turso.js";

export const runDeadlineCheck = async () => {
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

        const [todayAssignments, tomorrowAssignments] = await Promise.all([
            Assignment.find({
                dueDate: { $gte: startToday, $lte: endToday },
                notifiedToday: false
            }),
            Assignment.find({
                dueDate: { $gte: startTomorrow, $lte: endTomorrow },
                notifiedTomorrow: false
            })
        ]);

        await Promise.all([
            ...todayAssignments.map(a => handleAssignment(a, "today")),
            ...tomorrowAssignments.map(a => handleAssignment(a, "tomorrow"))
        ]);
    } catch (err) {
        console.error("❌ Worker failed:", err);
    }
};

const handleAssignment = async (assignment, type) => {
    try {
        const updated = await Assignment.findOneAndUpdate(
            {
                _id: assignment._id,
                ...(type === "today"
                    ? { notifiedToday: false }
                    : { notifiedTomorrow: false })
            },
            {
                ...(type === "today"
                    ? { notifiedToday: true }
                    : { notifiedTomorrow: true })
            },
            { new: true }
        );

        if (!updated) return;

        const submittedIds = new Set(updated.submissions.map(s => s.studentId));

        const allStudents = await getStudentsOfClass(
            updated.course,
            updated.year
        );

        const unsubmittedStudents = allStudents.filter(
            student => !submittedIds.has(student.userId)
        );

        if (unsubmittedStudents.length === 0) return;

        await sendNotificationForListOfUsers({
            users: unsubmittedStudents.map(st => st.userId),
            title: type === "today" ? "📚 Due Today" : "⏰ Due Tomorrow",
            body: `${updated.topic} ${
                type === "today" ? "is due today" : "is due tomorrow"
            } (${unsubmittedStudents.length} pending)`,
            data: {
                type: "ASSIGNMENT_DEADLINE"
            }
        });
    } catch (err) {
        console.error("❌ Assignment handling failed:", err);
    }
};

const getStudentsOfClass = async (course, year) => {
    const { rows } = await turso.execute(
        "SELECT userId FROM students WHERE course = ? AND year = ?",
        [course, year]
    );

    return rows;
};
