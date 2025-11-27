import { create } from "zustand";
import { storage } from "@utils/storage.js";

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
                rollno: updates[st.studentId] ?? null
            }));

            storage.set(STUDENT_KEY, JSON.stringify(updated));
            return { students: updated };
        }),

    removeStudent: id =>
        set(state => {
            const filtered = state.students.filter(s => s.studentId !== id);

            const updated = filtered.map(s => ({ ...s, rollno: null }));

            storage.set(STUDENT_KEY, JSON.stringify(updated));

            return { students: updated };
        }),
    getVerifiedStudents: () => {
        const { students } = get();
        return students.filter(s => Boolean(s.is_verified));
    },

    // incharge

    setInCharge: (course, year) =>
        set(state => {
            const updated = { course, year };

            storage.set("in_charge", JSON.stringify(updated)); // auto-save

            return { inCharge: updated };
        }),
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
