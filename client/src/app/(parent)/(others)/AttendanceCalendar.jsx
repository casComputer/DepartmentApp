import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Header from "@components/common/Header";
import Select from "@components/common/Select";
import { AttendanceCalendar as Calendar } from
  "@components/student/AttendanceCalendarReport";

import { useAppStore } from "@store/app.store.js";

const AttendanceCalendar = () => {
  const studentsRaw = useAppStore(state => state.user.students);

  const students = studentsRaw?.map(st => ({
    title: st,
    id: st,
  })) ?? [];

  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (students.length && !selected?.id) {
      setSelected(students[0]);
    }
  }, [students]);

  if (!students.length || !selected.id) {
    return <View className="grow bg-primary" />;
  }

  return (
    <ScrollView className="grow bg-primary">
      <Header title="Attendance Calendar" />

      <Select
        options={students}
        selected={selected}
        select={setSelected}
      />

      <Calendar studentId={selected.id ?? studentsRaw?.[0]} />
    </ScrollView>
  );
};

export default AttendanceCalendar;