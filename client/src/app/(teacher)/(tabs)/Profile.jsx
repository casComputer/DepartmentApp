import {
    View,
    Text,
    Button,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from "react-native";
import { MaterialIcons } from "@icons";

import Header from "@components/common/Header.jsx";

import { handleDocumentPick, handleUpload } from "@utils/file.upload.js";
import { useAppStore } from "@store/app.store.js";

const setGlobalProgress = useAppStore.getState().setGlobalProgress;
const removeUser = useAppStore.getState().removeUser;
const { width: vw } = Dimensions.get("window");

const Avatar = () => {
    const username = useAppStore(state => state.user?.userId || "");

    const handleChangePic = async () => {
        const asset = await handleDocumentPick(["image/*"]); 
        // uri, name, size, mimeType
        if(!asset || !asset.uri ) return
        setGlobalProgress(1);

        const { secure_url, format, public_id } = await handleUpload(
            asset,
            "dp"
            setGlobalProgress
        );
        
        
    };

    return (
        <View className="my-10 justify-center items-center">
            <View className="w-full justify-center items-center">
                <View
                    style={{
                        height: vw * 0.7,
                        width: vw * 0.7
                    }}
                    className="rounded-full"
                >
                    <Image className="bg-card w-full h-full rounded-full" />
                    <TouchableOpacity onPress={handleChangePic} className="p-4 rounded-full bg-btn absolute z-10 -right-2 bottom-[15%]">
                        <MaterialIcons name="edit" size={30} />
                    </TouchableOpacity>
                </View>
                <Text
                    numberOfLines={1}
                    minimumFontScale={0.3}
                    adjustsFontSizeToFit
                    style={{
                        marginTop: -vw * 0.1
                    }}
                    className="w-[85%] text-text-secondary font-bold text-7xl text-center"
                >
                    @{username}
                </Text>
            </View>
        </View>
    );
};

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
