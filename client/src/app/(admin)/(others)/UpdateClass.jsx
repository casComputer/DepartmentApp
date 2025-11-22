import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header.jsx";

const UpdateClass = () => {
    return (
        <View className="pt-12">
            <Header title={"Update Class"} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default UpdateClass;
