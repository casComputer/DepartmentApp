import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../../components/home/Header";
import TodaysMiniAttentdenceCard from "../../components/home/TodaysMiniAttentdenceCard";
import MonthlyAttendenceMiniReport from "../../components/home/MonthlyAttendenceMiniReport";
import StudentOptions from "../../components/home/StudentOptions";

const Home = () => {
  return (
    <View className="flex-1 pt-12">
      <Header />
      <TodaysMiniAttentdenceCard />
      <MonthlyAttendenceMiniReport />
      <StudentOptions />
    </View>
  );
};

export default Home;
