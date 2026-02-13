import { useState } from "react";
import { View, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";

import Header from "@components/profile/ProfileHeader.jsx";
import {
    Avatar,
    EditDpOptions
} from "@components/profile/ProfileComponents.jsx";
import { TeacherOptions } from "@components/profile/TeacherOptions.jsx";
import ParentExtra from "@components/profile/ParentExtra.jsx";

import { handleDocumentPick, handleUpload } from "@utils/file.upload.js";
import { uploadDp } from "@controller/common/profile.controller.js";

import { useAppStore } from "@store/app.store.js";

const setGlobalProgress = useAppStore.getState().setGlobalProgress;
const setGlobalProgressText = useAppStore.getState().setGlobalProgressText;

const Profile = () => {
    const [showDpOptions, setDpOptions] = useState(false);
    const role = useAppStore(state => state.user?.role || "");

    const fullname = useAppStore(state => state.user?.fullname || "");

    const handleChangePic = async () => {
        setDpOptions(false);
        const asset = await handleDocumentPick(["image/*"]);
        if (!asset || !asset.uri) return;

        setGlobalProgress(1);

        const { secure_url, public_id } = await handleUpload(asset, "dp");
        if (!secure_url || !public_id) {
            setGlobalProgress(0);
            return null;
        }

        setGlobalProgressText("Updating profile picture...");

        await uploadDp({
            secure_url,
            public_id
        });

        setGlobalProgress(0);
    };

    return (
        <View className="flex-1 bg-primary relative">
            <ScrollView
                alwaysBounceVertical
                showsVerticalScrollIndicator={false}
                overScrollMode="always"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
                onTouchStart={() => setDpOptions(false)}
            >
                <View className="px-4">
                    <Header disableBackBtn={true} title={fullname} />
                </View>

                <Avatar
                    handleChangePic={handleChangePic}
                    handleEdit={() =>
                        setDpOptions(prev => {
                            if (!prev)
                                Haptics.impactAsync(
                                    Haptics.ImpactFeedbackStyle.Light
                                );
                            return !prev;
                        })
                    }
                />
                {(role === "teacher" || role === "admin") && <TeacherOptions />}
                {role === "parent" && <ParentExtra />}
            </ScrollView>

            <EditDpOptions
                handleChangePic={handleChangePic}
                show={showDpOptions}
            />
        </View>
    );
};

export default Profile;
