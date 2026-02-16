import { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import DueDate from "@components/common/DueDate.jsx";
import Header from "@components/common/Header2.jsx";

import { create } from "@controller/teacher/fees.controller.js";

const Fees = () => {
    const [date, setDate] = useState(null);
    const [details, setDetails] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [amount, setAmount] = useState(null);
    const [saving, setSaving] = useState(false);

    const { course, year } = useLocalSearchParams();

    const handleSave = async () => {
        if (saving) return;
        try {
            setErrorMessage("");
            setSaving(true);
            if (!course || !year)
                return setErrorMessage("Please select course and year first!");

            if (!details.trim() || !date)
                return setErrorMessage("fee details and due date is required!");

            if (!amount?.trim() || isNaN(amount) || amount <= 0)
                return setErrorMessage(
                    "Amount must be a number and greater than 0!"
                );

            const isSuccess = await create({
                details: details.trim(),
                dueDate: date,
                amount: amount.trim(),
                course,
                year
            });

            if (isSuccess) {
                router.back();
                router.back();
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-primary">
            <Header
                onSave={handleSave}
                saving={saving}
            />
            <View className="px-2">
                <Text className="mt-5 text-center text-red-500 font-bold text-md">
                    {errorMessage}
                </Text>
                <TextInput
                    placeholder={"Semester + Fees Details"}
                    multiline
                    className="w-full py-6 px-4 mt-5 rounded-3xl border border-text-secondary text-text text-lg font-bold"
                    value={details}
                    onChangeText={setDetails}
                />
                <TextInput
                    placeholder={"Amount"}
                    enterKeyHint={"done"}
                    inputMode={"numeric"}
                    className="w-full py-6 px-4 mt-7 rounded-3xl border border-text-secondary text-text text-lg font-bold"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <DueDate date={date} onChange={setDate} />
        </View>
    );
};

export default Fees;
