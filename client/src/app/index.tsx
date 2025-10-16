import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { useAppStore } from "../store/app.store";

const setUserRole    = useAppStore.getState().setUserRole;

export default function Index() {
  return (
    <View className="flex-1 bg-white pt-20 px-5">
      <View className="flex-row items-center ">
        <Text className="font-black text-5xl w-[75%]">    
          Welome To DC-CONNECT
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/auth/Signin")}
          className="bg-blue-500 px-5 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold text-lg">SIGN IN</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-black mt-16 mb-5">New to DC-CONNECT?</Text>
      <View className="flex-row justify-between ">
        <TouchableOpacity
          onPress={() => {
            setUserRole("teacher");
            router.push("/auth/Signup");
          }}
          className="border-2 border-black-500 w-[45%] mt-3 py-5 rounded-lg items-center justify-center"
        >
          <Text className="text-black-500 text-lg font-bold mt-2">TEACHER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setUserRole("student");
            router.push("/auth/Signup");
          }}
          className="border-2 border-black-500 w-[45%] mt-3 py-5 rounded-lg items-center justify-center"
        >
          <Text className="text-black-500 text-lg font-bold mt-2">STUDENT</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          setUserRole("parent");
          router.push("/auth/Signup");
        }}
        className="mx-auto mt-5 border-2 border-black-500 w-[45%] py-5 rounded-lg items-center justify-center"
      >
        <Text className="text-black-500 text-lg font-bold mt-2">PARENT</Text>
      </TouchableOpacity>

      <View>
        <Text className=" text-black-500 text-2xl font-black mt-10">
          Already have an account?
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/auth/Signin")}
          className="bg-green-500  py-4 rounded-lg mt-3 items-center justify-center"
        >
          <Text className="text-white font-semibold text-lg">SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // return (
  //   <Redirect href="/auth/Signup" />
  // );
}
