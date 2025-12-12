import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

import { useAppStore } from "@store/app.store.js";
import { compatibilityFlags } from "react-native-screens";

export const createAssignment = async (assignmentData) => {
  try {
    const userId = useAppStore.getState().user.userId;
    if (!userId) {
      throw new Error("User not logged in");
    }

    assignmentData.teacherId = userId;

    const response = await axios.post("/assignment/create", assignmentData);

    if (response.data.success) {
      ToastAndroid.show("Assignment created successfully", ToastAndroid.LONG);
      return response.data;
    }
  } catch (error) {
    ToastAndroid.show("Failed to create assignment", ToastAndroid.LONG);
    console.error("Error creating assignment:", error);
    throw error;
  }
};

export const getAssignment = async ({ pageParam }) => {
  try {
    const userId = useAppStore.getState().user.userId;
    const limit = 10;
    if (!userId) {
      throw new Error("User not logged in");
    }

    const response = await axios.post("/assignment/getAssignmentsCreatedByMe", {
      teacherId: userId,
      page: pageParam,
      limit,
    });

    if (response.data.success) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    ToastAndroid.show("Failed to create assignment", ToastAndroid.LONG);
    console.error("Error creating assignment:", error);
    throw error;
  }
};


export const rejectAssignment = async (assignmentId, studentId) => {
  try {

    const response = await axios.post("/assignment/reject", {
      assignmentId,
      studentId,
    });

    if (response.data.success) {
      ToastAndroid.show("Assignment submission rejected successfully.", ToastAndroid.SHORT);
      return response.data;
    } else {
      ToastAndroid.show(response.data.message, ToastAndroid.LONG);
    }
  } catch (error) {
    ToastAndroid.show("Internal server error.", ToastAndroid.LONG);
    console.error("Error rejecting assignment submission:", error);
    throw error;
  }
}