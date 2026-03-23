import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
};

export default Layout;
