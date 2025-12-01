import { View, Text, TouchableOpacity } from "react-native";
import {
    AntDesign,
    Entypo,
    Feather,
    FontAwesome,
    FontAwesome6,
    MaterialCommunityIcons,
    SimpleLineIcons
} from "@icons";
import { router } from "expo-router";

const ICONS_SIZE = 40;

const StudentOptions = () => {
    
    return (
        <View className="px-6 mt-12 flex-1">
            <View
                style={{ elevation: 3, shadowColor: "black" }}
                className=" bg-white w-full rounded-3xl gap-3 overflow-hidden py-3 dark:bg-zinc-900">
                {/* First Row of Options */}
                <View className="flex-row justify-between">
                    <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1 ">
                        <MaterialCommunityIcons
                            name="chat-question"
                            size={ICONS_SIZE}
                        />

                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-lg font-semibold dark:text-white">
                            Ask Leave
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/(student)/(others)/MonthlyReport")                        }
                        className="p-4 justify-center items-center gap-2 flex-1 ">
                        <SimpleLineIcons
                            name="note"
                            size={ICONS_SIZE}
                            
                        />

                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-lg font-semibold dark:text-white">
                            Attendence
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1 ">
                        <SimpleLineIcons
                            name="notebook"
                            size={ICONS_SIZE}
                            
                        />

                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-lg font-semibold dark:text-white">
                            Assignment
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Second Row of Options */}

                <View className="flex-row justify-between">
                    <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
                        <FontAwesome6
                            name="hand-holding-dollar"
                            size={ICONS_SIZE}
                            
                        />

                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-lg font-semibold dark:text-white">
                            Fees
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
                        <AntDesign
                            name="file-search"
                            size={ICONS_SIZE}
                            
                        />

                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-lg font-semibold dark:text-white">
                            Exam Results
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
                        <AntDesign
                            name="message"
                            size={ICONS_SIZE}
                            
                        />

                        <Text className="text-lg font-semibold dark:text-white">
                            Chat
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Third Row of Options */}
                <View className="flex-row justify-between">
                    <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
                        <Entypo
                            name="book"
                            size={ICONS_SIZE}
                            
                        />
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-lg font-semibold dark:text-white">
                            Notes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
                        <Feather
                            name="check-circle"
                            size={ICONS_SIZE}
                            
                        />

                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-lg font-semibold dark:text-white">
                            Internal Marks
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
                        <FontAwesome
                            name="graduation-cap"
                            size={ICONS_SIZE}
                            
                        />

                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            className="text-lg font-semibold dark:text-white">
                            Course
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default StudentOptions;
