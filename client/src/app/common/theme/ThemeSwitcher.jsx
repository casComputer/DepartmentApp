import { View, Pressable, Text, ScrollView } from "react-native";
import { Uniwind, useUniwind } from "uniwind";
import * as Haptics from "expo-haptics";

import {
    system,
    warm,
    cool,
    wildwood_series,
    mystic,
    midnight_prestige,
    sophisticated
} from "@constants/themes";

import { storage } from "@utils/storage.js";

import Header from "@components/common/Header";

const ThemeSwitcher = () => {
    const { theme, hasAdaptiveThemes } = useUniwind();

    const activeTheme = hasAdaptiveThemes ? "system" : theme;

    const themes = [
        { name: "system", data: system },
        { name: "warm", data: warm },
        { name: "cool", data: cool },
        { name: "wildwood_series", data: wildwood_series },
        { name: "mystic", data: mystic },
        { name: "midnight_prestige", data: midnight_prestige },
        { name: "sophisticated", data: sophisticated }
    ];

    const handleChangeTheme = theme => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        Uniwind.setTheme(theme);
        storage.set("theme", theme);
    };

    return (
        <View className="flex-1 bg-primary">
            <Header title="theme" />

            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 70
                }}
                className="gap-4 pt-16"
                showsVerticalScrollIndicator={false}
            >
                {themes.map(item => (
                    <View key={item.name}>
                        <Text className="mt-3 mb-1 font-black text-2xl text-text px-3 capitalize">
                            {item.name.split("_").join(" ")}
                        </Text>

                        <View className="flex-row gap-2 flex-wrap items-center mx-3">
                            {item.data.map(t => (
                                <Pressable
                                    key={t.name}
                                    onPress={() => handleChangeTheme(t.name)}
                                    className={`w-[32%] py-3 rounded-xl items-center ${
                                        activeTheme === t.name
                                            ? "bg-card-selected"
                                            : "bg-btn"
                                    }`}
                                >
                                    <Text className="text-2xl text-primary">
                                        {t.icon}
                                    </Text>
                                    <Text className="text-xs mt-1 text-text">
                                        {t.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default ThemeSwitcher;
