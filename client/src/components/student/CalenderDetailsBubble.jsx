import { Text, View, TouchableOpacity } from "react-native";

import { Feather } from "@icons";

const PeriodBubble = ({ period, status }) => {
    const styles = {
        present: {
            bg: "bg-green-500/20",
            border: "border-green-500",
            text: "text-green-500"
        },
        late: {
            bg: "bg-yellow-500/20",
            border: "border-yellow-500",
            text: "text-yellow-500"
        },
        absent: {
            bg: "bg-red-500/20",
            border: "border-red-500",
            text: "text-red-500"
        }
    };
    const s = styles[status] ?? {
        bg: "bg-border/30",
        border: "border-border",
        text: "text-text/20"
    };

    return (
        <View
            className={`w-10 h-10 rounded-full items-center justify-center border-2 ${s.bg} ${s.border}`}
        >
            <Text className={`text-sm font-bold ${s.text}`}>{period}</Text>
        </View>
    );
};

export const DayDetailOverlay = ({ date, periods }) => {
    if (!date) return null;

    const formatted = new Date(date).toLocaleDateString("default", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });

    return (
        <View
            style={{ height: 60 }}
            className="absolute bottom-0 left-0 right-0 bg-card/95 border-t border-border flex-row items-center px-4 gap-3"
        >
            {/* Date label */}
            <Text
                className="text-text/50 text-xs font-medium w-16"
                numberOfLines={2}
            >
                {formatted}
            </Text>

            {/* Bubbles */}
            <View className="flex-1 flex-row items-center justify-around">
                {(periods ?? [null, null, null, null, null]).map(
                    (status, i) => (
                        <PeriodBubble key={i} period={i + 1} status={status} />
                    )
                )}
            </View>
        </View>
    );
};
