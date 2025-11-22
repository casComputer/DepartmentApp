import { create } from "zustand";

export const useTeacherStore = create(set => ({
    classDetails: [],
    setClassDetails: classDetails => set({ classDetails }),

    students: [],
    setStudents: students => set({ students }),
    verifyStudent: id =>
        set(state => ({
            students: state.students.map(s =>
                s.studentId === id ? { ...s, is_verified: true } : s
            )
        })),
        
    removeStudent: id =>
        set(state => ({
            students: state.students.filter(s => s.studentId !== id)
        })),
    inCharge: {
        course: "",
        year: ""
    },
    setInCharge: (course, year) => set({ course, year })
}));
