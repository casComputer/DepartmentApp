import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { CLASS, COURSES } from "@constants/ClassAndCourses";
import { assignClass } from "@controller/admin/teachers.controller";

import { useAdminStore } from "@store/admin.store.js";

const Select = ({ title, options, select, selected }) => {
  return (
    <View className="mt-5 px-2 py-6 bg-white rounded-3xl ">
      <Text className=" text-[6vw] px-3 font-bold  mb-3">
        Select the {title}:
      </Text>

      {options.map((item) => (
        <TouchableOpacity
          onPress={() => select(item)}
          key={item.id}
          className={`px-4 py-6 rounded-full ${selected?.id === item.id ? "bg-violet-200" : ""}`}
        >
          <Text className="text-xl font-bold capitalize">{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const AssignClass = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  let {userId} = useLocalSearchParams();

  const user = useAdminStore((state) => state.teachers.find(t => t.teacherId === userId));

  const handleAssignClass = ()=>{
    if(selectedClass && selectedCourse && user && user.teacherId){
      assignClass({ year: selectedClass, course: selectedCourse, teacherId: user.teacherId })
    }
  }

  return (
    <View className="flex-1 mt-12 px-3 bg-zinc-100">
      <View className="flex-row items-center gap-3 mb-5">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-black text-[7vw]">Assign Class</Text>
      </View>

      <Select
        title="Course"
        options={COURSES}
        select={setSelectedCourse}
        selected={selectedCourse}
      />
      <Select
        title="Year"
        options={CLASS}
        select={setSelectedClass}
        selected={selectedClass}
      />

      <TouchableOpacity onPress={handleAssignClass} className="w-full bg-pink-600 p-6 justify-center items-center rounded-3xl mt-5">
        <Text className='text-[6vw] font-black '>Assign</Text>
      </TouchableOpacity>

    </View>
  );
};

export default AssignClass;
