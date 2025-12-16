import { TouchableOpacity } from "react-native";
import { Feather } from "@icons";

const FloatingAddButton = ({ onPress, style }) => {
    return (
        <TouchableOpacity
            style={style}
            className=" p-4 rounded-full bg-pink-500 absolute right-5 bottom-10 justify-center items-center"
            onPress={onPress}
        >
            <Feather name="plus" size={30} className="dark:text-white" />
        </TouchableOpacity>
    );
};

export default FloatingAddButton;
