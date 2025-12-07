import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Header from "@components/common/HomeHeader.jsx";
import TodaysMiniAttentdenceCard from "@components/student/home/TodaysMiniAttentdenceCard";
import MonthlyAttendenceMiniReport from "@components/student/home/MonthlyAttendenceMiniReport";
import StudentOptions from "@components/student/home/StudentOptions";

import { useThemeStore } from "@store/app.store.js";

const Home = () => {
  const gradientColors = useThemeStore((state) => state.gradientColors);

  return (
    <LinearGradient colors={gradientColors} className="flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 150,
          flexGrow: 1,
        }}
        showVerticalIndicator={false}
        className="dark:bg-black"
      >
        <Header />
        <TodaysMiniAttentdenceCard />
        <MonthlyAttendenceMiniReport />
        <StudentOptions />
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;
