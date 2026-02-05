import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

import { useAppStore } from "@store/app.store.js";
import axios from "@utils/axios.js";

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
            "myNotificationChannel",
            {
                name: "A channel is needed for the permissions prompt to appear",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C"
            }
        );
    }

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
    }

    try {
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        if (!projectId) {
            throw new Error("Project ID not found");
        }
        token = (
            await Notifications.getExpoPushTokenAsync({
                projectId
            })
        ).data;
        addNotificationToken(token);
    } catch (e) {
        token = `${e}`;
    }

    return token;
}

const addNotificationToken = async token => {
    try {
        const { data } =  await axios.post("/user/addNotificationToken", {
            token
        });
        
        console.log('response: ', data);
    } catch (error) {
        console.error(error);
    }
};

export const fetchNotifications = async page => {
    try {
        const { course = "", year = "" } = useAppStore.getState().user ?? {};

        const { data } = await axios.post("/user/getUserNotifications", {
            page,
            limit: 15,
            course,
            year
        });

        if (data.success) return data;
        return {
            success: false,
            nextPage: null,
            hasMore: false,
            notifications: []
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            nextPage: null,
            hasMore: false,
            notifications: []
        };
    }
};
