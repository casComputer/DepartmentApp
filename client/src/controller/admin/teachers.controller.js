import axios from "@utils/axios.js";

export const fetchTeachers = async () => {
  try {
    const response = await axios.get("/admin/teachers");
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error.message);
    throw error;
  }
};

export const assignClass = async ({ year, course, teacherId }) => {
  try {
    const res = await axios.post("/admin/assignClass", { year, course, teacherId  });

    console.log(res);
  } catch (error) {
    console.error(error);
  }
};


export const verifyTeacher = async ({ teacherId }) => {
  try {
    const res = await axios.post("/admin/verifyTeacher", { teacherId });

    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

export const cancelVerification = async ({ teacherId }) => {
  try {
    const res = await axios.post("/admin/deleteTeacher", { teacherId });

    console.log(res);
  } catch (error) {
    console.error(error);
  }
}