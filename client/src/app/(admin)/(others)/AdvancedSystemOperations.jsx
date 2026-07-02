import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";

import Header from "@components/common/Header";
import DeleteIndicator from "@components/common/DeleteIndicator";
import Prompt from "@components/common/Prompt";
import DeleteScopeSheet from "@components/admin/DeleteScopeSheet";
import { MaterialCommunityIcons } from "@icons";

import { usePromptStore } from "@store/app.store";
import { deleteAllDocsFromCollection } from "@controller/admin/table.controller";

const ICON_SIZE = 20;

// danger -> accent color used for the icon chip + badge
const DANGER_COLORS = {
    low: "#4F6EF7",
    medium: "#E0A800",
    high: "#F2994A",
    critical: "#F74F4F"
};

const DANGER_LABEL = {
    low: null,
    medium: null,
    high: "High impact",
    critical: "Irreversible · everyone"
};

// `scopes` lists what this target can be narrowed down by:
//   "class"  -> course + year pickers
//   "course" -> course picker only (record is organized by semester, not year)
//   "date"   -> date range pickers
const MONGO_TARGETS = [
    {
        id: "assignments",
        label: "Assignments",
        icon: "clipboard-text-outline",
        scopes: ["class", "date"],
        danger: "medium"
    },
    {
        id: "exam-results",
        label: "Exam Results",
        icon: "file-chart-outline",
        scopes: ["course", "date"],
        danger: "medium"
    },
    {
        id: "internal-marks",
        label: "Internal Marks",
        icon: "chart-box-outline",
        scopes: ["course", "date"],
        danger: "medium"
    },
    {
        id: "attendance-reports",
        label: "Attendance Reports",
        icon: "file-document-outline",
        scopes: ["class", "date"],
        danger: "medium"
    },
    {
        id: "notes",
        label: "Notes",
        icon: "notebook-outline",
        scopes: ["class"],
        danger: "low"
    },
    {
        id: "notifications",
        label: "Notifications",
        icon: "bell-outline",
        scopes: ["date"],
        danger: "low"
    }
];

const TURSO_USER_TARGETS = [
    {
        id: "students",
        label: "Students",
        icon: "school-outline",
        scopes: ["class"],
        danger: "high"
    },
    {
        id: "teachers",
        label: "Teachers",
        icon: "account-tie-outline",
        scopes: [],
        danger: "high"
    },
    {
        id: "parents",
        label: "Parents",
        icon: "account-child-outline",
        scopes: [],
        danger: "high"
    },
    {
        id: "users",
        label: "All Users",
        icon: "account-group",
        scopes: [],
        danger: "critical"
    }
];

const TURSO_RECORD_TARGETS = [
    {
        id: "attendance-records",
        label: "Attendance Records",
        icon: "calendar-remove-outline",
        scopes: ["class", "date"],
        danger: "high"
    },
    {
        id: "worklogs",
        label: "Worklogs",
        icon: "book-open-variant-outline",
        scopes: ["class", "date"],
        danger: "medium"
    },
    {
        id: "fees",
        label: "Fees",
        icon: "cash-remove",
        scopes: ["class", "date"],
        danger: "medium"
    }
];

const scopeSubtitle = target => {
    if (target.scopes.includes("class") && target.scopes.includes("date"))
        return "Optional: filter by class & date range";
    if (target.scopes.includes("class")) return "Optional: filter by class";
    if (target.scopes.includes("course") && target.scopes.includes("date"))
        return "Optional: filter by course & date range";
    if (target.scopes.includes("course")) return "Optional: filter by course";
    if (target.scopes.includes("date")) return "Optional: filter by date range";
    return "Deletes all matching records";
};

const describeScope = scope => {
    const bits = [];

    if (scope.year && scope.course)
        bits.push(`${scope.year} year ${scope.course.toUpperCase()}`);
    else if (scope.course) bits.push(scope.course.toUpperCase());
    else if (scope.year) bits.push(`${scope.year} year, all courses`);

    if (scope.startDate || scope.endDate) {
        bits.push(
            `dated ${scope.startDate ?? "the beginning"} through ${scope.endDate ?? "today"}`
        );
    }

    return bits.join(" · ");
};

const buildRequireText = (target, scope, isFiltered) => {
    const base = target.id.toUpperCase().split("-").join("_");

    if (!isFiltered) return `DELETE_ALL_${base}`;

    const parts = ["DELETE"];
    if (scope.year) parts.push(scope.year.toUpperCase());
    if (scope.course) parts.push(scope.course.toUpperCase());
    if (scope.startDate || scope.endDate) parts.push("RANGE");
    parts.push(base);

    return parts.join("_");
};

const deleteRecords = async ({ db, target, scope, setDeleting }) => {
    setDeleting(true);
    await deleteAllDocsFromCollection(target.id, db, scope);
    setDeleting(false);
};

const DeleteRow = ({ target, onPress }) => {
    const color = DANGER_COLORS[target.danger];
    const badge = DANGER_LABEL[target.danger];

    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center gap-3 px-4 py-3.5 rounded-xl bg-primary border border-border active:bg-card-selected"
        >
            <View
                style={{
                    backgroundColor: color + "22",
                    borderRadius: 12,
                    padding: 9,
                    borderWidth: 1,
                    borderColor: color + "44"
                }}
            >
                <MaterialCommunityIcons
                    name={target.icon}
                    size={ICON_SIZE}
                    style={{ color }}
                />
            </View>

            <View className="flex-1">
                <View className="flex-row items-center gap-2">
                    <Text className="text-text font-semibold text-sm">
                        {target.label}
                    </Text>
                    {!!badge && (
                        <View
                            style={{
                                backgroundColor: color + "22",
                                borderRadius: 999,
                                paddingHorizontal: 8,
                                paddingVertical: 2
                            }}
                        >
                            <Text
                                style={{ color }}
                                className="text-[10px] font-bold uppercase"
                            >
                                {badge}
                            </Text>
                        </View>
                    )}
                </View>
                <Text className="text-text-secondary text-xs mt-0.5 opacity-70">
                    {scopeSubtitle(target)}
                </Text>
            </View>

            <Text className="text-text-secondary/40 text-base">›</Text>
        </TouchableOpacity>
    );
};

const Section = ({ title, subtitle, children }) => (
    <View className="bg-card rounded-2xl p-4 gap-2 mb-5 border border-border">
        <View className="mb-1">
            <Text className="text-text font-bold text-base">{title}</Text>
            {!!subtitle && (
                <Text className="text-text-secondary text-xs mt-0.5">
                    {subtitle}
                </Text>
            )}
        </View>
        <View className="h-px bg-border mb-1" />
        <View className="gap-2">{children}</View>
    </View>
);

const AdvancedSystemOperations = () => {
    const { open } = usePromptStore();
    const [deleting, setDeleting] = useState(false);
    const [sheetTarget, setSheetTarget] = useState(null); // { target, db }

    const confirmAndDelete = ({ target, db, scope, isFiltered }) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

        const scopeDescription = isFiltered ? describeScope(scope) : "";
        const message = isFiltered
            ? `This will permanently delete ${target.label.toLowerCase()} for: ${scopeDescription}.\n\nThis action cannot be undone.`
            : `This will permanently delete ALL ${target.label.toLowerCase()}.\n\nThis action cannot be undone.`;

        open({
            title: `Delete ${target.label}`,
            message,
            requireText: buildRequireText(target, scope, isFiltered),
            onConfirm: () => deleteRecords({ db, target, scope, setDeleting })
        });
    };

    const handlePress = (target, db) => {
        if (target.scopes.length > 0) {
            setSheetTarget({ target, db });
            return;
        }

        confirmAndDelete({ target, db, scope: {}, isFiltered: false });
    };

    return (
        <View className="flex-1 bg-primary px-3">
            <Header title="Advanced Operations" />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingTop: 80, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Text className="text-xs font-semibold uppercase tracking-widest text-text-secondary opacity-60 mb-3 ml-1">
                    Danger Zone
                </Text>

                <Section
                    title="User Accounts"
                    subtitle="Turso DB · removes login access"
                >
                    {TURSO_USER_TARGETS.map(target => (
                        <DeleteRow
                            key={target.id}
                            target={target}
                            onPress={() => handlePress(target, "turso")}
                        />
                    ))}
                </Section>

                <Section
                    title="Class Records"
                    subtitle="Turso DB · attendance, worklogs & fees"
                >
                    {TURSO_RECORD_TARGETS.map(target => (
                        <DeleteRow
                            key={target.id}
                            target={target}
                            onPress={() => handlePress(target, "turso")}
                        />
                    ))}
                </Section>

                <Section
                    title="Academic Records"
                    subtitle="MongoDB · files & documents"
                >
                    {MONGO_TARGETS.map(target => (
                        <DeleteRow
                            key={target.id}
                            target={target}
                            onPress={() => handlePress(target, "mongodb")}
                        />
                    ))}
                </Section>
            </ScrollView>

            <DeleteScopeSheet
                visible={!!sheetTarget}
                target={sheetTarget?.target}
                onClose={() => setSheetTarget(null)}
                onContinue={(scope, isFiltered) => {
                    const { target, db } = sheetTarget;
                    setSheetTarget(null);
                    confirmAndDelete({ target, db, scope, isFiltered });
                }}
            />

            <Prompt />

            {deleting && (
                <View className="w-screen h-screen absolute top-0 left-0 z-40 justify-center items-center bg-primary/70">
                    <DeleteIndicator size={80} />
                </View>
            )}
        </View>
    );
};

export default AdvancedSystemOperations;
