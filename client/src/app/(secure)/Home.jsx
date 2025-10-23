import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../../components/home/Header";
import MiniAttentdenceCard from "../../components/home/MiniAttentdenceCard";

const Home = () => {
  return (
    <View className="flex-1 pt-12">
      <LinearGradient
        colors={["rgba(46,217,177,0.7)", "transparent"]}
        className="w-full h-44 absolute top-0 left-0"
      />

      
      <Header />
      <MiniAttentdenceCard />

   
    </View>
  );
};

export default Home;
