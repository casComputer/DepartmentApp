import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const Select = ({ title, options, select, selected }) => {
    return (
        <View
            style={styles.shadow}
            className="mt-5 px-2 py-6 bg-white rounded-3xl ">
            <Text className=" text-[6vw] px-3 font-bold  mb-3">
                Select the {title}:
            </Text>

            {options.map(item => (
                <TouchableOpacity
                    onPress={() => select(item)}
                    key={item.id}
                    className={`px-4 py-6 rounded-full ${
                        selected?.id === item.id ? "bg-violet-200" : ""
                    }`}>
                    <Text className="text-xl font-bold capitalize">
                        {item.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10
    }
});

export default Select;
