import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import Header from "@components/common/Header.jsx";

const ManageClasses = () => {
    return (
        <View className="pt-12 flex-1">
            <Header title="Manage Class" />
            <View className="pt-10 px-4">
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: "(admin)/(others)/UpdateClass",
                            params: { year: "Third", course: "Bca" }
                        })
                    }
                    className="rounded-3xl bg-white py-8 px-5"
                    style={{ elevation: 10 }}>
                    <Text className="font-bold text-2xl uppercase">Bca</Text>
                    <Text className="font-bold text-2xl ">Third Year</Text>
                    <Text className="font-semibold text-xl mt-5 text-orange-400">
                        strength: 0
                    </Text>
                    <Text className="font-semibold text-xl text-orange-400">
                        in charge: pending
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ManageClasses;
