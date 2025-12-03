import axios from "@utils/axios.js";

export const fetchWorklogs = async (page, teacherId) => {
  try {
    const response = await axios.post("/teacher/getWorklogs", {
      teacherId,
      page,
      limit: 25,
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error("Failed to fetch worklogs.");
    }
  } catch (error) {
    console.error("Error fetching worklogs:", error);
    throw error;
  }
};
