import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";

const MultiSelectModal = ({ list = [], onDone, title = "", shouldShow=false }) => {
    const [selected, setSelected] = useState([]);

    const toggleSelect = id => {
        let updated;

        if (selected.includes(id)) updated = selected.filter(s => s !== id);
        else updated = [...selected, id];

        setSelected(updated);
    };

    const renderItem = ({ item }) => {
        const isSelected = selected.includes(item.studentId);

        return (
            <TouchableOpacity
                onPress={() => toggleSelect(item.studentId)}
                style={[
                    styles.item,
                    {
                        backgroundColor: isSelected ? "#d1e7ff" : "#f7f7f7",

                        borderColor: isSelected ? "#3399ff" : "#ddd"
                    }
                ]}>
                <Text style={{ fontSize: 16 }}>{item.fullname}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={shouldShow} animationType="slide">
            <View
                style={{
                    paddingTop: 60,
                    flex: 1
                }}>
                <Text className="text-2xl font-bold text-center mb-5">
                    {title}
                </Text>
                <FlashList data={list} renderItem={renderItem} />
                <TouchableOpacity
                    onPress={() => onDone(selected)}
                    className="bg-black py-4 mb-8 rounded-2xl">
                    <Text className="text-white text-center text-lg font-bold">
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    item: {
        padding: 14,
        borderRadius: 10,
        marginVertical: 6,
        marginHorizontal: 10,
        borderWidth: 1
    }
});

export default MultiSelectModal;
