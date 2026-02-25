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
        console.log("fetching");
        const { data } = await axios.get("/dashboard/turso");

        console.log(" data ", data);

        if (data.success) return data.stats;
        else return {};
    } catch (error) {
        console.error(error);
        return {};
    }
};

export const fetchUserStats = async () => {
    try {
        const { data } = await axios.get("/dashboard/users");

        if (data.success) return data.users;
        else return {};
    } catch (error) {
        console.error(error);
        return {};
    }
};
