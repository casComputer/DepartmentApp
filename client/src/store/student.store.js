import { create } from "zustand";

export const useStudentStore = create(set => ({
    assignments: [],
    setAssignments: (assignments)=> set({ assignments})
}));
