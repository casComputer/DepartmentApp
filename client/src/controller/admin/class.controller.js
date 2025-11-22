import axios from "@utils/axios.js";

export const fetchClassDetails = async () => {
    try {
        const res = axios.get("/class/allClassDetails");

        console.log(res.data);
    } catch (error) {
        console.error(error);
    }
};

export const addNewClass = async data => {
    try {
        const res = axios.post("/class/addNewClass", { data });
        
        console.log(res.data);
        
    } catch (err) {
        console.error("Error while adding new class: ", err);
    }
};
