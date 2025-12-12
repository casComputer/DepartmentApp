import  { storage } from "@utils/storage.js"

export const saveSystemStorageUri = (uri)=>{
    storage.set("system-storage-uri", uri)
}

export const getSystemStorageUri = ()=>{
    return storage.getString("system-storage-uri")
}
