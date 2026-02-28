import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
    Image,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const icons = {
    graduate: require("../../../assets/images/icons/graduate.png"),
    teacher: require("../../../assets/images/icons/teacher.png"),
    parent: require("../../../assets/images/icons/parent.png")
};

const Button = ({ icon, text, role }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                router.push({
                    pathname: "/auth/GuideLine",
                    params: { userRole: role }
                });
            }}
            className={`overflow-hidden h-26  rounded-3xl min-w-[43%] flex-row items-center ${
                role === "parent" ? "w-[50%]" : "flex-1"
            }`}>
            <BlurView
                intensity={60}
                tint="dark"
                blurMethod='dimezisBlurView'
                className="w-full h-full flex-row items-center justify-center px-5 gap-2">
                <Image
                    source={icons[icon]}
                    resizeMode="contain"
                    className={`${
                        role === "parent" ? "w-[20%]" : "w-[25%]"
                    } h-full`}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="flex-1 font-bold text-md text-center text-text ">
                    {text}
                </Text>
            </BlurView>
        </TouchableOpacity>
    );
};

const Middle = () => {
    return (
        <View className="gap-3 w-full h-fit px-3 flex-row flex-wrap justify-center items-center mt-20">
            <Button text="Iam A Student" icon="graduate" role="student" />
            <Button text="Iam A Teacher" icon="teacher" role="teacher" />
            <Button text="Iam A Parent" icon="parent" role="parent" />
        </View>
    );
};

export default Middle;
