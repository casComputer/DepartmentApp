import { Alert } from "react-native";

const showConfirm = (msg, onConfirm) => {
    Alert.alert("Confirm", msg, [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: onConfirm }
    ]);
};

export default showConfirm;
