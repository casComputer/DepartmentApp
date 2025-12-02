import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ScrollView,
    BackHandler
} from "react-native";
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    useAnimatedReaction,
    runOnJS
} from "react-native-reanimated";
import { router } from "expo-router";

import Header from "@components/common/Header.jsx";
import Select from "@components/common/Select.jsx";
import { COURSES, YEAR, HOURS } from "@constants/ClassAndCourses.js";
import generateDateOptions from "@utils/generateDateOptions.js";
import { saveWorklog } from "@controller/teacher/worklog.controller";

const dateOptions = generateDateOptions(4);
const { width: vw } = Dimensions.get("window");

const Page2 = ({ subject, setSubject, topics, setTopics }) => (
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

const SelectBoxes = ({
    date,
    setDate,
    year,
    setYear,
    course,
    setCourse,
    hour,
    setHour
}) => (
    <>
        <Select
            title="Date"
            options={dateOptions}
            selected={date}
            select={setDate}
        />
        <Select title="Year" options={YEAR} selected={year} select={setYear} />
        <Select
            title="Course"
            options={COURSES}
            selected={course}
            select={setCourse}
        />
        <Select title="Hour" options={HOURS} selected={hour} select={setHour} />
    </>
);

const WorkLogSelection = () => {
    const [page, setPage] = useState(0);

    const [date, setDate] = useState(dateOptions[0]);
    const [year, setYear] = useState({});
    const [course, setCourse] = useState({});
    const [hour, setHour] = useState({});

    const [subject, setSubject] = useState("");
    const [topics, setTopics] = useState("");

    const [warning, setWarning] = useState("");

    const translateX = useSharedValue(0);

    useAnimatedReaction(
        () => translateX.value,
        value => {
            if (value === 0) runOnJS(setPage)(0);
            else if (value === -vw) runOnJS(setPage)(1);
        }
    );

    // Back navigation
    useEffect(() => {
        const backAction = () => {
            if (page === 1) {
                translateX.value = withSpring(0);
                return true;
            }
            return false;
        };

        const handler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => handler.remove();
    }, [page]);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    const page1Valid = date.id && year.id && course.id && hour.id;
    const page2Valid = subject.trim().length > 0 && topics.trim().length > 0;

    const handlePress = () => {
        setWarning("");

        if (page === 0) {
            if (!page1Valid) {
                setWarning("Please fill all fields before continuing.");
                return;
            }

            translateX.value = withSpring(-vw);
            return;
        }

        if (!page2Valid) {
            setWarning("Please enter subject and topics.");
            return;
        }

        saveWorklog({
            date: date.id,
            year: year.id,
            course: course.id,
            hour: hour.id,
            subject,
            topics
        });
    };

    const buttonDisabled = page === 0 ? !page1Valid : !page2Valid;

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
            className="bg-white dark:bg-black"
            showsVerticalScrollIndicator={false}>
            <Header
                title={"Work Log"}
                extraButton={true}
                buttonTitle={page === 0 ? "Next" : "Save"}
                handlePress={
                    buttonDisabled
                        ? () => setWarning("Complete all fields.")
                        : handlePress
                }
                disabled={buttonDisabled}
            />

            {/* Sliding Pages */}
            <Animated.View style={[{ flexDirection: "row" }, animatedStyles]}>
                {/* PAGE 1 */}
                <View style={{ width: vw }} className="px-3 grow pt-5">
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/(teacher)/(others)/WorkLogHistory")
                        }>
                        <Text className="text-blue-500 font-bold text-xl p-2 self-end">
                            History
                        </Text>
                    </TouchableOpacity>

                    {warning !== "" && (
                        <Text className="text-red-500 text-center text-lg mt-2">
                            {warning}
                        </Text>
                    )}

                    <SelectBoxes
                        date={date}
                        setDate={setDate}
                        year={year}
                        setYear={setYear}
                        course={course}
                        setCourse={setCourse}
                        hour={hour}
                        setHour={setHour}
                    />
                </View>

                {/* PAGE 2 */}
                <Page2
                    subject={subject}
                    setSubject={setSubject}
                    topics={topics}
                    setTopics={setTopics}
                />
            </Animated.View>
        </ScrollView>
    );
};

export default WorkLogSelection;
