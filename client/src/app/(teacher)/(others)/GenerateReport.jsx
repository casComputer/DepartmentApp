import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";

import Header from "@components/common/Header";

import { getAttendanceXl } from "@controller/teacher/attendance.controller.js";

import { useAppStore } from "@store/app.store.js";

const GenerateReport = () => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const course = useAppStore(state => state.user.in_charge_course);
    const year = useAppStore(state => state.user.in_charge_year);

    const dateText =
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getFullYear();

    const handleGeneration = async () => {
        const secure_url = await getAttendanceXl({
            course,
            year,
            month: date.getMonth(),
            calendarYear: date.getFullYear()
        });
        
        alert(secure_url)
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

            <TouchableOpacity
                className="py-5 bg-btn rounded-2xl mt-8 mx-3"
                onPress={handleGeneration}
            >
                <Text className="text-xl font-bold text-center text-text">
                    Generate Report
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default GenerateReport;
