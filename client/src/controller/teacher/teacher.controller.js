import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

import { useAppStore } from "@store/app.store.js";

export const syncUser = async () => {
    try {
        const { data } = await axios.get("/teacher/sync");

        if (data.success) {
            const in_charge_course =
                useAppStore.getState()?.user.in_charge_course;
            const in_charge_year = useAppStore.getState()?.user.in_charge_year;

            if (
                in_charge_course !== data.in_charge_course ||
                in_charge_year !== data.in_charge_year
            )
                useAppStore.getState().updateUser({
                    in_charge_year: data?.inCharge?.year,
                    in_charge_course: data?.inCharge?.course,
                });

            useAppStore.getState().updateUser({
                courses: data.courses ?? [],
            });
        } else {
            if (data?.type === "NOT_FOUND") {
                useAppStore.getState().removeUser();
                useAppStore
                    .getState()
                    .updateUser({ is_verified: data.is_verified ?? false });
            }

            ToastAndroid.show(
                data?.message ?? "Failed to sync user data",
                ToastAndroid.LONG,
            );
        }
        return {};
    } catch (error) {
        ToastAndroid.show("Failed to sync user data", ToastAndroid.LONG);
        return {};
    }
};
