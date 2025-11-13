import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const TeacherItem = ({ fullname }) => {
  return (
   <TouchableOpacity className="bg-white rounded-3xl px-5 py-7 my-2">
       <Text className="text-2xl font-bold ">{fullname}</Text>
     </TouchableOpacity>
  )
}

export default TeacherItem