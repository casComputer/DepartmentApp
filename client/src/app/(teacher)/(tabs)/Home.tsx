import { ScrollView } from "react-native";
import React from "react";

import Header from "../../../components/common/HomeHeader";
import TeacherOptions from "../../../components/teacher/TeacherOptions";

const Home = () => {
	return (
		<ScrollView
			contentContainerStyle={{ paddingTop: 60, paddingBottom: 150, flexGrow: 1 , backgroundColor: '#fff'}}>
			<Header />
			<TeacherOptions />
		</ScrollView>
	);
};

export default Home;
