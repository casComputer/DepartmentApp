import { ScrollView } from "react-native";

import Header from "../../../components/common/HomeHeader";
import TeacherOptions from "../../../components/teacher/TeacherOptions";

const Home = () => {
    return (
        <ScrollView
            className="bg-primary"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, }}
        >
            <Header />
            <TeacherOptions />
        </ScrollView>
    );
};

export default Home;
