import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";

import Header from "@components/student/home/Header";
import TodaysMiniAttentdenceCard from "@components/student/home/TodaysMiniAttentdenceCard";
import MonthlyAttendenceMiniReport from "@components/student/home/MonthlyAttendenceMiniReport";
import StudentOptions from "@components/student/home/StudentOptions";

const Home = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingTop: 60, paddingBottom: 150 }} >
      <Header />
      <TodaysMiniAttentdenceCard />
      <MonthlyAttendenceMiniReport />
      <StudentOptions />


    </ScrollView>
  );
};

export default Home;
