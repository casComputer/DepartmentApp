import axios from "@utils/axios.js"

export const initialClassDetailsFetch = async()=>{
    try {
       const res = axios.get('/class/allClassDetails')
       
       console.log(res.data);
       
    } catch (error) {
      console.error(error);
    }
}