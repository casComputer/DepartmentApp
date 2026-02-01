
import {
    View,
    Text,
    ActivityIndicator
} from "react-native";
import {
    useQuery
} from "@tanstack/react-query";
import {
    FlashList
} from "@shopify/flash-list";
import {
    useLocalSearchParams
} from "expo-router";

import Header from "@components/common/Header.jsx";
import {
    FloatingAddButton,
    FolderItem,
    SelectingHeader
} from "@components/common/NotesExtraComponents.jsx";

import {
    fetchNotes as fetchNotesForTeacher
} from "@controller/teacher/notes.controller.js";
import {
    fetchNotes as fetchNotesForStudent
} from "@controller/student/notes.controller.js";

import {
    getNotes
} from "@storage/app.storage.js";
import {
    useMultiSelectionList
} from "@store/app.store.js";


const replaceMultiSelectionList = useMultiSelectionList.getState().replace;

const Notes = ({
    role
}) => {
    const isSelecting = useMultiSelectionList(state => state.isSelecting());
    const {
        folder,
        folderId,
        course,
        year
    } = useLocalSearchParams();

    const {
        data,
        isPending
    } = useQuery( {
            queryKey: ["notes", folderId ?? null],
            queryFn:
            role === "student" ? fetchNotesForStudent: fetchNotesForTeacher,
            initialData: () =>
            getNotes(folderId ?? "root") || {
                notes: [],
                success: true
            }
        });

    const handleSelectAll = () => {
        replaceMultiSelectionList(data.notes.map(item => item._id));
    };

    return (
        <View className={`flex-1 bg-primary `}>
            {folder && !isSelecting && <Header title={folder} />}
            {isSelecting && (
                <SelectingHeader
                    handleSelectAll={handleSelectAll}

                    />
            )}

            <Text className="text-text-secondary text-center text-md font-bold">• {year} {course} •</Text>

            <FlashList
                data={data?.notes}
                renderItem={({ item }) => <FolderItem item={item} role={role} />}
                ListHeaderComponent={isPending && <ActivityIndicator />}
                ListEmptyComponent={
                !isPending && (
                    <Text className="mt-10 text-center text-xl font-bold dark:text-white">
                        {role === "teacher" || role === "admin"
                        ? "Click + to create a folder": "No study meterials yet!"}
                    </Text>
                )
                }
                numColumns={2}
                contentContainerStyle={ {
                    paddingHorizontal: 8,
                    paddingBottom: 120,
                    paddingTop: folder || isSelecting ? 10: 50
                }}
                />

            {(role === "teacher" || role === "admin") && (
                <FloatingAddButton parentId={folderId ?? null} />
            )}
        </View>
    );
};

export default Notes;