import { View, Text, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import React from 'react'

const Item = ({ teacher }) => (
  <TouchableOpacity className="bg-white rounded-3xl px-4 py-7 my-2">
    <Text className="text-2xl font-bold ">{teacher.name}</Text>
    
  </TouchableOpacity>
)

const ManageTeachers = () => {
  return (
    <View className="flex-1 bg-green-700 pt-12 px-3">
      <Text className="text-white text-4xl font-bold mb-10">Manage Teachers</Text>
      <FlashList
        data={[1, 2, 3, 4, 5]}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <Item teacher={{ name: `Teacher ${item}`}} />
        )}
      />
    </View>
  )
}

export default ManageTeachers