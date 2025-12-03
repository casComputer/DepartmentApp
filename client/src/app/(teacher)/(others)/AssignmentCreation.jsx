import { View, Text } from "react-native";
import React from "react";

import Header from "@components/common/Header2.jsx";
import Select from "@components/common/Select.jsx";

import { COURSES, YEAR } from "@constants/ClassAndCourses.js";

const AssignmentCreation = () => {
  return (
    <View className="flex-1 dark:bg-black bg-white">
      <Header title="Assignments" />

      <View className="px-2 mt-4">
        <Select options={YEAR} title={"year"} />
        <Select options={COURSES} title={"course"} />
      </View>
    </View>
  );
};

export default AssignmentCreation;
