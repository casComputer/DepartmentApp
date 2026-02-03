import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TOGGLE_WIDTH = 140;
const TOGGLE_HEIGHT = 35;
const BUTTON_WIDTH = (TOGGLE_WIDTH / 2);

const Toggle = ({ text1 = "1", text2="2"}) => {
  const left = useSharedValue(0);
      const [activeIndex, setActiveIndex] = useState(0);

  const handleToggle = (index) => {
      setActiveIndex(index)
    left.value = withTiming(index * BUTTON_WIDTH, {
      duration: 200,
    });
  };

  const animatedTogglerStyle = useAnimatedStyle(() => ({
    left: left.value,
  }));
  
  return (
    <View style={styles.container} className="bg-card">
      {/* Button 1 */}
      <Pressable
        style={styles.inner}
        onPress={() => handleToggle(0)}
      >
        <Text className="text-text font-black text-lg">{text1}</Text>
      </Pressable>

      {/* Button 2 */}
      <Pressable
        style={styles.inner}
        onPress={() => handleToggle(1)}
      >
        <Text className="text-text font-black text-lg">{text2}</Text>
      </Pressable>

      {/* Animated Toggle */}
      <Animated.View
        style={[styles.toggler, animatedTogglerStyle]}
        className="bg-card-selected"
      >
        <Text className="text-text-secondary font-black text-xl">
          {activeIndex === 0 ? text1 : text2}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: 26,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  inner: {
    width: BUTTON_WIDTH,
    height: "100%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  toggler: {
    position: "absolute",
    width: BUTTON_WIDTH ,
    height: "100%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Toggle;