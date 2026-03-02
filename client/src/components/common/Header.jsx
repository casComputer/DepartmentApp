import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from "@icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

const ICON_SIZE = 26;

const Header = ({
    title,
    extraButton = false,
    handlePress,
    buttonTitle = "",
    disableBackBtn = false
}) => {
    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    return (
        <View className="flex-row items-center h-16 px-1 justify-between absolute top-0 left-0 z-20 w-full">
            <View className="flex-row items-center">
                {!disableBackBtn && (
                    <TouchableOpacity
                        className="overflow-hidden"
                        onPress={handleBack}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                        <MaterialIcons
                            name="arrow-back-ios-new"
                            size={ICON_SIZE}
                            style={{ fontWeight: "bold" }}
                        />
                    </TouchableOpacity>
                )}
                <View className="max-w-[75%] overflow-hidden">
                    <Text
                        className="text-3xl font-bold text-text"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {title}
                    </Text>
                </View>
            </View>

            {extraButton && (
                <TouchableOpacity
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    className="overflow-hidden "
                    onPress={handlePress}
                >
                    <Text className="text-2xl text-blue-500 font-black">
                        {buttonTitle}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;
