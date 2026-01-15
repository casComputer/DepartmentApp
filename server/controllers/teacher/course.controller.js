import { turso } from "../../config/turso.js";

export const addCourse = async (req, res) => {
    try {
        const { list } = req.body;
        const { userId, role } = req.user;

        const userField = role === "teacher" ? "teacherId" : "adminId";

        await turso.execute(
            `
        DELETE FROM teacher_courses WHERE ${userField} = ?
    `,
            [userId]
        );

        if (!list?.length)
            return res.json({
                success: true,
                message: "Courses list set to empty"
            });

        const placeholders = list.map(() => "(?, ?, ?, ?)").join(", ");

        const values = list.flatMap(item => [
            userId,
            item.year,
            item.course,
            item.course_name
        ]);

        const query = `
      INSERT INTO teacher_courses (${userField}, year, course, course_name)
      VALUES ${placeholders}
    `;

        await turso.execute(query, values);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "failed to save course details!" });
    }
};

export const fetchCourses = async (req, res) => {
    try {
        const { userId, role } = req.user;

        const userField = role === "teacher" ? "teacherId" : "adminId";

        const query = `
      SELECT year, course, course_name 
      FROM teacher_courses 
      WHERE ${userField} = ?
    `;

        const courses = await turso.execute(query, [userId]);

        res.json({ success: true, courses });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "failed to fetch courses!" });
    }
};
