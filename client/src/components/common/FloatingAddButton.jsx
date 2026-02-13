import { TouchableOpacity, Dimensions } from "react-native";
import { Feather } from "@icons";

const { height: vh } = Dimensions.get("window");

const FloatingAddButton = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={{ bottom: vh * 0.15 }}
            className="bg-btn justify-center items-center absolute right-8 bottom-10 items-center px-7 py-6 rounded-xl"
            onPress={onPress}
        >
            <Feather name="plus" size={35} />
        </TouchableOpacity>
    );
};

export default FloatingAddButton;
