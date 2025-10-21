const validateFields = (data, res) => {
  const { username, password, fullName, userRole, course, year } = data;

  if (!username || !password || !fullName || !userRole) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (userRole === "student") {
    if (!course || !year) {
      return res
        .status(400)
        .json({ error: "Course and year of study are required for students" });
    }
  }

  if (
    userRole !== "student" &&
    userRole !== "teacher" &&
    userRole !== "parent"
  ) {
    return res.status(400).json({ error: "Invalid role" });
  }

  if (course !== "Bca" && course !== "Bsc") {
    return res.status(400).json({ error: "Invalid course" });
  }
  if (
    year !== "First" &&
    year !== "Second" &&
    year !== "Third" &&
    year !== "Fourth"
  ) {
    return res.status(400).json({ error: "Invalid year of study" });
  }
};

export default validateFields;
