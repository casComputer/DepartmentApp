import axiox from '@utils/axios.js'

export const fetchAllTeachers = async ()=>{
    try{
        const { data } = await axios.post('/teacher/fetchAllTeachers')
        
        return []
        
    } catch(err){
        console.log(err)
        return []
    }
}