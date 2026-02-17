import { useEffect } from "react";
import {
    Label,
    NativeTabs,
    Icon,
    VectorIcon,
} from "expo-router/unstable-native-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useResolveClassNames } from "uniwind";

export default function TabLayout() {

    const styles = useResolveClassNames("bg-primary text-color");
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NativeTabs
                labelStyle={{
                    color: styles.color,
                    fontWeight: "900",
                    fontSize: 14,
                }}
                shadowColor={"black"}
                backgroundColor={styles["backgroundColor"]}
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
