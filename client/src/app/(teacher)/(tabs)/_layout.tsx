import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Label, NativeTabs, Icon } from "expo-router/unstable-native-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useTeacherStore } from "@store/teacher.store.js";

export default function TabLayout() {
    const loadStudents = useTeacherStore(
        state => state.loadStudentsFromStorage
    );
    const loadInCharge = useTeacherStore(
        state => state.loadInChargeFromStorage
    );

    useEffect(() => {
        loadStudents();
        loadInCharge();
    }, [loadInCharge, loadStudents]);
    
    const theme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <NativeTabs
                labelStyle={{
                    color: theme === "dark" ? "black" : "white",
                    fontWeight: "900",
                    fontSize: 14
                }}
                shadowColor={"black"}
                backgroundColor={theme === "dark" ? "black" : "white"}>
                <NativeTabs.Trigger name="Home">
                    <Label>Home</Label>
                    <Icon sf="house.fill" drawable="" />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="Profile" />
            </NativeTabs>
        </GestureHandlerRootView>
    );
}
