import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ScrollView,
    BackHandler,
    FlatList
} from "react-native";
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    useAnimatedReaction,
    runOnJS
} from "react-native-reanimated";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import Header from "@components/common/Header.jsx";
import Header2 from "@components/common/Header2.jsx";
import Select from "@components/common/Select.jsx";

import { COURSES, YEAR, HOURS } from "@constants/ClassAndCourses.js";
import generateDateOptions from "@utils/generateDateOptions.js";
import { saveWorklog } from "@controller/teacher/worklog.controller";

import { useAppStore } from "@store/app.store.js";

const dateOptions = generateDateOptions(4);
const { width: vw } = Dimensions.get("window");

/* ----------------------------- PAGE 2 ----------------------------- */

const SuggestionItem = ({ item = {}, handlePress }) => (
    <TouchableOpacity
        onPress={() => handlePress(item.course_name)}
        className="px-3 py-2 bg-card rounded-2xl"
    >
        <Text className="text-text font-bold text-lg">{item.course_name}</Text>
    </TouchableOpacity>
);

const Page2 = ({ warning, handleSave, course = "", year = "" }) => {
    const [subject, setSubject] = useState("");
    const [topics, setTopics] = useState("");
    const [loading, setLoading] = useState(false);
    const topicRef = useRef(null);

    const courses = useAppStore(state => state.user?.courses);

    const handlePress = async () => {
        setLoading(true);
        const success = await handleSave({ subject, topics });
        setLoading(false);

        if (success) router.back();
    };

    const handleSuggestionSelect = course_name => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSubject(course_name);
    };

    return (
        <View style={{ width: vw }} className="grow bg-primary px-3">
            <Header2 onSave={handlePress} saving={loading} />

            {warning !== "" && (
                <Text className="text-red-500 text-center text-lg mt-2">
                    {warning}
                </Text>
            )}

            <TextInput
                className="border mt-14 py-6 px-5 text-xl font-bold rounded-3xl text-text border-border my-2"
                placeholder="Subject"
                placeholderTextColor={"rgba(119,119,119,0.7)"}
                value={subject}
                onChangeText={setSubject}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                    topicRef.current?.focus();
                }}
            />

            <View className="flex-row flex-wrap gap-1">
                {(
                    courses?.filter(
                        c => c.year === year && c.course === course
                    ) ?? []
                ).map((c, i) => (
                    <SuggestionItem
                        key={i}
                        item={c}
                        handlePress={handleSuggestionSelect}
                    />
                ))}
            </View>

            <TextInput
                ref={topicRef}
                className="border py-6 px-5 text-xl font-bold rounded-3xl text-text border-border mt-8"
                placeholder="Topics covered"
                multiline
                placeholderTextColor={"rgba(119,119,119,0.7)"}
                value={topics}
                onChangeText={setTopics}
            />
        </View>
    );
};

/* -------------------------- SELECT BOXES --------------------------- */

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

/* --------------------------- MAIN PAGE ----------------------------- */

const WorkLogSelection = () => {
    const [page, setPage] = useState(0);

    const [date, setDate] = useState(dateOptions[0]);
    const [year, setYear] = useState(null);
    const [course, setCourse] = useState(null);
    const [hour, setHour] = useState(null);

    const [page1Warning, setPage1Warning] = useState("");
    const [page2Warning, setPage2Warning] = useState("");

    const translateX = useSharedValue(0);

    /* -------- Detect current page safely -------- */
    useAnimatedReaction(
        () => translateX.value,
        value => {
            if (Math.abs(value) < 5) {
                runOnJS(setPage)(0);
            } else if (Math.abs(value + vw) < 5) {
                runOnJS(setPage)(1);
            }
        }
    );

    /* -------- Hardware Back Button -------- */
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
    }, [page, translateX]);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    const page1Valid = date?.id && year?.id && course?.id && hour?.id;

    /* ------------------ NEXT BUTTON ------------------ */
    const handleNext = () => {
        setPage1Warning("");

        if (!page1Valid) {
            setPage1Warning("Please fill all fields before continuing.");
            return;
        }

        translateX.value = withSpring(-vw);
    };

    /* ------------------ SAVE WORKLOG ------------------ */
    const handleSave = async ({ subject, topics }) => {
        if (!subject.trim() || !topics.trim()) {
            setPage2Warning("Please enter subject and topics.");
            return false;
        }

        setPage2Warning("");

        await saveWorklog({
            date: date.id,
            year: year.id,
            course: course.id,
            hour: hour.id,
            subject,
            topics
        });

        return true;
    };

    return (
        <View className="grow bg-primary">
            <Animated.View style={[{ flexDirection: "row" }, animatedStyles]}>
                {/* ---------------- PAGE 1 ---------------- */}
                <View style={{ width: vw }} className="px-3 grow">
                    <Header
                        title="Work Log"
                        extraButton={true}
                        handlePress={() =>
                            router.push("/common/worklog/WorkLogHistory")
                        }
                        buttonTitle="History"
                    />

                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 250
                        }}
                        className="pt-16"
                        showsVerticalScrollIndicator={false}
                    >
                        {page1Warning !== "" && (
                            <Text className="text-red-500 text-center text-lg mt-2">
                                {page1Warning}
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
                        <TouchableOpacity className="mt-5" onPress={handleNext}>
                            <Text className="text-blue-500 font-black text-3xl text-center">
                                Proceed
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* ---------------- PAGE 2 ---------------- */}
                <Page2
                    warning={page2Warning}
                    handleSave={handleSave}
                    course={course?.id}
                    year={year?.id}
                />
            </Animated.View>
        </View>
    );
};

export default WorkLogSelection;
