import React from "react";
import { ScrollView, View } from "react-native";

import Header from "@components/common/HomeHeader";
import ParentOptions from "@components/parent/ParentOptions";
import TodaysMiniAttentdenceCard from "@components/student/home/TodaysMiniAttentdenceCard";
import MonthlyAttendenceMiniReport from "@components/student/home/MonthlyAttendenceMiniReport";

const Home = () => {
    return (
        <ScrollView
            className="bg-primary"
            contentContainerStyle={{
                paddingBottom: 150,
                flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
        >
            <Header />
            <TodaysMiniAttentdenceCard />
            <MonthlyAttendenceMiniReport />
        </ScrollView>
    );
};

export default Home;
