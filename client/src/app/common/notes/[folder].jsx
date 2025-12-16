import React from "react";
import { View, Text } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header.jsx";import { FloatingAddButton, FolderItem } from "@components/common/NotesExtraComponents.jsx";
import NotesComponent from "@components/common/Notes.jsx";

import { fetchNotes as fetchNotesForTeacher } from "@controller/teacher/notes.controller.js";
import { fetchNotes as fetchNotesForStudent } from "@controller/student/notes.controller.js";

import { getNotes } from "@storage/app.storage.js";
import { useAppStore } from "@store/app.store.js";


const Folder = () => {
    const role = useAppStore(state=> state.user.role)
    return <NotesComponent role={role} />;
};



export default Folder;
