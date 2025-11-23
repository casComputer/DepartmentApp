import { create } from "zustand";

export const useTeacherStore = create((set, get) => ({
    classDetails: [],
    setClassDetails: classDetails => set({ classDetails }),

    students: [],
    setStudents: students => set({ students }),
    getStudent: id => get().students.find(s => s.studentId === id),
    verifyStudent: id =>
        set(state => ({
            students: state.students.map(s =>
                s.studentId === id ? { ...s, is_verified: true } : s
            )
        })),
    updateStudentRollNo: (studentId, rollno) =>
        set(state => ({
            students: state.students.map(s =>
                s.studentId === studentId ? { ...s, rollno: rollno } : s
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
