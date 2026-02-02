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
import { useColorScheme } from "react-native";

export default function TabLayout() {
    const theme = useColorScheme();

    return (
        <NativeTabs
            labelStyle={{
                color: theme === "dark" ? "white" : "black",
                fontWeight: "900",
                fontSize: 14
            }}
            shadowColor={"black"}
            backgroundColor={theme === "dark" ? "#1a120d" : "#ffece6"}
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
