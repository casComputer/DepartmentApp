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

export const fetchTursoStats = async () => {
    try {
        const { data } = await axios.get("/dashboard/turso");

        if (data.success) return data.stats;
        else return {};
    } catch (error) {
        console.error(error);
        return {};
    }
};
