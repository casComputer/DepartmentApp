import axios from "@utils/axios.js";

export const fetchTeachers = async () => {
   try  {
      const response = await axios.get("/admin/teachers");
      return response.data;
   } catch (error) {
        console.error("Error fetching teachers:", error.message);
        throw error;
     }
}