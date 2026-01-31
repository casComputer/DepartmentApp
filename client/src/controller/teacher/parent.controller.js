import axios from "@utils/axios";

import { ToastAndroid } from "react-native";

export const fetchParents = async () => {
    try {
        const { data } = await axios.get("/teacher/fetchParents");

        if (data.success) return data.parents ?? [];
        ToastAndroid.show(
            data.message ?? "Failed to fetch parents!",
            ToastAndroid.LONG
        );
        return [];
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Failed to fetch parents!", ToastAndroid.LONG);
        return [];
    }
};

export const verifyParent = async parentId => {
    try {
        alert(parentId)
    
        const { data } = await axios.post("/teacher/verifyParent", {
            parentId
        });

        if (data.success) {
            ToastAndroid.show("varified", ToastAndroid.LONG);
        } else
            ToastAndroid.show(
                data.message ?? "Failed to varify parent!",
                ToastAndroid.LONG
            );
    } catch (error) {
        ToastAndroid.show("Failed to verify parent!", ToastAndroid.LONG);
        console.error(error);
    }
};
export const removeParent = async () => {
    try {
        const { data } = await axios.post("/teacher/removeParent", {
            parentId
        });

        if (data.message) return;
        ToastAndroid.show(
            data.message ?? "Failed to remove parent!",
            ToastAndroid.LONG
        );
    } catch (error) {
        ToastAndroid.show("Failed to remove parent!", ToastAndroid.LONG);
        console.error(error);
    }
};
