import { NativeTabs } from "expo-router/unstable-native-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useResolveClassNames } from "uniwind";

export default function TabLayout() {
    const styles = useResolveClassNames("bg-primary text-text border-card");
    const selectedCardStyle = useResolveClassNames("bg-card-selected");

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                    <NativeTabs.Trigger.Icon sf="house.fill" drawable="home" />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="TeachersList">
                    <NativeTabs.Trigger.Icon
                        md="co_present"
                        sf="person.and.background.dotted"
                    />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="Profile">
                    <NativeTabs.Trigger.Icon md="person" sf="person" />
                </NativeTabs.Trigger>
            </NativeTabs>
        </GestureHandlerRootView>
    );
}
