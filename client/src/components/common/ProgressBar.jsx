import { View, StyleSheet, Text } from "react-native";
import { useEffect } from "react";
import CircularProgress from "@components/common/CircularProgress.jsx";
import { useAppStore } from "@store/app.store.js";

const ProgressBar = () => {
    const progress = useAppStore(state => state.globalProgress);
    const text = useAppStore(state => state.globalProgressText);
    const setProgressText = useAppStore(state => state.setGlobalProgressText);

    useEffect(() => {
        if (progress <= 0) {
            setProgressText("");
        }
    }, [progress, setProgressText]);

    if (progress <= 0) return null;

    return (
        <View style={styles.container}>
            <CircularProgress progress={progress} size={200} strokeWidth={18} />

            <Text className="absolute bottom-[30%] text-text-secondary font-bold text-2xl text-center mt-8">
                {text}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    }
});

export default ProgressBar;
