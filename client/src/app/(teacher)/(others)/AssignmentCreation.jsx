import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import DateTimePicker from "@react-native-community/datetimepicker";

import Header from "@components/common/Header2.jsx";
import Select from "@components/common/Select.jsx";

import { createAssignment } from "@controller/teacher/assignment.controller.js";

import { COURSES, YEAR } from "@constants/ClassAndCourses.js";

const AssignmentCreation = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState({});
  const [course, setCourse] = useState({});
  const [date, setDate] = useState();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    if (!topic || !description || !year.id || !course.id || !date) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.LONG);
      return;
    }

    const assignmentData = {
      topic,
      description,
      year: year.id,
      course: course.id,
      dueDate: date,
    };

    await createAssignment(assignmentData);
    setSaving(false);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ paddingBottom: 70 }}
      className="grow bg-white dark:bg-black"
    >
      <Header title="Assignments" onSave={handleSave} saving={saving} />

      <View className="px-2 mt-4">
        <TextInput
          className="mt-5 py-7 px-5 rounded-3xl font-semibold text-xl text-black border dark:text-white dark:border-zinc-500"
          placeholderTextColor="rgb(119,119,119)"
          placeholder="Assignment Topic"
          value={topic}
          onChangeText={setTopic}
        />
        <TextInput
          className="mt-5 py-7 px-5 rounded-3xl font-semibold text-xl text-black border dark:text-white dark:border-zinc-500"
          placeholderTextColor="rgb(119,119,119)"
          placeholder="Description"
          multiline={true}
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        <Select
          options={YEAR}
          title={"year"}
          select={setYear}
          selected={year}
        />
        <Select
          options={COURSES}
          title={"course"}
          select={setCourse}
          selected={course}
        />

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
                console.log(selectedDate);
              }
            }}
          />
        )}

        {date && (
          <View className="mt-5 py-4 px-5 rounded-3xl">
            <Text className="text-center text-black dark:text-white text-xl font-bold">
              Due Date: {date.toDateString()}
            </Text>
          </View>
        )}

        {!showDatePicker && (
          <TouchableOpacity
            className="mt-5 py-4 px-5"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-center text-blue-500 text-2xl font-bold">
              Select Due Date
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AssignmentCreation;
