import axios from "@utils/axios.js";

export const save = async ({ list }) => {
  try {
    const res = await axios.post("/teacher/addCourse", { list });
  } catch (error) {}
};
