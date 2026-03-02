import { ScrollView } from "react-native";

import Header from "@components/common/HomeHeader.jsx";
import TodaysMiniAttentdenceCard from "@components/student/home/TodaysMiniAttentdenceCard";
import MonthlyAttendenceMiniReport from "@components/student/home/MonthlyAttendenceMiniReport";
import StudentOptions from "@components/student/home/StudentOptions";

const Home = () => {
    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1
            }}
            showsVerticalScrollIndicator={false}
            className="bg-primary"
        >
            <Header />
            <TodaysMiniAttentdenceCard />
            <MonthlyAttendenceMiniReport />
            <StudentOptions />
        </ScrollView>
    );
};

export default Home;
