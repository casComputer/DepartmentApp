import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useResolveClassNames } from "uniwind";
import { useQuery } from "@tanstack/react-query";

import { syncUser } from "@controller/teacher/teacher.controller.js";

export default function TabLayout() {
    const styles = useResolveClassNames("bg-primary text-text border-card");
    const selectedCardStyle = useResolveClassNames("bg-card-selected");

    useQuery({
        queryKey: ["syncUser"],
        queryFn: syncUser
    });

    return (
        <NativeTabs
            labelStyle={{
                color: styles.color,
                fontWeight: "900",
                fontSize: 14
            }}
            backgroundColor={styles["backgroundColor"]}
            iconColor={styles.color}
            indicatorColor={styles.borderColor}
            rippleColor={selectedCardStyle.backgroundColor}
        >
            <NativeTabs.Trigger name="Home">
                <NativeTabs.Trigger.Icon md="home" sf="house.fill" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="Notes">
                <NativeTabs.Trigger.Icon md="edit_note" sf="note.text" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="Dashboard">
                <NativeTabs.Trigger.Icon md="data_usage" sf="chart.pie" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="Profile">
                <NativeTabs.Trigger.Icon md="person" sf="person" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
