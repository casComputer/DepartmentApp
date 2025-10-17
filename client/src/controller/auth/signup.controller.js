import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.20.90:3000";

console.log("API_URL:", API_URL);

const signup = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export default signup;
