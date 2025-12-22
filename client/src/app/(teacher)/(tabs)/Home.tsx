import { ScrollView, View } from "react-native";

import Header from "../../../components/common/HomeHeader";
import TeacherOptions from "../../../components/teacher/TeacherOptions";

const Home = () => {
    return (
        <ScrollView
            className="bg-primary"
            contentContainerStyle={{
                paddingBottom: 150,
                flexGrow: 1
            }}
            showsVerticalScrollIndicator={false}
        >
            <Header />
            <TeacherOptions />
        </ScrollView>
    );
};

export default Home;
