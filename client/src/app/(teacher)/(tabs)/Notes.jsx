import React from "react";
import { View, Text } from "react-native";

import Header from "@components/common/Header.jsx";

import { File, Paths, Directory } from "expo-file-system";

const Notes = () => {
    
    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Header title="Notes" disableBackBtn={true} />
        </View>
    );
};

export default Notes;
