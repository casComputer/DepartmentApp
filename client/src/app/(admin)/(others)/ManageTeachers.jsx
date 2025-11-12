import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { fetchTeachers } from "@controller/admin/teachers.controller.js";
import TeacherItem from "@components/admin/TeacherItem";

const Header = ({ title }) => {
  return (
    <View className="py-5">
      <Text className="text-white text-5xl font-bold px-3 transparent">
        Manage Teachers
      </Text>
    </View>
  );
};

const ManageTeachers = () => {
  const [teachers, setTeachers] = React.useState([]);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const teachers = await fetchTeachers();
        console.log("Loaded teachers:", teachers);
        setTeachers(teachers);
      } catch (error) {
        console.error("Failed to load teachers:", error);
      }
    };

    loadTeachers();
  }, []);

  return (
    <View className="flex-1 bg-green-700 pt-12 px-3">
      <Header title={"Manage Teachers"} />

      <FlashList
        data={teachers}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.teacherId.toString()}
        // style={{ backgroundColor: "red", flex: 1}}
        renderItem={({ item }) => (
          <TeacherItem fullname={`Teacher ${item.fullname}`} />
        )}
      />
    </View>
  );
};

export default ManageTeachers;
