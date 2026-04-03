import axios from "@utils/axios.js";

export const fetchCloudinaryStats = async () => {
    try {
        const { data } = await axios.get("/dashboard/cloudinary");
        console.log(data.usage)

        if (data.success) return data.usage;
        else return {};
    } catch (error) {
        return {};
    }
};

export const fetchTursoStats = async () => {
    try {
        const { data } = await axios.get("/dashboard/turso");
        if (data.success) return data.stats;
        else return {};
    } catch (error) {
        return {};
    }
};

export const fetchUserStats = async () => {
    try {
        const { data } = await axios.get("/dashboard/users");

        if (data.success) return data.users;
        else return {};
    } catch (error) {
        return {};
    }
};
