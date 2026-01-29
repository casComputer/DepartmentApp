import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Entypo } from "@icons";
import * as Haptics from "expo-haptics";

import MultiSelect from "@components/common/MultiSelectModal.jsx";

import { fetchStudentsByClass } from "@controller/parent/students.controller.js";

const ParentExtra = ({
  course,
  year,
  selectedStudents,
  setSelectedStudents,
}) => {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["students", course, year, open],
    queryFn: () => fetchStudentsByClass({ course, year }),
    enabled: Boolean(course && year),
  });

  const handleDone = (selected) => {
    setSelectedStudents(selected);
    setOpen(false);
  };

  const handleRemoveStudent = async (studentId) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
  };

  return (
    <View>
      {selectedStudents?.length > 0 && (
        <Text className="text-xl text-text font-bold">Your Students</Text>
      )}

      {selectedStudents?.length > 0 && (
        <View className="px-2 flex-row flex-wrap gap-2">
          {selectedStudents.map((studentId) => {
            const student = data?.students.find(
              (s) => s.userId === studentId
            );

            return (
              <View
                className="flex-row items-center gap-2 bg-card rounded-2xl mt-4 px-4 py-2"
                key={studentId}
              >
                <TouchableOpacity
                  onPress={() => handleRemoveStudent(studentId)}
                >
                  <Entypo name="cross" size={18} />
                </TouchableOpacity>
                <Text key={studentId} className="text-base text-text ">
                  {student ? student.fullname : "Unknown Student"}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity onPress={() => setOpen(true)}>
        <Text className="text-3xl py-4 font-bold text-blue-500 text-center ">
          Select student
        </Text>
      </TouchableOpacity>

      <MultiSelect
        list={data?.students}
        selected={selectedStudents}
        shouldShow={open}
        title={`Select your student from ${year} ${course}`}
        onDone={handleDone}
        isLoading={isLoading}
      />
    </View>
  );
};

export default ParentExtra;
