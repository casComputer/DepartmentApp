import axios from "@utils/axios.js";

import { useAppStore } from "@store/app.store.js";
import { useTeacherStore } from "@store/teacher.store.js";
import { updateInCharge, updateCourses } from "@storage/teacher.storage.js";

export const syncUser = async () => {
    try {
        const { data } = await axios.get("/teacher/sync");

        if (data.success) {
            const inCharge = useTeacherStore.getState().inCharge;

            if (
                inCharge?.course !== data.in_charge_course ||
                inCharge?.year !== data.in_charge_year
            ) {
                updateInCharge({
                    year: data?.in_charge_year,
                    course: in_charge_course
                });
            }
            console.log(data);

            updateCourses();
        }
    } catch (error) {}
};
