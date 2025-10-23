import {
  NativeTabs,
  Icon,
  Label,
  Badge,
  VectorIcon,
} from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="Home" />
      <NativeTabs.Trigger name="Profile" />
    </NativeTabs>
  );
}
