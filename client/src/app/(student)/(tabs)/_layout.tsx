import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Icon, NativeTabs, VectorIcon } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";
import { useResolveClassNames } from "uniwind";

export default function TabLayout() {
    const theme = useColorScheme();
    const styles = useResolveClassNames("bg-primary text-color");

    console.log(styles);

    return (
        <NativeTabs
            backgroundColor={styles["backgroundColor"]}
            labelStyle={{
                color: theme === "dark" ? "white" : "black",
                fontWeight: "900",
                fontSize: 14
            }}
            shadowColor="black"
        >
            <NativeTabs.Trigger name="Home">
                <Icon sf="house.fill" drawable="home" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="Notes">
                <Icon
                    src={
                        <VectorIcon
                            family={MaterialCommunityIcons}
                            name="notebook-outline"
                            color={styles.color}
                        />
                    }
                />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="Profile">
                <Icon src={<VectorIcon family={Octicons} name="person" />} />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
