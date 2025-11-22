import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const ICONS_SIZE = 40;

const TeacherOptions = () => {
	return (
		<View className="px-3 mt-12 flex-1 gap-3">
			{/* First Row of Options */}

			<TouchableOpacity onPress={()=> router.push('/(teacher)/(others)/ManageStudents')} className="flex-row items-center gap-4 px-6 py-7 border-b border-gray-200 shadow bg-white w-full rounded-3xl overflow-hidden">
				<MaterialCommunityIcons
					name="account-group-outline"
					size={ICONS_SIZE}
					color="#4B5563"
				/>  
				<Text className="font-bold text-xl text-gray-700 ">
					Manage Students
				</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={()=> router.push("/(teacher)/(others)/AttendanceClassSelect" as any)} className="flex-row items-center gap-4 px-6 py-7 border-b border-gray-200 shadow bg-white w-full rounded-3xl overflow-hidden">
				<FontAwesome5
					name="clipboard-list"
					size={ICONS_SIZE}
					color="#4B5563"
				/>
				<Text className="font-bold text-xl text-gray-700 ">
					Attendance
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default TeacherOptions;
