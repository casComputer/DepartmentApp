import { View, Text } from 'react-native';
import Feather from "@expo/vector-icons/Feather";

const InfoBox = ({ text }) => (
    <View className="bg-orange-400 w-full rounded-xl mt-8 py-6 flex-row justify-center items-center gap-3">
        <Feather name="info" size={24} color="white" />
        <Text className="font-semibold text-md max-w-[85%] text-white">
            {text}
        </Text>
    </View>
)

export default InfoBox;