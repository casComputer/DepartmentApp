import axios from "@utils/axios.js";

export const fetchCloudinaryStats = async () => {
    try {
        const { data } = await axios.get("/dashboard/cloudinary");

        if (data.success) return data.usage;
        else return {};
    } catch (error) {
        console.error(error);
        return {};
    }
};
