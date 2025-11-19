import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Select = ({ title, options, select, selected }) => {
  return (
    <View className="mt-5 px-2 py-6 bg-white rounded-3xl ">
      <Text className=" text-[6vw] px-3 font-bold  mb-3">
        Select the {title}:
      </Text>

      {options.map((item) => (
        <TouchableOpacity
          onPress={() => select(item)}
          key={item.id}
          className={`px-4 py-6 rounded-full ${selected?.id === item.id ? "bg-violet-200" : ""}`}
        >
          <Text className="text-xl font-bold capitalize">{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Select