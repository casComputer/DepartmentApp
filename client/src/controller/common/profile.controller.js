import { ToastAndroid } from "react-native";

import axios from "@utils/axios.js";

import { useAppStore } from "@store/app.store.js";

export const uploadDp = async data => {
    const user = useAppStore.getState().user;
    const { userId, role } = user;
    const { secure_url, public_id } = data;

    if (!userId || !role || !secure_url || !public_id) return;

    const current_dp_public_id = useAppStore.getState().user.dp_public_id

    try {
        const { data } = await axios.post("/profile/uploadDp", {
            userId,
            role,
            secure_url,
            public_id,
            current_dp_public_id
        });

        if (data.success) {
            const updateData = {
                dp: secure_url,
                dp_public_id: public_id
            };

            console.log(updateData);

            useAppStore.getState().updateUser(updateData);
        } else
            ToastAndroid.show(
                data.message ?? "Failed to update profile picture",
                ToastAndroid.LONG
            );
    } catch (error) {
        console.error(error);
        ToastAndroid.show(
            "Failed to update profile picture",
            ToastAndroid.LONG
        );
    }
};
