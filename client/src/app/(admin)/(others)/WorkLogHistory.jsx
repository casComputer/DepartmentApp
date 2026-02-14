import { View, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";

import Header from "@components/common/Header.jsx";
import UserItem from "@components/common/UserItem.jsx";

import { fetchTeachers } from "@controller/admin/teachers.controller.js";
import { router } from "expo-router";

const WorkLogHistory = () => {
	const { data: teachers, isLoading } = useQuery({
		queryKey: ["teachers"],
		queryFn: () => fetchTeachers(),
	});

	return (
		<View className="flex-1 bg-primary">
			<Header title={"History"} />

			<FlashList
				data={teachers ?? []}
				renderItem={({ item }) => (
					<UserItem
						item={item}
						showVerification={false}
						handlePress={() =>
							router.push({
								pathname: "/(admin)/(others)/WorkLogDetails",
								params: { teacherId: item.userId },
							})
						}
					/>
				)}
				className="pt-16"
				contentContainerStyle={{ padding: 10, paddingBottom: 70 }}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={isLoading && <ActivityIndicator size='large' />}
			/>
		</View>
	);
};

export default WorkLogHistory;
