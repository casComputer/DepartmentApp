import {
    MaterialCommunityIcons,
    Octicons,
    MaterialIcons
} from "@expo/vector-icons";
import {
    Label,
    NativeTabs,
    Icon,
    VectorIcon
} from "expo-router/unstable-native-tabs";
import { useResolveClassNames } from "uniwind";
import { useQuery } from "@tanstack/react-query";

import { syncUser } from '@controller/teacher/teacher.controller.js'

export default function TabLayout() {
    const styles = useResolveClassNames("bg-primary text-color");

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
            shadowColor={"black"}
            backgroundColor={styles["backgroundColor"]}
        >
            <NativeTabs.Trigger name="Home">
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

            <NativeTabs.Trigger name="Dashboard">
                <Icon
                    src={
                        <VectorIcon family={MaterialIcons} name="data-usage" />
                    }
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="Profile">
                <Icon src={<VectorIcon family={Octicons} name="person" />} />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
