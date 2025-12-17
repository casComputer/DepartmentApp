import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from "@icons";

import { handleDocumentPick, handleUpload } from "@utils/file.upload.js";
import { useAppStore } from "@store/app.store.js";

import { uploadDp } from "@controller/common/profile.controller.js";

const setGlobalProgress = useAppStore.getState().setGlobalProgress;
const setGlobalProgressText = useAppStore.getState().setGlobalProgressText;

const { width: vw } = Dimensions.get("window");
const AVATAR_SIZE = vw * 0.7;

export const Avatar = () => {
    const username = useAppStore(state => state.user?.userId || "");
    const dp = useAppStore(state => state.user?.dp || "");

    const handleChangePic = async () => {
        try {
            const asset = await handleDocumentPick(["image/*"]);
            if (!asset || !asset.uri) return;

            setGlobalProgress(1);

            const { secure_url, public_id } = await handleUpload(asset, "dp");
            if (!secure_url || !public_id) {
                setGlobalProgress(0);
                return null;
            }

            setGlobalProgressText("Updating profile picture...");

            await uploadDp({ secure_url, public_id });
        } finally {
            setGlobalProgress(0);
        }
    };

    return (
        <View className="my-10 justify-center items-center">
            <View className="w-full justify-center items-center">
                <View
                    style={{
                        height: AVATAR_SIZE,
                        width: AVATAR_SIZE,
                        borderRadius: AVATAR_SIZE / 2
                    }}
                    className="bg-card justify-center items-center"
                >
                    {dp ? (
                        <Image
                            source={{ uri: dp }}
                            resizeMode="cover"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: AVATAR_SIZE / 2
                            }}
                        />
                    ) : (
                        <Text
                            allowFontScale={false}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={{ fontSize: vw * 0.4 }}
                            className="w-full text-center px-4 text-text-secondary font-black"
                        >
                            {username[0]}
                        </Text>
                    )}
                    <TouchableOpacity
                        onPress={handleChangePic}
                        className="p-4 rounded-full bg-btn absolute z-10 -right-2 bottom-[15%]"
                    >
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
