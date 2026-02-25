import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator,
    StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { generateOtp, verifyOtp } from "@controller/common/email.controller.js";

const CODE_LENGTH = 6;

/* ─── Code Box ──────────────────────────────────────────────── */
function CodeBox({ char, focused }) {
    return (
        <View
            className={`
        flex-1 aspect-square rounded-xl border items-center justify-center
        ${
            focused && !char
                ? "border-btn bg-card-selected"
                : char
                  ? "border-btn bg-card-selected"
                  : "border-border bg-card"
        }
      `}
        >
            {char ? (
                <Text className="self-center text-text text-xl font-bold font-mono w-full my-auto text-center">
                    {char}
                </Text>
            ) : null}
        </View>
    );
}

/* ─── Step Indicator ────────────────────────────────────────── */
function StepIndicator({ current }) {
    const steps = ["Email", "Verify"];
    return (
        <View className="flex-row items-center mb-8">
            {steps.map((label, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <React.Fragment key={label}>
                        <View className="items-center">
                            <View
                                className={`
                  w-8 h-8 rounded-full items-center justify-center border
                  ${
                      done
                          ? "bg-btn border-btn"
                          : active
                            ? "bg-card-selected border-btn"
                            : "bg-card border-border"
                  }
                `}
                            >
                                {done ? (
                                    <Ionicons
                                        name="checkmark"
                                        size={14}
                                        color="white"
                                    />
                                ) : (
                                    <Text
                                        className={`text-xs font-semibold ${active ? "text-btn" : "text-text-secondary"}`}
                                    >
                                        {i + 1}
                                    </Text>
                                )}
                            </View>
                            <Text
                                className={`text-xs mt-1.5 ${active ? "text-text font-medium" : "text-text-secondary"}`}
                            >
                                {label}
                            </Text>
                        </View>
                        {i < steps.length - 1 && (
                            <View
                                className={`flex-1 h-px mx-3 mb-5 ${done ? "bg-btn" : "bg-border"}`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

/* ─── Divider ───────────────────────────────────────────────── */
function Divider({ label }) {
    return (
        <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-border" />
            {label && (
                <Text className="mx-3 text-xs text-text-secondary uppercase tracking-widest">
                    {label}
                </Text>
            )}
            <View className="flex-1 h-px bg-border" />
        </View>
    );
}

/* ─── Field Label ───────────────────────────────────────────── */
function FieldLabel({ children }) {
    return (
        <Text className="text-xs text-text-secondary uppercase tracking-widest mb-2 font-medium">
            {children}
        </Text>
    );
}

/* ─── Main Screen ───────────────────────────────────────────── */
export default function EmailVerificationScreen({ navigation }) {
    const [step, setStep] = useState(0); // 0=email 1=code 2=done
    const [email, setEmail] = useState("");
    const [emailFocus, setEmailFocus] = useState(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [codeError, setCodeError] = useState("");

    const codeInputRef = useRef(null);

    const focusedIdx = Math.min(code.length, CODE_LENGTH - 1);
    const codeChars = code
        .split("")
        .concat(Array(CODE_LENGTH).fill(""))
        .slice(0, CODE_LENGTH);

    /* ── Validate & submit email ── */
    const handleEmailSubmit = async () => {
        const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!rx.test(email.trim())) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        setEmailError("");
        setLoading(true);
        await generateOtp(email);
        setLoading(false);
        setStep(1);
    };

    /* ── Validate & submit code ── */
    const handleCodeSubmit = async () => {
        if (code.length < CODE_LENGTH) {
            setCodeError("Enter all 6 digits to continue.");
            return;
        }
        setCodeError("");
        setLoading(true);
        await verifyOtp(code);
        setLoading(false);
        setStep(2);
    };

    return (
        <View className="flex-1 bg-primary">
            <StatusBar barStyle="dark-content" />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    className="flex-1"
                >
                    <View className="flex-1 px-6 pt-2 pb-10">
                        {/* ── Brand mark ── */}
                        <View className="mb-10">
                            <View className="flex-row items-center gap-3 mb-1">
                                <View className="w-8 h-8 rounded-md bg-btn items-center justify-center">
                                    <Ionicons
                                        name="shield-checkmark"
                                        size={16}
                                        color="white"
                                    />
                                </View>
                                <Text className="text-text text-lg font-bold tracking-wide">
                                    DC-Connect
                                </Text>
                            </View>
                            <Text className="text-text-secondary text-xs tracking-widest uppercase pl-11">
                                Identity Verification
                            </Text>
                        </View>

                        {/* ── Done state ── */}
                        {step === 2 ? (
                            <View className="flex-1 justify-center items-center">
                                <View className="w-16 h-16 rounded-full bg-card-selected border border-btn items-center justify-center mb-6">
                                    <Ionicons
                                        name="checkmark-done"
                                        size={28}
                                        color="#22c55e"
                                    />
                                </View>
                                <Text className="text-text text-2xl font-bold mb-2">
                                    Identity Confirmed
                                </Text>
                                <Text className="text-text-secondary text-sm text-center leading-5 mb-10 max-w-xs">
                                    Your email has been verified successfully.
                                    You're all set to use DC-Connect.
                                </Text>
                                <TouchableOpacity
                                    className="w-full bg-btn rounded-xl py-4 items-center"
                                    onPress={() => navigation?.navigate("Home")}
                                >
                                    <Text className="text-white font-semibold text-sm tracking-wide">
                                        Continue to App
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                {/* ── Step indicator ── */}
                                <StepIndicator current={step} />

                                {/* ── Card ── */}
                                <View className="bg-card rounded-2xl border border-border p-6">
                                    {/* ─ Email step ─ */}
                                    {step === 0 && (
                                        <>
                                            <Text className="text-text text-xl font-bold mb-1">
                                                Enter your email
                                            </Text>
                                            <Text className="text-text-secondary text-sm leading-5 mb-6">
                                                We'll send a one-time
                                                verification code to confirm
                                                your identity.
                                            </Text>

                                            <Divider label="Account Details" />

                                            <FieldLabel>
                                                Email address
                                            </FieldLabel>
                                            <View
                                                className={`
                          flex-row items-center bg-primary border rounded-xl px-4 h-12 mb-1
                          ${emailFocus ? "border-btn" : emailError ? "border-red-500" : "border-border"}
                        `}
                                            >
                                                <Ionicons
                                                    name="mail-outline"
                                                    size={16}
                                                    className="mr-3"
                                                    color={
                                                        emailFocus
                                                            ? "#3b82f6"
                                                            : "#94a3b8"
                                                    }
                                                />
                                                <TextInput
                                                    className="flex-1 text-text text-sm ml-2"
                                                    placeholder="you@example.com"
                                                    placeholderTextColor="#94a3b8"
                                                    value={email}
                                                    onChangeText={t => {
                                                        setEmail(t);
                                                        setEmailError("");
                                                    }}
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    returnKeyType="send"
                                                    onFocus={() =>
                                                        setEmailFocus(true)
                                                    }
                                                    onBlur={() =>
                                                        setEmailFocus(false)
                                                    }
                                                    onSubmitEditing={
                                                        handleEmailSubmit
                                                    }
                                                />
                                            </View>

                                            {emailError ? (
                                                <View className="flex-row items-center gap-1 mt-2 mb-4">
                                                    <Ionicons
                                                        name="alert-circle-outline"
                                                        size={13}
                                                        color="#ef4444"
                                                    />
                                                    <Text className="text-red-500 text-xs">
                                                        {emailError}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text className="text-text-secondary text-xs mt-2 mb-4">
                                                    Use the email registered to
                                                    your DC-Connect account.
                                                </Text>
                                            )}

                                            <TouchableOpacity
                                                className={`rounded-xl py-3.5 items-center flex-row justify-center gap-2 ${loading ? "bg-card-selected" : "bg-btn"}`}
                                                onPress={handleEmailSubmit}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator
                                                        size="small"
                                                        color="#64748b"
                                                    />
                                                ) : (
                                                    <>
                                                        <Text className="text-white font-semibold text-sm tracking-wide">
                                                            Send Verification
                                                            Code
                                                        </Text>
                                                        <Ionicons
                                                            name="arrow-forward"
                                                            size={15}
                                                            color="white"
                                                        />
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    {/* ─ Code step ─ */}
                                    {step === 1 && (
                                        <>
                                            <TouchableOpacity
                                                className="flex-row items-center gap-1 mb-4"
                                                onPress={() => {
                                                    setStep(0);
                                                    setCode("");
                                                    setCodeError("");
                                                }}
                                            >
                                                <Ionicons
                                                    name="chevron-back"
                                                    size={14}
                                                    color="#64748b"
                                                />
                                                <Text className="text-text-secondary text-xs font-medium">
                                                    Change email
                                                </Text>
                                            </TouchableOpacity>

                                            <Text className="text-text text-xl font-bold mb-1">
                                                Check your inbox
                                            </Text>
                                            <Text className="text-text-secondary text-sm leading-5 mb-1">
                                                A 6-digit code was sent to
                                            </Text>
                                            <View className="flex-row items-center gap-1.5 mb-6">
                                                <Ionicons
                                                    name="mail"
                                                    size={13}
                                                    color="#64748b"
                                                />
                                                <Text className="text-text text-sm font-medium">
                                                    {email}
                                                </Text>
                                            </View>

                                            <Divider label="Enter Code" />

                                            <FieldLabel>
                                                Verification code
                                            </FieldLabel>

                                            {/* Hidden real input */}
                                            <TextInput
                                                ref={codeInputRef}
                                                style={{
                                                    position: "absolute",
                                                    opacity: 0,
                                                    width: 0,
                                                    height: 0
                                                }}
                                                value={code}
                                                onChangeText={t => {
                                                    setCode(
                                                        t
                                                            .replace(/\D/g, "")
                                                            .slice(
                                                                0,
                                                                CODE_LENGTH
                                                            )
                                                    );
                                                    setCodeError("");
                                                }}
                                                keyboardType="number-pad"
                                                maxLength={CODE_LENGTH}
                                                autoFocus
                                            />

                                            {/* Visual boxes */}
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() =>
                                                    codeInputRef.current?.focus()
                                                }
                                                className="flex-row gap-2 mb-2"
                                            >
                                                {codeChars.map((ch, i) => (
                                                    <CodeBox
                                                        key={i}
                                                        char={ch}
                                                        focused={
                                                            i === focusedIdx &&
                                                            code.length <
                                                                CODE_LENGTH
                                                        }
                                                    />
                                                ))}
                                            </TouchableOpacity>

                                            {codeError ? (
                                                <View className="flex-row items-center gap-1 mt-2 mb-4">
                                                    <Ionicons
                                                        name="alert-circle-outline"
                                                        size={13}
                                                        color="#ef4444"
                                                    />
                                                    <Text className="text-red-500 text-xs">
                                                        {codeError}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text className="text-text-secondary text-xs mt-2 mb-4">
                                                    The code expires in 10
                                                    minutes. Check your spam
                                                    folder if needed.
                                                </Text>
                                            )}

                                            <TouchableOpacity
                                                className={`rounded-xl py-3.5 items-center flex-row justify-center gap-2 ${loading ? "bg-card-selected" : "bg-btn"}`}
                                                onPress={handleCodeSubmit}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator
                                                        size="small"
                                                        color="#64748b"
                                                    />
                                                ) : (
                                                    <>
                                                        <Text className="text-white font-semibold text-sm tracking-wide">
                                                            Verify Identity
                                                        </Text>
                                                        <Ionicons
                                                            name="shield-checkmark-outline"
                                                            size={15}
                                                            color="white"
                                                        />
                                                    </>
                                                )}
                                            </TouchableOpacity>

                                            <TouchableOpacity className="mt-5 items-center">
                                                <Text className="text-text-secondary text-xs">
                                                    Didn't receive it?{" "}
                                                    <Text className="text-btn font-semibold">
                                                        Resend code
                                                    </Text>
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
