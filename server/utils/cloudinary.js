import cloudinary from "../config/cloudinary.js";

export const deleteFile = async public_id => {
    try {
        await cloudinary.api.delete_resources([public_id], {
            resource_type: "raw"
        });
    } catch (e) {
        console.error("Error while deleting file: ", e);
    }
};
