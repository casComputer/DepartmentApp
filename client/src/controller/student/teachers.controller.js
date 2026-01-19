import axios from "@utils/axios.js";

export const fetchAllTeachers = async () => {
  try {
    const { data } = await axios.post("/teacher/fetchAllTeachers");

    if (data.success) return data.teachers;
    else return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};
