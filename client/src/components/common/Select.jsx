import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const Select = ({ title, options, select, selected }) => {
    return (
        <View
            style={styles.shadow}
            className="mt-5 px-2 py-4 bg-card rounded-3xl">
            {
               title ? 
            <Text className="text-[6vw] px-3 font-bold mb-3 text-text">
                Select the {title}:
            </Text> : null
            }
            <View className="w-full flex-row flex-wrap">
                {options.map(item => (
                    <TouchableOpacity
                        onPress={() => select(item)}
                        key={item.id}
                        className={`w-[50%] px-4 py-5 rounded-full ${
                            selected?.id === item.id ? "bg-card-selected" : "bg-transparent"
                        }`}>
                        <Text className="text-xl font-bold capitalize text-text">
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        boxShadow: "0px 1px 5px rgba(0,0,0,0.5)"
    }
});

export default Select;
