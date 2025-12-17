import { View, Button, ScrollView } from "react-native";
import { MaterialIcons } from "@icons";

import Header from "@components/common/Header.jsx";
import { Avatar } from "@components/common/Profile.jsx";

import { useAppStore } from "@store/app.store.js";

const removeUser = useAppStore.getState().removeUser;

const Profile = () => {
    const fullname = useAppStore(state => state.user?.fullname || "");

    return (
        <ScrollView
            alwaysBounceVertical
            showsVerticalScrollIndicator={false}
            overScrollMode="always"
            contentContainerStyle={{ flexGrow: 1 }}
            className=" bg-primary pb-20"
        >
            <View className="px-4">
                <Header disableBackBtn={true} title={fullname} />
            </View>
            <Avatar />
            <View className="flex-1 items-center justify-center">
                <Button title="logout" onPress={() => removeUser()} />
            </View>
        </ScrollView>
    );
};

export default Profile;
