import axios from "@utils/axios.js";

import { useAppStore } from "@store/app.store.js";
import { useTeacherStore } from "@store/teacher.store.js";

export const syncUser = async () => {
  try {
    const { data } = await axios.get("/teacher/sync");

    if (data.success) {
      const inCharge = useTeacherStore.getState().inCharge;

      if (
        inCharge?.course !== data.in_charge_course ||
        inCharge?.year !== data.in_charge_year
      )
        useAppStore.getState().updateUser({
          in_charge_year: data?.inCharge?.year,
          in_charge_course: data?.inCharge?.course,
        });

      if (data?.courses?.length) {
        useAppStore.getState().updateUser({
          courses: data.courses,
        });
      }
    }
  } catch (error) {
    console.log("Error syncing user:", error);
  }
};
