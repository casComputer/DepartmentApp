import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";
import * as DocumentPicker from "expo-document-picker";

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

export const handleDocumentPick = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    types: ["application/pdf", "image/*"],
  });

  if (result.canceled) {
    return;
  } else {
    const { name, size, uri, mimeType } = result.assets[0];

    if (!name || !uri || !mimeType || !size) {
      ToastAndroid.show(
        "Failed to retrieve file information. Please try again.",
        ToastAndroid.LONG
      );
      return;
    }

    const MAX_MB = 10;
    const sizeInMB = size / (1024 * 1024);

    if (sizeInMB > MAX_MB) {
      ToastAndroid.show(
        "File size exceeds 10MB limit. Please select a smaller file.",
        ToastAndroid.LONG
      );
      return;
    }

    const allowedExt = [
      "application/pdf",
      "image/jpg",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedExt.includes(mimeType)) {
      ToastAndroid.show(
        "Invalid file type. Please select a PDF or image file.",
        ToastAndroid.LONG
      );

      return;
    }
    const cloudName = process.env.EXPO_PUBLIC_PRIMARY_CLOUDINARY_CLOUD_NAME;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();

    formData.append("file", {
      uri: uri,
      name: name,
      type: mimeType,
    });

    formData.append("upload_preset", "assignment_upload");

    try {
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Cloudinary response:", res.data);
      return res.data;
    } catch (error) {
      ToastAndroid.show(
        "Failed to upload file. Please try again.",
        ToastAndroid.LONG
      );
      console.error("Error uploading to Cloudinary:", error);
    }
  }
};
