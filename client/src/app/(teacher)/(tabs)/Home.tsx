import { ScrollView, View } from "react-native";
import React from "react";

import Header from "../../../components/common/HomeHeader";
import TeacherOptions from "../../../components/teacher/TeacherOptions";

const Home = () => {
    return (
        <ScrollView
            className="bg-white dark:bg-black"
            contentContainerStyle={{
                paddingBottom: 150,
                flexGrow: 1
            }}>
            <Header />
            <TeacherOptions />
        </ScrollView>
    );
};

export default Home;
