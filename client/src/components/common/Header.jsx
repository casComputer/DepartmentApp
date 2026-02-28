import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from "react-native";
import { MaterialIcons } from "@icons";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
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
        <View className="flex-row items-center px-2 h-16 justify-between absolute top-0 left-0 z-20 w-full">
            <View className="flex-1 flex-row items-center gap-1">
                {!disableBackBtn && (
                    <TouchableOpacity
                        className="overflow-hidden p-2"
                        style={styles.background}
                        onPress={handleBack}
                    >
                        {/* 
                        <BlurView
                            tint="dark"
                            intensity={10}
                            experimentalBlurMethod={"dimezisBlurView"}
                            style={[StyleSheet.absoluteFillObject]}
                        />
                        */}
                        <MaterialIcons
                            name="arrow-back-ios-new"
                            size={ICON_SIZE}
                            style={{ fontWeight: "bold" }}
                        />
                    </TouchableOpacity>
                )}
                <View
                    style={styles.background}
                    className="max-w-[75%] overflow-hidden bg-btn/10"
                >
                    {/* Foreground Content */}
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
                    style={styles.background}
                    className="overflow-hidden p-2"
                    onPress={handlePress}
                >
                    <BlurView
                        tint="dark"
                        intensity={10}
                        experimentalBlurMethod={"dimezisBlurView"}
                        style={[StyleSheet.absoluteFillObject]}
                    />
                    <Text className="text-2xl text-blue-500 font-black w-full">
                        {buttonTitle}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        borderColor: "#323232",
        backgroundColor: "rgba(0,0,0,0.316)",
        borderWidth: 1,
        borderRadius: 23,
        padding: 10
    }
});

export default Header;
