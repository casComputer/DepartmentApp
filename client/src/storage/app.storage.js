import { storage } from "@utils/storage.js";

export const saveSystemStorageUri = uri => {
    storage.set("system-storage-uri", uri);
};

export const getSystemStorageUri = () => {
    return storage.getString("system-storage-uri");
};

export const setNotes = (id = "root", notes) => {
    storage.set(`notes-${id}`, JSON.stringify(notes));
};

export const getNotes = (id = "root") => {
    return JSON.parse(storage.getString(`notes-${id}`) || "[]");
};
