import React from 'react';
import { View, Text, TextInput } from 'react-native';

const Prompt = () => {
  return (
    <View className="relative z-10 w-screen h-screen top-0 left-0 bg-gray-200 justify-center items-center">
      <View className="w-full h-44 bg-zinc-900 rounded-lg">
        <TextInput multiline numberOfLines={4} className="border border-zinc-300 rounded-lg text-white" />
      </View>
    </View>
  );
};


export default Prompt;