import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { COURSE, YEAR } from "../../../constants/yearAndCourse.js";

const Selector = ({ title, options, setSelected, selected }) => (
    <View className="border border-gray-500 mt-5 rounded-3xl py-8 px-2">
        <Text className="pl-3 text-gray-900 text-[6vw] font-bold text-[6vw] mb-3">
            Select the {title}:
        </Text>
        {
            //
            options.map(item => (
                <TouchableOpacity
                    onPress={() => setSelected(item.id)}
                    key={item.id}
                    className={`rounded-full px-5 py-6 ${
                        selected === item.id ? "bg-violet-200" : ""
                    } `}>
                    <Text className="capitalize text-gray-900 text-2xl font-bold">
                        {item.title}
                    </Text>
                </TouchableOpacity>
            ))
        }
    </View>
);

const AssignClass = () => {
    const [selectedCourse, setSelectedCourse] = useState();
    const [selectedYear, setSelectedYear] = useState();

    return (
        <View className="flex-1 mt-12 px-3">
            <View className="flex-row items-center gap-3 mb-10">
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons
                        name="arrow-back-ios-new"
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
                <Text className="font-black text-[7vw]">Assign Class</Text>
            </View>

            <Selector
                title={"Class"}
                options={COURSE}
                setSelected={setSelectedCourse}
                selected={selectedCourse}
            />
            <Selector
                title={"Year"}
                options={YEAR}
                setSelected={setSelectedYear}
                selected={selectedYear}
            />

            <TouchableOpacity className="mt-8 w-full py-5 bg-green-500 rounded-3xl justify-center items-center">
                <Text className="font-black text-[6vw] ">Assign</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AssignClass;
