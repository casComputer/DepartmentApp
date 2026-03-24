import cloudinary from "../config/cloudinary.js";

export const deleteFile = async public_id => {
    try {
        if (!public_id) return;
        
        await cloudinary.api.delete_resources([public_id], {
            resource_type: "raw"
        });
    } catch (e) {
        console.error("Error while deleting file: ", e);
    }
};

export const deleteFilesBulk = async (public_ids = []) => {
    try {
        if (!public_ids.length) return;

        const types = ["image", "video", "raw"];

        await Promise.all(
            types.map(type =>
                cloudinary.api.delete_resources(public_ids, {
                    resource_type: type
                })
            )
        );

    } catch (e) {
        console.error("Bulk delete error:", e);
    }
};

export const getPublicIdFromUrl = url => {
    if (!url || typeof url !== "string") return null;

    try {
        const cleanUrl = url.split("?")[0];
        const uploadIndex = cleanUrl.indexOf("/upload/");
        if (uploadIndex === -1) return null;

        let path = cleanUrl.substring(uploadIndex + 8);
        path = path.replace(/^v\d+\//, "");
        path = path.replace(/\.[^/.]+$/, "");
        return path;
    } catch (err) {
        return null;
    }
};

export const deleteFolderFiles = async folder => {
    try {
        await Promise.all([
            cloudinary.api.delete_resources_by_prefix(folder, {
                resource_type: "image"
            }),
            cloudinary.api.delete_resources_by_prefix(folder, {
                resource_type: "video"
            }),
            cloudinary.api.delete_resources_by_prefix(folder, {
                resource_type: "raw"
            })
        ]);

        return true;
    } catch (e) {
        console.error("Error deleting folder files:", e);
        return false;
    }
};
