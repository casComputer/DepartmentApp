import { useState, useRef } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate
} from "react-native-reanimated";

import {
    editProfile,
    changePassword
} from "@controller/common/profile.controller.js";
import Header from "@components/common/Header2.jsx";
import { useAppStore } from "@store/app.store.js";

const Field = ({ label, children }) => (
    <View className="gap-1.5">
        <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest pl-1">
            {label}
        </Text>
        {children}
    </View>
);

const SpringButton = ({ onPress, children, className, style }) => {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => {
                scale.value = withSpring(0.96);
            }}
            onPressOut={() => {
                scale.value = withSpring(1);
            }}
        >
            <Animated.View style={[animStyle, style]} className={className}>
                {children}
            </Animated.View>
        </Pressable>
    );
};

const EditProfile = () => {
    const currentFullname = useAppStore(s => s.user.fullname) || "";
    const currentPhone = useAppStore(s => s.user.phone) || "";
    const currentEmail = useAppStore(s => s.user.email) || "";
    const currentAbout = useAppStore(s => s.user.about) || "";

    const [fullname, setFullname] = useState(currentFullname);
    const [phone, setPhone] = useState(currentPhone);
    const [about, setAbout] = useState(currentAbout);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", error: true });

    // Password section
    const [pwOpen, setPwOpen] = useState(false);
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [savingPw, setSavingPw] = useState(false);

    const pwHeight = useSharedValue(0);
    const pwStyle = useAnimatedStyle(() => ({
        height: interpolate(pwHeight.value, [0, 1], [0, 280]),
        opacity: pwHeight.value,
        overflow: "hidden"
    }));

    const togglePw = () => {
        const next = !pwOpen;
        setPwOpen(next);
        pwHeight.value = withTiming(next ? 1 : 0, { duration: 300 });
        if (!next) {
            setCurrentPw("");
            setNewPw("");
            setConfirmPw("");
        }
    };

    const handleSave = async () => {
        if (saving) return;
        setMessage({ text: "", error: true });

        if (fullname.trim() === "") {
            setMessage({ text: "Fullname cannot be empty.", error: true });
            return;
        }
        if (phone.trim() && !/^\+?[1-9]\d{1,14}$/.test(phone.trim())) {
            setMessage({ text: "Invalid phone number format.", error: true });
            return;
        }

        setSaving(true);
        await editProfile({
            fullname: fullname.trim(),
            phone: phone.trim(),
            about: about.trim()
        });
        setSaving(false);
        setMessage({ text: "Profile updated.", error: false });
    };

    const handleChangePassword = async () => {
        if (savingPw) return;
        setMessage({ text: "", error: true });

        if (!currentPw || !newPw || !confirmPw) {
            setMessage({
                text: "All password fields are required.",
                error: true
            });
            return;
        }
        if (newPw.length < 8) {
            setMessage({
                text: "New password must be at least 8 characters.",
                error: true
            });
            return;
        }
        if (newPw !== confirmPw) {
            setMessage({ text: "Passwords do not match.", error: true });
            return;
        }

        setSavingPw(true);
        const { message, success } = await changePassword({
            currentPassword: currentPw,
            newPassword: newPw
        });

        setSavingPw(false);
        if (success) {
            setMessage({
                text: "Password changed successfully.",
                error: false
            });
            setCurrentPw("");
            setNewPw("");
            setConfirmPw("");
            togglePw();
        } else {
            setMessage({
                text: message ?? "Password changed failed.",
                error: true
            });
        }
    };

    const inputClass =
        "bg-card border border-border px-4 py-4 rounded-xl text-text font-semibold text-base";

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="bg-primary"
            showsVerticalScrollIndicator={false}
        >
            <Header onSave={handleSave} saving={saving} />

            <View className="px-4 gap-5 mt-4">
                {/* Profile fields */}
                <Field label="Full Name">
                    <TextInput
                        className={inputClass}
                        placeholder="Full name"
                        placeholderTextColor="#888"
                        returnKeyType="next"
                        value={fullname}
                        onChangeText={setFullname}
                    />
                </Field>

                <Field label="Phone">
                    <TextInput
                        className={inputClass}
                        placeholder="Phone number"
                        placeholderTextColor="#888"
                        keyboardType="phone-pad"
                        returnKeyType="next"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </Field>

                <Field label="Email">
                    <TextInput
                        className={`${inputClass} opacity-50`}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={currentEmail}
                        editable={false}
                    />
                </Field>

                <Field label="About">
                    <TextInput
                        className={`${inputClass} h-28`}
                        placeholder="About you"
                        placeholderTextColor="#888"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={about}
                        onChangeText={setAbout}
                    />
                </Field>

                {/* Divider */}
                <View className="h-px bg-border" />

                {/* Change Password toggle */}
                <SpringButton
                    onPress={togglePw}
                    className="border border-border bg-card rounded-xl px-4 py-4 flex-row items-center justify-between"
                >
                    <View className="flex-row items-center gap-3">
                        <Text className="text-lg">🔑</Text>
                        <Text className="text-text font-bold text-base">
                            Change Password
                        </Text>
                    </View>
                    <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest">
                        {pwOpen ? "Cancel" : "Update"}
                    </Text>
                </SpringButton>

                {/* Collapsible password section */}
                <Animated.View style={pwStyle}>
                    <View className="gap-3 pb-2">
                        <TextInput
                            className={inputClass}
                            placeholder="Current password"
                            placeholderTextColor="#888"
                            secureTextEntry
                            returnKeyType="next"
                            value={currentPw}
                            onChangeText={setCurrentPw}
                        />
                        <TextInput
                            className={inputClass}
                            placeholder="New password"
                            placeholderTextColor="#888"
                            secureTextEntry
                            returnKeyType="next"
                            value={newPw}
                            onChangeText={setNewPw}
                        />
                        <TextInput
                            className={inputClass}
                            placeholder="Confirm new password"
                            placeholderTextColor="#888"
                            secureTextEntry
                            returnKeyType="done"
                            value={confirmPw}
                            onChangeText={setConfirmPw}
                        />

                        <SpringButton
                            onPress={handleChangePassword}
                            className="bg-btn rounded-xl px-4 py-4 items-center"
                        >
                            <Text className="text-white font-black text-base">
                                {savingPw
                                    ? "Saving…"
                                    : "Confirm Password Change"}
                            </Text>
                        </SpringButton>
                    </View>
                </Animated.View>

                {/* Message */}
                {message.text ? (
                    <View className="py-1 items-center">
                        <Text
                            className={`text-sm font-semibold ${
                                message.error
                                    ? "text-red-500"
                                    : "text-green-500"
                            }`}
                        >
                            {message.text}
                        </Text>
                    </View>
                ) : null}

                <View className="h-8" />
            </View>
        </KeyboardAwareScrollView>
    );
};

export default EditProfile;
