import { create } from "zustand";
import { storage } from "@utils/storage.ts";

const STUDENT_KEY = "students";

export const useTeacherStore = create((set, get) => ({
    classDetails: [],
    students: [],
    inCharge: {
        course: "",
        year: ""
    },

    // classDetails

    setClassDetails: classDetails => set({ classDetails }),

    // students

    setStudents: students => {
        set({ students });
        storage.set(STUDENT_KEY, JSON.stringify(students));
    },

    loadStudentsFromStorage: () => {
        const raw = storage.getString(STUDENT_KEY);
        if (!raw) return;

        try {
            set({ students: JSON.parse(raw) });
        } catch (e) {
            console.error("Failed to parse students from storage", e);
        }
    },

    getStudent: id => get().students.find(s => s.studentId === id),

    verifyStudent: id =>
        set(state => {
            const updated = state.students.map(s =>
                s.studentId === id ? { ...s, is_verified: true } : s
            );

            storage.set(STUDENT_KEY, JSON.stringify(updated));
            return { students: updated };
        }),

    updateStudentRollNo: (studentId, rollno) =>
        set(state => {
            const updated = state.students.map(s =>
                s.studentId === studentId ? { ...s, rollno } : s
            );

            storage.set(STUDENT_KEY, JSON.stringify(updated));
            return { students: updated };
        }),

    updateStudentsBulk: updates =>
        set(state => {
            const updated = state.students.map(st => ({
                ...st,
                rollno: updates[st.studentId] ?? null
            }));

            storage.set(STUDENT_KEY, JSON.stringify(updated));
            return { students: updated };
        }),

    removeStudent: id =>
        set(state => {
            const updated = state.students.filter(s => s.studentId !== id);

            storage.set(STUDENT_KEY, JSON.stringify(updated));
            return { students: updated };
        }),

    // incharge

    setInCharge: (course, year) =>
        set(state => {
            const updated = { course, year };

            storage.set("in_charge", JSON.stringify(updated)); // auto-save

            return { inCharge: updated };
        })
    ,
    loadInChargeFromStorage: () => {
    const raw = storage.getString("in_charge");
    if (!raw) return;

    try {
        set({ inCharge: JSON.parse(raw) });
    } catch (e) {
        console.error("Failed to parse in_charge", e);
    }
}
}));
