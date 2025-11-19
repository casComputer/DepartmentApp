import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import Header from "@components/common/Header";
import Select from "@/components/common/Select";

import { CLASS, COURSES } from "@constants/ClassAndCourses";

const Attendance = () => {
	const [selectedClass, setSelectedClass] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState(null);

	const handleProceed = () => {
		if (selectedClass && selectedCourse) {
			router.push({
				pathname: '/(teacher)/(others)/Attendance',
				params: {
					class: selectedClass,
					course: selectedCourse
				}	
			});
		}
	};

	return (
		<View className="flex-1 pt-12">
			<Header title="Attendance" />
			<View className="px-5 mt-5">
				<Select
					title="Year"
					options={CLASS}
					select={setSelectedClass}
					selected={selectedClass}
				/>
				<Select
					title="Class"
					options={COURSES}
					select={setSelectedCourse}
					selected={selectedCourse}
				/>
			</View>

			<TouchableOpacity onPress={handleProceed} className="mt-3 rounded-3xl p-6 justify-center items-center">
				<Text className="text-[6vw] font-black">Proceed</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Attendance;
