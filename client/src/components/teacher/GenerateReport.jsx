import { View, Text, TouchableOpacity } from "react-native";
import { Octicons, FontAwesome } from "@icons";

import Toggle from "@components/common/Toggle";

export const ReportFileItem = ({
    icon,
    filename,
    exists,
    onDownload,
    onOpen,
    onShare
}) => (
    <View className="flex-row items-center justify-between py-3 px-4">
        <View className="flex-row items-center w-[75%]">
            {icon}
            <Text
                numberOfLines={2}
                adjustsFontSizeToFit
                className="w-[85%] text-text font-bold pl-3"
            >
                {filename}
            </Text>
        </View>

        {!exists ? (
            <TouchableOpacity onPress={onDownload}>
                <Octicons name="download" size={24} />
            </TouchableOpacity>
        ) : (
            <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={onShare}>
                    <Text className="text-green-500 text-lg font-bold">
                        Share
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onOpen}>
                    <Text className="text-blue-500 text-lg font-bold">
                        Open
                    </Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
);

export const Selector = ({
    toggler,
    setToggler,
    dateText,
    onSinglePress,
    onStartPress,
    onEndPress
}) => (
    <View className="px-3">
        <Toggle text1={"month"} text2={"sem"} onChange={setToggler} />

        <Text className="text-xl font-black mt-3 px-4 text-center text-text-secondary">
            GENERATE ATTENDANCE REPORT FOR {dateText}
        </Text>

        {toggler === 0 ? (
            <TouchableOpacity onPress={onSinglePress}>
                <Text className="text-xl font-bold text-center text-blue-500">
                    Change Month
                </Text>
            </TouchableOpacity>
        ) : (
            <View className="flex-row items-center justify-center gap-15">
                <TouchableOpacity onPress={onStartPress}>
                    <Text className="text-xl font-bold text-blue-500">
                        Start Month
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onEndPress}>
                    <Text className="text-xl font-bold text-blue-500">
                        End Month
                    </Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
);
