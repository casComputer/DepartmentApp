import { useRef, useEffect, useState } from "react";
import { Text, TouchableOpacity, Animated } from "react-native";

import { getRandomQuote } from "../../utils/quotes";

const quote = getRandomQuote();

const Header = () => {
    const opacity = useRef(new Animated.Value(0)).current;
    const [isPrimaryText, setIsPrimaryText] = useState(true);

    useEffect(() => {
        const loopAnimation = () => {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.delay(5000),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true
                })
            ]).start(() => {
                setIsPrimaryText(prev => !prev);
                loopAnimation();
            });
        };

        loopAnimation();
    }, []);

    return (
        <>
            <Animated.View style={{ opacity }} className="w-full mt-36">
                <Text
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    className="font-black text-6xl text-center dark:text-white">
                    {isPrimaryText
                        ? "Welcome To DC-Connect"
                        : "DEPARTMENT OF COMPUTER"}
                </Text>
            </Animated.View>
            <Animated.Text className="font-bold text-md px-10 text-center text-zinc-600 mt-5">
                {quote}
            </Animated.Text>
        </>
    );
};

export default Header;
