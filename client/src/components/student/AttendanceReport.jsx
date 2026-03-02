import { useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Feather } from "@icons";
import { useQuery } from "@tanstack/react-query";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Color } from "@constants/TWPallet.js";
import Loader from '@components/common/Loader';

import { getYearlyAttendenceReport } from "@controller/student/attendance.controller.js";

export const SelectYear = ({ setYear, year }) => {
    const handleChangeYear = (dir) => {
        setYear((y) => {
            const nextYear = y + dir;
            return nextYear > new Date().getFullYear() ? y : nextYear;
        });
    };

    const hideArrowRight = year + 1 > new Date().getFullYear();
    return (
        <View className="w-full pt-3 flex-row items-center justify-between px-20 mb-3">
            <TouchableOpacity onPress={() => handleChangeYear(-1)}>
                <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-text ">{year}</Text>

            <TouchableOpacity style={{ opacity: hideArrowRight ? 0 : 1 }} disabled={hideArrowRight} onPress={() => handleChangeYear(1)}>
                <Feather name="chevron-right" size={24} />
            </TouchableOpacity>
        </View>
    );
};

export const Chart = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    const { isLoading, data } = useQuery({
        queryKey: ["YearlyAttendenceReport", year],
        queryFn: () => getYearlyAttendenceReport(year),
    });

    return (
        <View>
            <Text className="text-text font-bold text-2xl text-center mt-8">
                Yearly Report
            </Text>
            <SelectYear setYear={setYear} year={year} />
            {isLoading && <Loader size="large" />}
            
            {data?.length && (
                <Animated.View entering={FadeInDown.duration(400).springify().damping(18)}>
                    <BarChart
                        key={year}
                        data={data ?? []}
                        noOfSections={4}
                        barBorderRadius={4}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        xAxisLabelTextStyle={{
                            color: Color.gray[400],
                            fontSize: 12,
                            fontWeight: "500",
                        }}
                        yAxisTextStyle={{
                            color: Color.gray[400],
                            fontSize: 12,
                            fontWeight: "500",
                        }}
                        isAnimated
                        animationDuration={250}
                        showGradient
                        gradientColor={Color.pink[500]}
                        frontColor={Color.pink[300]}
                        dashGap={10}
                        showValuesAsTopLabel
                        topLabelTextStyle={{
                            color: Color.pink[500],
                            fontSize: 9,
                            fontWeight: "700",
                            marginBottom: 2,
                        }}
                    />
                </Animated.View>
            )}
        </View>
    );
};
