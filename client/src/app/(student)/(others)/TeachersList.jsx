import {
    View,
    Text
} from 'react-native'
import { useQuery } from '@tanstack/react-query'

import Header from '@components/common/Header2.jsx'

import {
    fetchAllTeachers
} from '@controller/student/teachers.controller.js'

const TeachersList = ()=> {
    
    const {
        data
    } = useQuery({
        queryKey: ['teachers'],
        queryFn: fetchAllTeachers
    })
    
    
    return (
        <View>
            <Header />
        </View>
    )
}

export default TeachersList