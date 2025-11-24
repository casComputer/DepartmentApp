import { View, ActivityIndicator } from "react-native";

const FullScreenLoader = () => {
    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <ActivityIndicator size="large" color="#fff" />
        </View>
    );
};

export default FullScreenLoader;