import { View, Pressable, Text, ScrollView } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

import { themes } from "@constants/themes";

const ThemeSwitcher = () => {
    const { theme, hasAdaptiveThemes } = useUniwind();

    const activeTheme = hasAdaptiveThemes ? "system" : theme;

    return (
        <View className="pt-12 gap-4 bg-primary flex-1">
            <Text className="text-lg text-text">
                Current Theme :
                <Text className="text-lg text-text-secondary">
                    {activeTheme}
                </Text>
            </Text>

            <View className="bg-card w-full py-6 px-5 gap-1">
                <View className="bg-card-selected w-full h-20 rounded-3xl items-center justify-center">
                    <Text className="text-xl text-text text-center">card</Text>
                </View>
                <View className="bg-card-selected w-full h-20 rounded-3xl items-center justify-center">
                    <Text className="text-xl text-text-secondary text-center">
                        card
                    </Text>
                </View>
            </View>

            <View className="bg-btn w-full h-16 justify-center items-center rounded-3xl gap-1">
                <Text className="text-xl text-text">button</Text>
                <Text className="text-xl text-text-secondary">button</Text>
            </View>

            <View className="flex-row gap-2 flex-wrap items-center">
                {themes.map(t => (
                    <Pressable
                        key={t.name}
                        onPress={() => Uniwind.setTheme(t.name)}
                        className="px-4 py-3 rounded-lg items-center bg-btn border border-border"
                    >
                        <Text className="text-2xl text-text">{t.icon}</Text>
                        <Text className="text-xs mt-1 text-text">
                            {t.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

export default ThemeSwitcher;
