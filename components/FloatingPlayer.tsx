import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useMusicPlayer } from "@/app/MusicProvider";
import { router } from "expo-router";
import {
  PanGestureHandler,
  GestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import Animated, { withTiming } from "react-native-reanimated";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

export const FloatingPlayer = () => {
  // console.log("in floating player");
  const { currentTrack, play, pause, isPlaying, previousTrack, nextTrack } =
    useMusicPlayer();

  // console.log(currentTrack?.filename);

  if (!currentTrack) return null;

  const handlePress = () => {
    router.navigate("Player");
  };

  // Shared values for animation
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Handle the pan gesture
  const onGestureEvent = (event: any) => {
    // Only allow horizontal swipes by ignoring vertical translation
    if (typeof event.translationX === "number") {
      // Check if translationX is a valid number
      translateX.value = event.translationX;
    }
  };

  const onHandlerStateChange = (event: GestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === 4) {
      // Check for gesture ended state
      const { translationX } = event.nativeEvent;

      if (typeof translationX === "number" && !isNaN(translationX)) {
        if (translationX > 50) {
          // Swipe right (next track)
          translateX.value = withTiming(1000, { duration: 50 }, () => {
            runOnJS(previousTrack)();
            translateX.value = -10;
            translateX.value = withSpring(0);
          });
        } else if (translationX < -50) {
          // Swipe left (previous track)
          translateX.value = withTiming(-1000, { duration: 50 }, () => {
            runOnJS(nextTrack)();
            translateX.value = 10;
            translateX.value = withSpring(0);
          });
        } else {
          // If the swipe wasn't far enough, snap back to the center
          translateX.value = withSpring(0);
        }
      } else {
        // Handle case where translationX is NaN or undefined
        translateX.value = withSpring(0);
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        className="position-absolute bottom-0 w-full bg-[#282C35] rounded-xl p-4"
        style={animatedStyle}
      >
        <TouchableOpacity onPress={handlePress}>
          <View className="flex flex-row items-center">
            <View className="flex-none">
              {currentTrack?.picture?.pictureData ? (
                <Image
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                  source={{ uri: currentTrack?.picture?.pictureData }}
                  alt="Album Art"
                />
              ) : (
                <Image
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                  source={require("@/assets/images/itunes.png")}
                  alt="Album Art"
                />
              )}
            </View>
            <View className="w-1/4 flex-grow ml-4">
              <Text
                className="text-white"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentTrack?.title
                  ? currentTrack?.title
                  : currentTrack?.filename}
              </Text>
              <Text
                className="text-gray-400"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentTrack?.artist || "Unknown"}
              </Text>
            </View>
            <View className="flex flex-row justify-between ml-auto">
              <TouchableOpacity onPress={previousTrack} className="mr-3">
                <FontAwesome6 name="backward" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={isPlaying ? pause : play}
                className="mr-3"
              >
                <FontAwesome6
                  name={isPlaying ? "pause" : "play"}
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={nextTrack}>
                <FontAwesome6 name="forward" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};
