import { useEffect } from "react";
import { useColorScheme } from "react-native";
import {
    Label,
    NativeTabs,
    Icon,
    VectorIcon,
} from "expo-router/unstable-native-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { syncUser } from "@controller/teacher/teacher.controller.js";

export default function TabLayout() {
    useEffect(() => {
        syncUser();
    }, []);

    const theme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NativeTabs
                labelStyle={{
                    color: theme === "dark" ? "white" : "black",
                    fontWeight: "900",
                    fontSize: 14,
                }}
                shadowColor={"black"}
                backgroundColor={theme === "dark" ? "#1a120d" : "#ffece6"}
            >
                <NativeTabs.Trigger name="Home">
                    <Label>Home</Label>
                    <Icon sf="house.fill" drawable="home" />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="Notes">
                    <Icon
                        src={
                            <VectorIcon
                                family={MaterialCommunityIcons}
                                name="notebook-edit-outline"
                            />
                        }
                    />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="Profile">
                    <Icon
                        src={<VectorIcon family={Octicons} name="person" />}
                    />
                </NativeTabs.Trigger>
            </NativeTabs>
        </GestureHandlerRootView>
    );
}
