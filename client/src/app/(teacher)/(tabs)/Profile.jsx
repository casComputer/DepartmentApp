import { useState } from "react";
import { View, Button, ScrollView } from "react-native";
import { MaterialIcons } from "@icons";

import Header from "@components/common/Header.jsx";
import { Avatar, EditDpOptions } from "@components/common/Profile.jsx";

import { handleDocumentPick, handleUpload } from "@utils/file.upload.js";
import { uploadDp } from "@controller/common/profile.controller.js";

import { useAppStore } from "@store/app.store.js";

const removeUser = useAppStore.getState().removeUser;
const setGlobalProgress = useAppStore.getState().setGlobalProgress;
const setGlobalProgressText = useAppStore.getState().setGlobalProgressText;

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

const Profile = () => {
    const [showDpOptions, setDpOptions] = useState(false);
    const fullname = useAppStore(state => state.user?.fullname || "");

    return (
        <View className="flex-1 bg-primary">
            <ScrollView
                alwaysBounceVertical
                showsVerticalScrollIndicator={false}
                overScrollMode="always"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
            >
                <View className="px-4">
                    <Header disableBackBtn={true} title={fullname} />
                </View>

                <Avatar
                    handleChangePic={handleChangePic}
                    handleEdit={() => setDpOptions(prev => !prev)}
                />

                <View className="flex-1 items-center justify-end">
                    <Button title="logout" onPress={() => removeUser()} />
                </View>
            </ScrollView>

            <EditDpOptions
                handleChangePic={handleChangePic}
                show={showDpOptions}
            />
        </View>
    );
};

export default Profile;
