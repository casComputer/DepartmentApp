import axios from "@utils/axios.js";

export const fetchStudentsByClass = async ({ course, year }) => {
  try {
    if (!course || !year) throw new Error("course and year not found.");

    console.log(course, year);
    const res = await axios.post("/student/fetchStudentsByClass", {
      course,
      year,
    });

    console.log(res.data);

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("error while fetching students : ", error);
  }
};
