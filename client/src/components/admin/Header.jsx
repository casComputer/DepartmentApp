import { View, Text, TouchableOpacity } from "react-native";


const Header = ({ title }) => {
    return (
        <TouchableOpacity className="py-5">
            <Text className="text-black text-[10vw] font-bold px-3 transparent">
                Manage Teachers
            </Text>
        </TouchableOpacity>
    );
};

export default Header