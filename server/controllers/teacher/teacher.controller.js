import { turso } from "../../config/turso.js";

export const syncUser = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId)
      return res
        .status(400)
        .json({ message: "User ID is required.", success: false });

    const { rows: user } = await turso.execute(
      "SELECT c.year as in_charge_year, c.course as in_charge_course FROM classes c RIGHT JOIN teacher_courses tc ON c.in_charge = tc.teacherId WHERE in_charge = ?",
      [userId]
    );

    console.log(user);

    return res.json({ success: true, user: user[0] });
  } catch (error) {
    console.error("Error syncing teacher:", error);

    return res
      .status(500)
      .json({ message: "Internal server error.", success: false });
  }
};
