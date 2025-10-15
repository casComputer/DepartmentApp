import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: {
    fullName: "",
    username: "",
  },
}));
