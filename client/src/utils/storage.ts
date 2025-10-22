import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

type UserData = {
  username: string;
  fullname: string;
  role: string;
  course: string;
  year: string;
};

export const setUserData = ({
  username,
  fullname,
  role,
  course,
  year,
}: UserData) => {
  storage.set("username", username);
  storage.set("fullname", fullname);
  storage.set("role", role);
  storage.set("course", course);
  storage.set("year", year);
};

export const clearUser = () => {
  storage.remove("username");
  storage.remove("fullname");
  storage.remove("role");
  storage.remove("course");
  storage.remove("year");
};
