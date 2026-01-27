import { View } from "react-native";

import Header from "../../../components/common/HomeHeader";
import TeacherOptions from "../../../components/teacher/TeacherOptions";

const Home = () => {
    return (
        <View className="bg-primary flex-1">
            <Header />
            <TeacherOptions />
        </View>
    );
};

export default Home;
