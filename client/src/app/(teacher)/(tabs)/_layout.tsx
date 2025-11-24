import { useEffect } from "react";
import { Label, NativeTabs, Icon } from "expo-router/unstable-native-tabs";

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
    }, []);

    return (
        <NativeTabs
            labelStyle={{
                color: "black",
                fontWeight: "900",
                fontSize: 14
            }}
            shadowColor={"black"}
            backgroundColor={"white"}>
            <NativeTabs.Trigger name="Home">
                <Label>Home</Label>
                <Icon sf="house.fill" drawable="" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="Profile" />
        </NativeTabs>
    );
}
