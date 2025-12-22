import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { storage } from "@utils/storage.js";
import { useAppStore } from "@store/app.store.js";

let API_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://dc-connect.onrender.com";

API_URL = "https://dc-connect.onrender.com"
API_URL = "http://192.168.20.90:3000";

console.log(API_URL);

const authController = async data => {
    try {
        const response = await axios.post(`${API_URL}/auth/${data.endpoint}`, {
            ...data
        });

        if (response?.data?.success) {
            const { refreshToken, accessToken, user } = response.data;

            await SecureStore.setItemAsync("refreshToken", refreshToken);
            storage.set("accessToken", accessToken);
            console.log(user);
            useAppStore.getState().setUser({ ...user });

            return { success: true, message: "Authentication Successful" };
        }

        return { success: false, message: "Something went wrong" };
    } catch (error) {
        let message = "An unexpected error occurred. Please try again.";
        if (error.response) {
            if (error.response.data?.error) {
                message = error.response.data.error;
            } else if (typeof error.response.data === "string") {
                message = error.response.data;
            } else {
                message = `Server responded with status ${error.response.status}`;
            }
        } else if (error.request) {
            message =
                "No response from the server. Please check your network connection or please try again later.";
        } else {
            message = error.message;
        }
        return { success: false, message };
    }
};

export default authController;
