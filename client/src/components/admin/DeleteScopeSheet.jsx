import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";

import { YEAR, COURSES } from "@constants/ClassAndCourses";

const Pill = ({ label, active, onPress }) => (
    <TouchableOpacity
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }}
        className={`px-4 py-2.5 rounded-full border ${
            active ? "bg-btn border-btn" : "bg-card border-border"
        }`}
    >
        <Text
            className={`text-sm font-bold capitalize ${active ? "text-text" : "text-text opacity-70"}`}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

const formatDate = date =>
    date
        ? date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit"
          })
        : null;

// target: { id, label, scopes: ["class" | "course" | "date", ...] }
const DeleteScopeSheet = ({ visible, target, onClose, onContinue }) => {
    const [course, setCourse] = useState(null);
    const [year, setYear] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [activePicker, setActivePicker] = useState(null); // "start" | "end" | null

    if (!visible || !target) return null;

    const supportsYear = target.scopes.includes("class");
    const supportsCourse = supportsYear || target.scopes.includes("course");
    const supportsDate = target.scopes.includes("date");

    const reset = () => {
        setCourse(null);
        setYear(null);
        setStartDate(null);
        setEndDate(null);
        setActivePicker(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const isFiltered = !!(course || year || startDate || endDate);

    const handleContinue = () => {
        const scope = {
            course: course?.id,
            year: year?.id,
            startDate: startDate
                ? startDate.toISOString().slice(0, 10)
                : undefined,
            endDate: endDate ? endDate.toISOString().slice(0, 10) : undefined
        };

        reset();
        onContinue(scope, isFiltered);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <View className="flex-1 justify-end bg-primary/60">
                <View className="bg-primary rounded-t-[32px] border-t border-x border-border px-5 pt-6 pb-10 max-h-[85%]">
                    <View className="w-12 h-1.5 rounded-full bg-border self-center mb-5" />

                    <Text className="text-2xl font-black text-text-secondary">
                        Delete {target.label}
                    </Text>
                    <Text className="text-sm text-text opacity-60 mt-1 mb-5">
                        Narrow this down to a specific class or date range, or
                        continue with no filters to delete everything.
                    </Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {supportsCourse && (
                            <View className="mb-5">
                                <Text className="text-xs font-bold uppercase tracking-widest text-text-secondary opacity-60 mb-2">
                                    Course
                                </Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {COURSES.map(c => (
                                        <Pill
                                            key={c.id}
                                            label={c.title}
                                            active={course?.id === c.id}
                                            onPress={() =>
                                                setCourse(
                                                    course?.id === c.id
                                                        ? null
                                                        : c
                                                )
                                            }
                                        />
                                    ))}
                                </View>
                            </View>
                        )}

                        {supportsYear && (
                            <View className="mb-5">
                                <Text className="text-xs font-bold uppercase tracking-widest text-text-secondary opacity-60 mb-2">
                                    Year
                                </Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {YEAR.map(y => (
                                        <Pill
                                            key={y.id}
                                            label={y.title}
                                            active={year?.id === y.id}
                                            onPress={() =>
                                                setYear(
                                                    year?.id === y.id ? null : y
                                                )
                                            }
                                        />
                                    ))}
                                </View>
                            </View>
                        )}

                        {supportsDate && (
                            <View className="mb-5">
                                <Text className="text-xs font-bold uppercase tracking-widest text-text-secondary opacity-60 mb-2">
                                    Date range
                                </Text>
                                <View className="flex-row gap-2">
                                    <TouchableOpacity
                                        onPress={() => setActivePicker("start")}
                                        className="flex-1 px-4 py-3.5 rounded-2xl border border-border bg-card"
                                    >
                                        <Text className="text-xs text-text-secondary opacity-60 mb-0.5">
                                            From
                                        </Text>
                                        <Text className="text-text font-semibold">
                                            {formatDate(startDate) ?? "Any"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setActivePicker("end")}
                                        className="flex-1 px-4 py-3.5 rounded-2xl border border-border bg-card"
                                    >
                                        <Text className="text-xs text-text-secondary opacity-60 mb-0.5">
                                            To
                                        </Text>
                                        <Text className="text-text font-semibold">
                                            {formatDate(endDate) ?? "Any"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {(startDate || endDate) && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setStartDate(null);
                                            setEndDate(null);
                                        }}
                                        className="mt-2 self-start"
                                    >
                                        <Text className="text-xs text-blue-500 font-bold">
                                            Clear dates
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </ScrollView>

                    {activePicker && (
                        <DateTimePicker
                            mode="date"
                            value={
                                (activePicker === "start"
                                    ? startDate
                                    : endDate) ?? new Date()
                            }
                            display="default"
                            onChange={(event, selectedDate) => {
                                setActivePicker(null);
                                if (event.type !== "set" || !selectedDate)
                                    return;

                                if (activePicker === "start")
                                    setStartDate(selectedDate);
                                else setEndDate(selectedDate);
                            }}
                        />
                    )}

                    <View className="gap-3 mt-2">
                        <TouchableOpacity
                            onPress={handleContinue}
                            className="py-4 rounded-2xl bg-btn items-center"
                        >
                            <Text className="text-text font-bold text-base">
                                {isFiltered
                                    ? "Continue with these filters"
                                    : "Continue without filters (deletes all)"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleClose}
                            className="py-3 items-center"
                        >
                            <Text className="text-red-500 font-bold">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DeleteScopeSheet;
