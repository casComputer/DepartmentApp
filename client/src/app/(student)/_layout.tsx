import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        color: "black",
        fontWeight: "900",
        fontSize: 14,
      }}
      shadowColor={"black"}
      backgroundColor={"white"}
    >
      <NativeTabs.Trigger name="Home" />
      <NativeTabs.Trigger name="Profile" />
    </NativeTabs>
  );
}
