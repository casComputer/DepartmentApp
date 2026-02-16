import { View, Text, ActivityIndicator } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header.jsx";
import {
    FloatingAddButton,
    FolderItem,
    SelectingHeader
} from "@components/common/NotesExtraComponents.jsx";

import { fetchNotes as fetchNotesForTeacher } from "@controller/teacher/notes.controller.js";
import { fetchNotes as fetchNotesForStudent } from "@controller/student/notes.controller.js";

import { getNotes } from "@storage/app.storage.js";
import { useMultiSelectionList } from "@store/app.store.js";

const replaceMultiSelectionList = useMultiSelectionList.getState().replace;

const Notes = ({ role }) => {
    const isSelecting = useMultiSelectionList(state => state.isSelecting());
    const { folder, folderId, course, year } = useLocalSearchParams();

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
        isRefetching
    } = useInfiniteQuery({
        queryKey: ["notes", folderId ?? null],
        queryFn:
            role === "student" ? fetchNotesForStudent : fetchNotesForTeacher,

        placeholderData: () => {
            const cached = getNotes(folderId ?? "root");
            if (cached?.notes) {
                return {
                    pages: [
                        {
                            notes: cached.notes,
                            success: true,
                            hasMore: true
                        }
                    ],
                    pageParams: [1]
                };
            }
        },
        initialPageParam: 1,
        getNextPageParam: lastPage =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const allNotes = data?.pages?.flatMap(page => page?.notes ?? []) ?? [];

    const handleSelectAll = () => {
        replaceMultiSelectionList(allNotes.map(item => item._id));
    };

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View className="py-4">
                <ActivityIndicator />
            </View>
        );
    };

    return (
        <View className={`flex-1 bg-primary `}>
            {folder && !isSelecting && <Header title={folder} />}
            {isSelecting && (
                <SelectingHeader handleSelectAll={handleSelectAll} />
            )}

            <FlashList
                data={allNotes ?? []}
                renderItem={({ item }) => (
                    <FolderItem item={item} role={role} />
                )}
                ListHeaderComponent={
                    year && course ? (
                        <Text className="text-text-secondary text-center text-md font-bold">
                            • {year} {course} •
                        </Text>
                    ) : null
                }
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text className="mt-2 text-center text-xl font-bold text-text">
                            {role === "teacher" || role === "admin"
                                ? "Click + to create a folder"
                                : "No study meterials yet!"}
                        </Text>
                    )
                }
                onRefresh={refetch}
                refreshing={isRefetching}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                numColumns={2}
                className={`${folder ? "pt-16" : ""} px-1`}
                contentContainerStyle={{
                    paddingBottom: 120
                }}
                estimatedItemSize={100}
            />

            {(role === "teacher" || role === "admin") && (
                <FloatingAddButton parentId={folderId ?? null} />
            )}
        </View>
    );
};

export default Notes;
