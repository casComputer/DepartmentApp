import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  BackHandler,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { router } from "expo-router";

import Header from "@components/common/Header.jsx";
import Select from "@components/common/Select.jsx";

import { COURSES, YEAR, HOURS } from "@constants/ClassAndCourses.js";
import generateDateOptions from "@utils/generateDateOptions.js";

import { saveWorklog } from "@controller/teacher/worklog.controller";

const dateOptions = generateDateOptions(4);
const { width: vw } = Dimensions.get("window");

const SelectBoxes = ({
  date,
  setDate,
  year,
  setYear,
  course,
  setCourse,
  hour,
  setHour,
}) => (
  <>
    <Select
      options={dateOptions}
      title={"Date"}
      selected={date}
      select={setDate}
    />
    <Select options={YEAR} title={"Year"} selected={year} select={setYear} />
    <Select
      options={COURSES}
      title={"Course"}
      selected={course}
      select={setCourse}
    />
    <Select options={HOURS} title={"Hour"} selected={hour} select={setHour} />
  </>
);

const Page2 = ({ translateX, subject, setSubject, topics, setTopics }) => {
  // useEffect(() => {
  //     const backAction = () => {
  //         // alert(translateX.value)
  //         if(translateX.value !== 0) {
  //             translateX.value = withSpring(0);
  //         }
  //         else return true;
  //     };

  //     const backHandler = BackHandler.addEventListener(
  //         "hardwareBackPress",
  //         backAction
  //     );

  //     return () => backHandler.remove();
  // }, []);

  return (
    <View style={{ width: vw }} className="grow bg-white dark:bg-black px-3 ">
      <TextInput
        className="border py-6 px-5 text-xl font-bold rounded-3xl dark:text-white dark:border-zinc-600 my-2 mt-10"
        placeholder="Subject"
        placeholderTextColor={"rgba(119,119,119,0.7)"}
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        className="border py-6 px-5 text-xl font-bold rounded-3xl dark:text-white dark:border-zinc-600 my-2"
        placeholder="Topics covered"
        multiline
        placeholderTextColor={"rgba(119,119,119,0.7)"}
        value={topics}
        onChangeText={setTopics}
      />
    </View>
  );
};

const WorkLogSelection = () => {
  const [date, setDate] = useState(dateOptions?.[0] || {});
  const [course, setCourse] = useState({});
  const [year, setYear] = useState({});
  const [hour, setHour] = useState({});

  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");

  const translateX = useSharedValue(0);

  const handlePress = () => {
    if (translateX.get() === 0) {
      if (!date.id || !year.id || !course.id) return;
      translateX.value = withSpring(-vw);
      return;
    }

    if (!subject || !topics) return;

    saveWorklog({
      date: date.id,
      year: year.id,
      course: course.id,
      hour: hour.id,
      subject,
      topics,
    });
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
      className="bg-white dark:bg-black"
      showsVerticalScrollIndicator={false}
    >
      <Header
        title={"Work Log"}
        extraButton={true}
        buttonTitle={translateX.get() === 0 ? "Next" : "Save"}
        handlePress={handlePress}
      />
      <Animated.View style={[{ flexDirection: "row" }, animatedStyles]}>
        <View style={{ width: vw }} className="px-3 grow pt-5">

            <TouchableOpacity onPress={()=> router.push("/(teacher)/(others)/WorkLogHistory")}><Text className="text-blue-500 font-bold text-3xl p-2">History</Text></TouchableOpacity>


          <SelectBoxes
            date={date}
            setDate={setDate}
            year={year}
            setYear={setYear}
            course={course}
            setCourse={setCourse}
            setHour={setHour}
            hour={hour}
          />
        </View>
        <Page2
          translateX={translateX}
          topics={topics}
          setTopics={setTopics}
          subject={subject}
          setSubject={setSubject}
        />
      </Animated.View>
    </ScrollView>
  );
};

export default WorkLogSelection;
