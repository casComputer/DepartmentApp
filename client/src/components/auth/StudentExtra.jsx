import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const YearChip = ({ isSelected, year, setSelected }) => (
    <TouchableOpacity
        className={`rounded-2xl py-3 flex-1 justify-center items-center border-black dark:border-white ${isSelected ? "bg-[#f8459e] border-0" : "border"} `}
        onPress={() => setSelected(year)}
    >
        <Text className="text-black font-bold dark:text-white">{year}</Text>
    </TouchableOpacity>
);

const StudentExtra = ({ course, setCourse, year, setYear }) => {
    return (
        <View className="flex-1">
            <View className="flex-row justify-center items-center py-5 px-3 gap-5">
                <Text className="text-black font-bold text-xl dark:text-white">Year:</Text>
                {["First", "Second", "Third", "Fourth"].map(y => (
                    <YearChip
                        key={y}
                        year={y}
                        setSelected={setYear}
                        isSelected={year === y}
                    />
                ))}
            </View>

            <View className="flex-row justify-center items-center py-5 px-3 gap-5">
                <Text className="text-black font-bold text-xl dark:text-white" >Course:</Text>
                {["Bca", "Bsc"].map(c => (
                    <YearChip
                        key={c}
                        year={c}
                        setSelected={setCourse}
                        isSelected={course === c}
                    />
                ))}
            </View>
        </View>
    );
};

export default StudentExtra;
