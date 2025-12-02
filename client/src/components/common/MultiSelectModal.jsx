import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { FlashList } from "@shopify/flash-list";

const MultiSelectModal = ({
    list = [],
    onDone,
    title = "",
    shouldShow = false
}) => {
    const [selected, setSelected] = useState([]);

    const toggleSelect = id => {
        let updated;

        if (selected.includes(id)) updated = selected.filter(s => s !== id);
        else updated = [...selected, id];

        setSelected(updated);
    };

    const renderItem = 
        ({ item }) => {
            const isSelected = selected.includes(item.studentId);

            return (
                <TouchableOpacity
                    onPress={() => toggleSelect(item.studentId)}
                    className={`bg-zinc-900 p-5 rounded-3xl my-1 ${
                        isSelected &&
                        "bg-[#d1e7ff] border-[#3399ff] dark:bg-pink-500"
                    }`}>
                    <Text className="dark:text-white">{item.fullname}</Text>
                </TouchableOpacity>
            );
        }


    return (
        <Modal visible={shouldShow} animationType="slide">
            <View className="pt-10 dark:bg-black flex-1">
                <Text className="text-2xl font-bold text-center dark:text-white">
                    {title}
                </Text>
                <FlashList
                    data={list}
                    renderItem={renderItem}
                    contentContainerStyle={{ gap: 50, paddingBottom: 70 }}
                />
                <TouchableOpacity
                    onPress={() => onDone(selected)}
                    className="bg-black py-4 mb-8 rounded-2xl">
                    <Text className="text-white text-center text-xl font-bold">
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default MultiSelectModal;
