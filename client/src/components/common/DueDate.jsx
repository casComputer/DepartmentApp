import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";

const DueDate = ({ date, onChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleShow = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowDatePicker(true);
    };

    return (
        <View>
            {showDatePicker && (
                <DateTimePicker
                    value={date ?? new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        if (selectedDate && event.type === "set")
                            onChange(selectedDate);
                        setShowDatePicker(false);
                    }}
                />
            )}

            {date && (
                <View className="mt-5 py-4 px-5 rounded-3xl">
                    <Text className="text-center text-text text-xl font-bold">
                        Due Date: {date.toDateString()}
                    </Text>
                </View>
            )}

            {!showDatePicker && (
                <TouchableOpacity
                    className="mt-5 py-4 px-5"
                    onPress={handleShow}
                >
                    <Text className="text-center text-blue-500 text-2xl font-bold">
                        {date ? "Change" : "Select"}
                        Due Date
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default DueDate;
