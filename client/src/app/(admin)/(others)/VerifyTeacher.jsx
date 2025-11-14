import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";


import { verifyTeacher, cancelVerification } from "@controller/admin/teachers.controller";

const Header = () => (
  <TouchableOpacity
    className="flex-row items-center"
    onPress={() => router.back()}
  >
    <MaterialIcons
      name="arrow-back-ios-new"
      size={22}
      color="rgb(59, 130, 246)"
    />
    <Text className="text-blue-500 font-semibold text-[7vw] justify-center">
      Back
    </Text>
  </TouchableOpacity>
);

const VerifyTeacher = () => {
  let { user } = useLocalSearchParams();
  user = JSON.parse(user);

  const handleCancelVerification = () => {
    if(user && user.teacherId){
      cancelVerification(user.teacherId)
    }
  }
  
  const handleVerification = () => {
    if(user && user.teacherId){
      verifyTeacher(user.teacherId)
    }
  }

  return (
    <View className="flex-1 pt-12 px-3 bg-zinc-100">
      <Header />

      {/* Image */}
      <TouchableOpacity className="w-[60vw] h-[60vw] rounded-full bg-green-400 self-center mt-10 justify-center items-center">
        <Text className="text-[40vw] font-black text-center text-black">
          {user.fullname?.slice(0, 1)}
        </Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-900 text-xl mt-1">
        @{user.teacherId}
      </Text>

      <View className="w-full h-[8vh] rounded-full border-black border mt-5">
        <TextInput
          className="text-black w-full h-full font-bold text-[5vw] px-5"
          value={user.fullname}
          editable={false}
        />
      </View>

      {!user.is_verified ? (
        <View className="flex-1 justify-center items-end flex-row gap-3 py-20">
          <TouchableOpacity onPress={handleCancelVerification} className="flex-1 bg-red-500 rounded-3xl justify-center items-center py-6">
            <Text className="text-xl font-bold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVerification} className="flex-1 bg-green-500 rounded-3xl justify-center items-center py-6">
            <Text className="text-xl font-bold">Verify</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/(admin)/(others)/AssignClass`,
              params: { user: JSON.stringify(user) },
            })
          }
        >
          <Text className="text-center bg-blue-500 font-semibold text-lg mt-10 py-6 rounded-3xl">
            Assign class
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VerifyTeacher;
