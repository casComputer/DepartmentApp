import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-gifted-charts";
import Feather from "@expo/vector-icons/Feather";

import { Color } from "@constants/TWPallet.js";
import { yearlyData } from "@constants/SampleData.js";

const colorThemes = {
    blue: { name: "blue", primary: 500, accent: 600 },
    purple: { name: "purple", primary: 500, accent: 600 },
    emerald: { name: "emerald", primary: 500, accent: 600 },
    orange: { name: "orange", primary: 500, accent: 600 },
    pink: { name: "pink", primary: 500, accent: 600 },
    cyan: { name: "cyan", primary: 500, accent: 600 }
};

const Chart = () => {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const data = yearlyData.map((item, i) => {
        return {
            ...item,
            topLabelComponent: () =>
                selectedIndex === i && (
                    <Text className="text-black text-center">
                        {item.value}%
                    </Text>
                )
        };
    });

    return (
        <BarChart
            data={data}
            noOfSections={4}
            barBorderRadius={4}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={{
                color: Color.gray[400],
                fontSize: 12,
                fontWeight: "500"
            }}
            onPress={(_, i) => setSelectedIndex(i)}
            yAxisTextStyle={{
                color: Color.gray[400],
                fontSize: 12,
                fontWeight: "500"
            }}
            isAnimated
            animationDuration={500}
            showGradient
            gradientColor={Color.pink[500]}
            frontColor={Color.pink[300]}
            dashGap={10}
        />
    );
};

const SelectYear = () => {
    return (
        <View className="w-full mt-12 h-16 flex-row items-center justify-between px-20">
            <TouchableOpacity>
                <Feather name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold dark:text-white ">2025</Text>
            <TouchableOpacity>
                <Feather name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const MonthlyReport = () => {
    const bgColors = [Color["orange"][100], "#ffffff", Color["orange"][100]];

    return (
        <LinearGradient colors={bgColors} className="flex-1">
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                className="pt-24 dark:bg-black">
                <SelectYear />

                <Chart />
            </ScrollView>
        </LinearGradient>
    );
};

export default MonthlyReport;
