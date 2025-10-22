import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

type UserData = {
  userId: string;
  fullname: string;
  role: string;
  course: string;
  year_of_study: string;
};

export const setUser = ({
  userId,
  fullname,
  role,
  course = "",
  year_of_study = "",
}: UserData) => {
  storage.set("userId", userId);
  storage.set("fullname", fullname);
  storage.set("role", role);
  storage.set("course", course);
  storage.set("year", year_of_study);
};

export const getUser = () => {
  const userId = storage.getString("userId");
  const fullname = storage.getString("fullname");
  const role = storage.getString("role");
  const course = storage.getString("course");
  const year_of_study = storage.getString("year_of_study");

  return {
    userId,
    fullname,
    role,
    course,
    year_of_study,
  };
};
