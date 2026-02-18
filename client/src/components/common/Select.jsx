import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

const Select = ({ title, options, select, selected }) => {
    const handleSelect = item => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        select(item);
    };

    return (
        <View
            style={styles.shadow}
            className="mt-5 px-2 py-4 bg-card border border-border rounded-3xl"
        >
            {title ? (
                <Text className="text-[6vw] px-3 font-bold mb-3 text-text">
                    Select the {title}:
                </Text>
            ) : null}
            <View className="w-full flex-row flex-wrap">
                {options.map(item => (
                    <TouchableOpacity
                        onPress={() => handleSelect(item)}
                        key={item.id}
                        className={`w-[50%] px-4 py-5 rounded-full ${
                            selected?.id === item.id
                                ? "bg-card-selected"
                                : "bg-transparent"
                        }`}
                    >
                        <Text className="text-xl font-bold capitalize text-text">
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)"
    }
});

export default Select;
