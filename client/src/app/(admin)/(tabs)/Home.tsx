import { ScrollView } from "react-native";

import Header from "@components/common/HomeHeader.jsx";
import AdminOptions from "@components/admin/AdminOptions.tsx";
import TeacherOptions from "@components/teacher/TeacherOptions.tsx";

const Home = () => {
    return (
        <ScrollView className="bg-primary" showsVerticalScrollIndicator={false}>
            <Header />
            <AdminOptions />
            <TeacherOptions />
        </ScrollView>
    );
};

export default Home;
