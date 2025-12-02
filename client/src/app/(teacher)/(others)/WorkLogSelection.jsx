import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle
} from "react-native-reanimated";

import Header from "@components/common/Header.jsx";
import Select from "@components/common/Select.jsx";

import { COURSES, YEAR } from "@constants/ClassAndCourses.js";
import generateDateOptions from "@utils/generateDateOptions.js";

const dateOptions = generateDateOptions(4);
const { width: vw } = Dimensions.get("window");

const SelectBoxes = ({ date, setDate, year, setYear, course, setCourse }) => (
    <>
        <Select
            options={dateOptions}
            title={"Date"}
            selected={date}
            select={setDate}
        />
        <Select
            options={YEAR}
            title={"Year"}
            selected={year}
            select={setYear}
        />
        <Select
            options={COURSES}
            title={"Course"}
            selected={course}
            select={setCourse}
        />
    </>
);

const Page2 = () => {
    return (
        <View
            style={{ width: vw }}
            className="grow bg-white dark:bg-black px-3 pt-10">
            <TextInput
                className="border py-6 px-5 text-xl font-bold rounded-3xl dark:text-white dark:border-white my-2"
                placeholder="title"
                placeholderTextColor={"rgba(119,119,119,0.7)"}
                onChangeText={txt => {}}
            />

            <TextInput
                className="border py-6 px-5 text-xl font-bold rounded-3xl dark:text-white dark:border-white my-2"
                placeholder="Topics"
                multiline
                placeholderTextColor={"rgba(119,119,119,0.7)"}
                onChangeText={txt => {}}
            />
        </View>
    );
};

const WorkLogSelection = () => {
    const [date, setDate] = useState(dateOptions?.[0] || {});
    const [course, setCourse] = useState({});
    const [year, setYear] = useState({});

    const translateX = useSharedValue(0);

    const handleNext = () => {
        translateX.value = withSpring(-vw);
    };

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <View className="grow bg-white dark:bg-black">
            <Header title={"Work Log"} />

            <Animated.View style={[{ flexDirection: "row" }, animatedStyles]}>
                <View style={{ width: vw }} className="px-3 grow">
                    <SelectBoxes
                        date={date}
                        setDate={setDate}
                        year={year}
                        setYear={setYear}
                        course={course}
                        setCourse={setCourse}
                    />
                    <View className="py-10 self-end">
                        <TouchableOpacity onPress={handleNext} className="px-5">
                            <Text className="font-black text-2xl dark:text-white">
                                Next
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Page2 />
            </Animated.View>
        </View>
    );
};

export default WorkLogSelection;
