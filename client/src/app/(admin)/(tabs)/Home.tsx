import { ScrollView } from "react-native";

import Header from "@components/common/HomeHeader.jsx";
import AdminOptions from "@components/admin/AdminOptions.tsx";
import TeacherOptions from "@components/teacher/TeacherOptions.tsx";

const Home = () => {
    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 150 }}
            className="bg-primary"
        >
            <Header />
            <AdminOptions />
            <TeacherOptions />
        </ScrollView>
    );
};

export default Home;
