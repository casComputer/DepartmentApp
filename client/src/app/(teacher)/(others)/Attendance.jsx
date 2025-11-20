import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import Header from "@components/common/Header";

const Attendance = () => {
	const [width, setWidth] = useState();

	return (
		<View className="flex-1 pt-12">
			<Header title="Attendance" />
			<ScrollView className="px-5 mt-10">
				<View
					onLayout={(event) => {
						const { width } = event.nativeEvent.layout;
						setWidth((width - 50) / 5);
					}}
					style={{ gap: 10 }}
					className="flex-row justify-between">
                        
					<TouchableOpacity
						style={{ width: width, height: width }}
						className=" border-2 rounded-full justify-center items-center">
						<Text className="text-[6vw] font-black">1</Text>
					</TouchableOpacity>
					
				</View>
			</ScrollView>
		</View>
	);
};

export default Attendance;
