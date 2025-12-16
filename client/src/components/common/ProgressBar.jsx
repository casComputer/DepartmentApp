import { View, StyleSheet } from "react-native";

import CircularProgress from "@components/common/CircularProgress.jsx";

import { useAppStore } from "@store/app.store.js";

const ProgressBar = () => {
    const progress = useAppStore(state => state.globalProgress);

    if (progress <= 0) return null;

    return (
        <View style={styles.container}>
            <CircularProgress progress={progress} size={200} strokeWidth={18} />
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
