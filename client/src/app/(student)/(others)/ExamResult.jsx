import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import Header from "@components/common/Header2.jsx";
import Select from "@components/common/Select.jsx";

import { handleDocumentPick } from "@utils/file.upload.js";

import { YEAR, COURSES, SEM } from "@constants/ClassAndCourses";

const ExamResult = () => {
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedCourse, setSelectedCourse] = useState({});
  const [selectedSem, setSelectedSem] = useState({});
  const [file, setFile] = useState(null);

  const handleSelectFile = async () => {
    const asset = await handleDocumentPick(["application/pdf", "image/*"]);
    if (asset) {
      setFile(asset);
    }
  };

  const handdleUploadFile = async () => {
    if(!selectedClass.id || !selectedCourse.id || !selectedSem.id) {
      ToastAndroid.show("Please select all fields.", ToastAndroid.SHORT);
      return;
    }
    const data = {

    }
  }

  return (
    <ScrollView className="flex-1 bg-primary">
      <Header />

      <View className="px-1">
        <Select
          title="Year"
          options={YEAR}
          select={setSelectedClass}
          selected={selectedClass}
        />
        <Select
          title="Class"
          options={COURSES}
          select={setSelectedCourse}
          selected={selectedCourse}
        />
        <Select
          title="Semester"
          options={SEM}
          select={setSelectedSem}
          selected={selectedSem}
        />
      </View>
      {file ? (
        <View className="mt-5 px-2">
          <Text className="text-text-secondary font-bold text-center text-lg ">Selected File: {file.name}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={handleSelectFile}>
          <Text className="text-2xl font-black text-blue-500 text-center mt-5">
            Select File
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default ExamResult;
