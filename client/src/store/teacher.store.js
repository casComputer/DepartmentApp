import { create } from "zustand";
import { storage } from "@utils/storage.js";

const STUDENT_KEY = "students";

export const useTeacherStore = create((set, get) => ({
    students: [],
    inCharge: {
        course: "",
        year: ""
    },

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

    getStudent: id => get().students.find(s => s.userId === id),

    verifyStudent: id =>
        set(state => {
            const updated = state.students.map(s =>
                s.userId === id ? { ...s, is_verified: true } : s
            );

            storage.set(STUDENT_KEY, JSON.stringify(updated));
            return { students: updated };
        }),

    updateStudentRollNo: (studentId, rollno) =>
        set(state => {
            const updated = state.students.map(s =>
                s.userId === studentId ? { ...s, rollno } : s
            );

            storage.set(STUDENT_KEY, JSON.stringify(updated));
            return { students: updated };
        }),

    resetAllRollNo: () =>
        set(state => {
            const updated = state.students.map(s => ({ ...s, rollno: null }));
            storage.set(STUDENT_KEY, JSON.stringify(updated));
            return { students: updated };
        }),

    updateStudentsBulk: updates =>
        set(state => {
            const updated = state.students.map(st => ({
                ...st,
                rollno: updates[st.userId] ?? null
            }));

            storage.set(STUDENT_KEY, JSON.stringify(updated));
            return { students: updated };
        }),

    removeStudent: id =>
        set(state => {
            const filtered = state.students.filter(s => s.userId !== id);

            const updated = filtered.map(s => ({ ...s, rollno: null }));

            storage.set(STUDENT_KEY, JSON.stringify(updated));

            return { students: updated };
        }),

    clearStudents: () =>
        set(state => {
            storage.set(STUDENT_KEY, JSON.stringify([]));
            return { students: [] };
        }),

    getVerifiedStudents: () => {
        const { students } = get();
        return students.filter(s => Boolean(s.is_verified));
    }
}));
