import { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialIcons } from "@icons";

import { useAppStore } from "@store/app.store.js";

const { width: vw, height: vh } = Dimensions.get("window");
const AVATAR_SIZE = vw * 0.7;

export const Avatar = ({ handleEdit, handleChangePic }) => {
  const username = useAppStore((state) => state.user?.userId || "");
  const dp = useAppStore((state) => state.user?.dp || "");

  return (
    <View className="my-10 justify-center items-center">
      <View className="w-full justify-center items-center">
        <View
          style={{
            height: AVATAR_SIZE,
            width: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
          }}
          className="bg-card border border-border justify-center items-center"
        >
          {dp ? (
            <Image
              source={{ uri: dp }}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: AVATAR_SIZE / 2,
              }}
            />
          ) : (
            <Text
              allowFontScale={false}
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ fontSize: vw * 0.4 }}
              className="w-full text-center px-4 text-text-secondary font-black"
            >
              {username[0]}
            </Text>
          )}
          <TouchableOpacity
            onPress={dp ? handleEdit : handleChangePic}
            className="p-4 rounded-full bg-btn absolute z-10 -right-2 bottom-[15%]"
          >
            <MaterialIcons name="edit" size={30} />
          </TouchableOpacity>
        </View>
        <Text
          numberOfLines={1}
          minimumFontScale={0.3}
          adjustsFontSizeToFit
          style={{
            marginTop: -vw * 0.1,
          }}
          className="w-[85%] text-text-secondary font-bold text-7xl text-center"
        >
          @{username}
        </Text>
      </View>
    </View>
  );
};

export const EditDpOptions = ({ show, handleChangePic }) => {
  const SHEET_HEIGHT = vh * 0.3;
  const translateY = useSharedValue(SHEET_HEIGHT);

  useEffect(() => {
    translateY.value = withSpring(show ? 0 : SHEET_HEIGHT, {
      damping: 25,
      stiffness: 200,
      mass: 0.8,
      overshootClamping: true,
    });
  }, [show, translateY]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          height: SHEET_HEIGHT,
          bottom: 0,
        },
      ]}
      className="absolute w-full bg-card rounded-t-3xl z-50 overflow-hidden py-2"
    >
      <TouchableOpacity
        onPress={handleChangePic}
        className="w-full py-3 justify-center items-center "
      >
        <Text className="text-text text-xl font-bold">Change Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleChangePic}
        className="w-full py-3 justify-center items-center "
      >
        <Text className="text-text text-xl font-bold">Remove Profile</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
