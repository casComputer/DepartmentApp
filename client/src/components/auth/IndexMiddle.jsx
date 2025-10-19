import { router } from "expo-router";
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    Animated,
    useColorScheme
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { useAppStore } from "../../store/app.store";

const setUserRole = useAppStore.getState().setUserRole;

const icons = {
    graduate: require("../../../assets/images/icons/graduate.png"),
    teacher: require("../../../assets/images/icons/teacher.png"),
    parent: require("../../../assets/images/icons/parent.png")
};

const Button = ({ icon, text, role }) => {
    const theme = useColorScheme();

    return (
        <TouchableOpacity
            onPress={() => {
                setUserRole(role);
                router.push("/auth/Signup");
            }}
            className={`overflow-hidden h-32 rounded-3xl min-w-[43%] flex-row items-center gap-3 ${
                role === "parent" ? "w-[50%]" : "flex-1"
            }`}
        >
            {theme === "dark" ? (
                <BlurView intensity={20}
                    tint="light"
                    className="w-full h-full overflow-hidden flex-row items-center gap-3"
                >
                    <Image
                        source={icons[icon]}
                        resizeMode="contain"
                        className={`${
                            role === "parent" ? "w-[25%] ml-5" : "w-[30%]"
                        } h-full ml-3`}
                    />
                    <Text className="font-bold text-xl text-center text-white">
                        {text}
                    </Text>
                </BlurView>
            ) : (
                <LinearGradient
                    colors={[
                        "rgb(7,185,144)",
                        "rgba(46,217,177,1)",
                        "rgba(46,217,177,0.8)"
                    ]}
                    
                    className="w-full h-full absolute top-0 left-0 overflow-hidden flex-row items-center gap-3"
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <Image
                        source={icons[icon]}
                        resizeMode="contain"
                        className={`${
                            role === "parent" ? "w-[25%] ml-5" : "w-[30%]"
                        } h-full ml-3`}
                    />
                    <Text className="font-bold text-xl text-center text-white">
                        {text}
                    </Text>
                </LinearGradient>
            )}
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
