import axios from "@utils/axios.js";

import { useAppStore } from "@store/app.store.js";
<<<<<<< HEAD

export const syncUser = async () => {
    try {
        const userId = useAppStore.getState().user.userId;
        if (!userId) return;

        const response = await axios.post("/teacher/getTeacherInfo", {
            userId,
        });

        if (response.data.success) {
            useAppStore.getState().updateUser(response.data.info);
        }

        return response.data;
    } catch (error) {
        console.error("Error syncing user:", error);
        throw error;
    }
=======
import { useTeacherStore } from "@store/teacher.store.js";
import { updateInCharge } from "@storage/teacher.storage.js";

export const syncUser = async () => {
	try {
		const userId = useAppStore.getState().user.userId;

		console.log("syncing ", userId);

		const { data } = await axios.post("/teacher/sync", { userId });

		if (data.success) {
			const inCharge = useTeacherStore.getState().inCharge;

			if (
				inCharge?.course !== data.in_charge_course ||
				inCharge?.year !== data.in_charge_year
			) {
				updateInCharge({
					year: data?.in_charge_year,
					course: in_charge_course,
				});
			}
			console.log(data);
		}
	} catch (error) {}
>>>>>>> 9fc9ae3eeb73f2c346785576142fcfc3ce825101
};
