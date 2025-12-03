import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

import { useAppStore } from "@store/app.store.js";

export const getAssignment = async ({ pageParam }) => {
  try {
    const user = useAppStore.getState().user;

    const limit = 10;
    if (!user.userId || !user.course || !user.year_of_study) {
      throw new Error("User not logged in");
    }

    const { course, year_of_study, userId } = user;

    const response = await axios.post("/assignment/getAssignmentForStudent", {
      course,
      year_of_study,
      studentId: userId,
      page: pageParam,
      limit,
    });

    if (response.data.success) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    ToastAndroid.show("Failed to fetch assignments", ToastAndroid.LONG);
    console.error("Error creating assignment:", error);
    throw error;
  }
};
