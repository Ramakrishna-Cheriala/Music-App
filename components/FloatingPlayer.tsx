import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useMusicPlayer } from "@/app/MusicProvider";
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
import PlayerScreen from "@/app/Player";

// FloatingPlayer Component
export const FloatingPlayer = () => {
  const { currentTrack, play, pause, isPlaying, previousTrack, nextTrack } =
    useMusicPlayer();
  const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);

  // Shared values for animation
  const translateX = useSharedValue(0);

  // Animated style for translation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Handle the pan gesture
  const onGestureEvent = (event: any) => {
    if (typeof event.translationX === "number") {
      translateX.value = event.translationX;
    }
  };

  // Handle state changes of the pan gesture
  const onHandlerStateChange = (event: GestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === 4) {
      // Gesture ended
      const { translationX } = event.nativeEvent;

      if (typeof translationX === "number" && !isNaN(translationX)) {
        if (translationX > 50) {
          // Swipe right (previous track)
          translateX.value = withTiming(1000, { duration: 50 }, () => {
            runOnJS(previousTrack)();
            translateX.value = -10;
            translateX.value = withSpring(0);
          });
        } else if (translationX < -50) {
          // Swipe left (next track)
          translateX.value = withTiming(-1000, { duration: 50 }, () => {
            runOnJS(nextTrack)();
            translateX.value = 10;
            translateX.value = withSpring(0);
          });
        } else {
          // Snap back to the center
          translateX.value = withSpring(0);
        }
      } else {
        // Handle invalid translationX
        translateX.value = withSpring(0);
      }
    }
  };

  // Return null if no track is playing
  if (!currentTrack) return null;

  return (
    <View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          className="position-absolute bottom-0 w-full bg-[#282C35] rounded-xl p-4"
          style={animatedStyle}
        >
          <TouchableOpacity onPress={() => setIsPlayerVisible(true)}>
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
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 10,
                      backgroundColor: "white",
                    }}
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
      <PlayerScreen
        isVisible={isPlayerVisible}
        onClose={() => setIsPlayerVisible(false)}
      />
    </View>
  );
};
