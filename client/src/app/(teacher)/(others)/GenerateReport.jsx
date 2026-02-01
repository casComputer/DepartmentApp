import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { FontAwesome6, Octicons, FontAwesome } from "@icons";

import Header from "@components/common/Header";

import { getAttendanceXl } from "@controller/teacher/attendance.controller.js";

import { useAppStore } from "@store/app.store.js";

const GenerateReport = () => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [result, setResult] = useState({});

    const course = useAppStore(state => state.user.in_charge_course);
    const year = useAppStore(state => state.user.in_charge_year);

    const dateText =
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getFullYear();

    const handleGeneration = async () => {
        if (!year || !course || !date) return;

        const { success, pdf_url, xl_url, filename } = await getAttendanceXl({
            course,
            year,
            month: date.getMonth(),
            calendarYear: date.getFullYear()
        });

        if (success) setResult({ pdf_url, xl_url, filename });
    };

    return (
        <ScrollView className="grow bg-primary">
            <Header title={"Generate Report"} />
            <Text className="text-xl font-black mt-3 px-4 text-center text-text-secondary">
                GENERATE ATTENDANCE REPORT FOR {dateText}
            </Text>

            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <Text className="text-xl font-bold text-center text-blue-500">
                    Change Date
                </Text>
            </TouchableOpacity>

            {result.pdf_url && (
                <View className="flex-row items-center justify-around">
                    <FontAwesome6 name="file-pdf" size={24} />
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        className="w-[85%] text-text font-bold"
                    >
                        {filename}.pdf
                    </Text>
                    <Octicons name="download" size={24} />
                </View>
            )}
            {result.xl_url && (
                <View className="flex-row items-center justify-around">
                    <FontAwesome name="file-excel-o" size={24} color="black" />
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        className="w-[85%] text-text font-bold"
                    >
                        {filename}.xlsx
                    </Text>
                    <Octicons name="download" size={24} />
                </View>
            )}

            <TouchableOpacity
                className="py-5 bg-btn rounded-2xl mt-8 mx-3"
                onPress={handleGeneration}
            >
                <Text className="text-xl font-bold text-center text-text">
                    Generate Report
                </Text>
            </TouchableOpacity>
            {showPicker && (
                <DateTimePickerAndroid
                    mode="date"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (event.type === "set" && selectedDate) {
                            setDate(selectedDate);
                        }
                    }}
                    value={date}
                />
            )}
        </ScrollView>
    );
};

export default GenerateReport;
