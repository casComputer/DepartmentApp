import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { usePromptStore } from "@store/app.store";

const Prompt = ({
    visible,
    title = "Confirmation",
    message = "",
    requireText,
    onConfirm,
    onCancel
}) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        if (visible) setValue("");
    }, [visible]);

    if (!visible) return null;

    const handleConfirmPress = () => {
        if (requireText && value !== requireText) return;
        onConfirm?.(value);
    };

    return (
        <View className="flex-1 bg-primary/50 absolute inset-0 justify-center items-center">
            <View className="px-4 py-6 rounded-2xl border border-border bg-card-selected w-[90%] gap-3">
                <Text className="text-xl font-black text-text-secondary">
                    {title}
                </Text>

                {!!message && (
                    <Text className="text-sm text-text">{message}</Text>
                )}

                {!!requireText && (
                    <TextInput
                        className="mt-2 px-3 py-4 rounded-xl border border-border bg-card text-text"
                        value={value}
                        onChangeText={setValue}
                        placeholder={`Type ${requireText} to continue`}
                    />
                )}

                <View className="mt-4 flex-row justify-between items-center">
                    <TouchableOpacity onPress={onCancel}>
                        <Text className="text-lg font-bold text-red-500">
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleConfirmPress}>
                        <Text className="text-lg font-bold text-green-500">
                            Confirm
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const GlobalPrompt = () => {
    const { visible, title, message, requireText, onConfirm, close } =
        usePromptStore();

    return (
        <Prompt
            visible={visible}
            title={title}
            message={message}
            requireText={requireText}
            onConfirm={value => {
                onConfirm?.(value);
                close();
            }}
            onCancel={close}
        />
    );
};

export default GlobalPrompt;
