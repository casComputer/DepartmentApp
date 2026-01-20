import axios from "@utils/axios.js";

import { useAppStore } from "@store/app.store.js";
import { useTeacherStore } from "@store/teacher.store.js";
import { useAppStore } from "@store/app.store.js";

export const syncUser = async () => {
  try {
    const { data } = await axios.get("/teacher/sync");

    if (data.success) {
      const in_charge_course = useTeacherStore.getState().user.in_charge_course;
      const in_charge_year = useTeacherStore.getState().user.in_charge_year;

      if (
        in_charge_course !== data.in_charge_course ||
        in_charge_year !== data.in_charge_year
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
