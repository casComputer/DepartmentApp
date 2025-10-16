import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const signup = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signup`, {
            ...data
        });
        return response.data;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
};

export default signup;