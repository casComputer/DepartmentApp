import { create } from "zustand";

export const useAdminStore = create((set) => ({
    teachers: [],
    setTeachers: (teachers) => set({ teachers }),
    verifyTeacher: teacherId => {
        set((state) => ({
            teachers: state.teachers.map((teacher) =>
                teacher.teacherId === teacherId
                    ? { ...teacher, is_verified: true }
                    : teacher
            ),
        }));
    },
    setInCharge: (teacherId, year, classCharge) => {
        set((state) => ({
            teachers: state.teachers.map((teacher) =>
                teacher.teacherId === teacherId
                    ? { ...teacher, in_charge_year: year, in_charge_course: classCharge }
                    : teacher
            ),
        }));
    }
}));