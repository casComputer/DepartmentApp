import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useResolveClassNames } from "uniwind";

export default function TabLayout() {
    const styles = useResolveClassNames("bg-primary text-text border-card");
    const selectedCardStyle = useResolveClassNames("bg-card-selected");

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
                <NativeTabs.Trigger.Icon md="notes" sf="note.text" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="Profile">
                <NativeTabs.Trigger.Icon md="person" sf="person" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
