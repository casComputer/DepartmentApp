import { Label, NativeTabs, Icon } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

export default function TabLayout() {
    const theme = useColorScheme();
    
  return (
		<NativeTabs
			labelStyle={{
				color: theme === "dark" ? "black" : "white",
				fontWeight: "900",
				fontSize: 14,
			}}
			shadowColor={"black"}
			backgroundColor={theme === "dark" ? "black" : "white"}>
			<NativeTabs.Trigger name="Home">
				<Label>Home</Label>
				<Icon sf="house.fill" drawable="" />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="Profile" />
		</NativeTabs>
  );
}
