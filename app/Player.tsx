import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useMusicPlayer } from "./MusicProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { MovingText } from "@/components/MovingText";
import { useNavigation } from "@react-navigation/native";
import TrackOptions from "@/components/TrackOptions";
import { addAndRemoveFromFavorites } from "@/lib/utils";

const screenWidth = Dimensions.get("window").width;
const metadataFolderPath = `${FileSystem.documentDirectory}/metadata/`;

const formatMillisecondsToMinutes = (totalMilliseconds: number) => {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(0).padStart(2, "0");
  return `${minutes.toString().padStart(2, "0")}:${seconds}`;
};

const PlayerScreen: React.FC = () => {
  const {
    currentTrack,
    play,
    pause,
    isPlaying,
    previousTrack,
    nextTrack,
    positionMillis,
    durationMillis,
    setPositionMillis,
    allTracks,
    setAllTracks,
    setCurrentTrack,
  } = useMusicPlayer();

  const navigation = useNavigation();
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [isSongLiked, setIsSongLiked] = useState<boolean | undefined>(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);

  // Update the slider value based on the playback position.
  useEffect(() => {
    if (!isSeeking && durationMillis && durationMillis > 0) {
      setSliderValue(positionMillis / durationMillis);
    }
  }, [positionMillis, durationMillis, isSeeking]);

  useEffect(() => {
    if (currentTrack) {
      console.log("currentTrack", currentTrack.isLiked);
      setIsSongLiked(currentTrack.isLiked);
      console.log(currentTrack.title, " - ", currentTrack.isLiked);
    }
  }, []);

  // Update the positionMillis when the user drags the slider.
  const handleSliderChange = (value: number) => {
    if (durationMillis) {
      const newPositionMillis = value * durationMillis;
      setSliderValue(value); // Temporarily set the slider value to avoid flickering
      setPositionMillis(newPositionMillis); // Update playback position
    }
  };

  const handleLikedSongs = async () => {
    if (!currentTrack) return;

    try {
      const newLikedStatus = await addAndRemoveFromFavorites(
        currentTrack,
        isSongLiked
      );

      const updatedTracks = allTracks.map((track) =>
        track.id === currentTrack.id
          ? { ...track, isLiked: newLikedStatus }
          : track
      );

      setCurrentTrack({ ...currentTrack, isLiked: newLikedStatus });

      setIsSongLiked(newLikedStatus);
      setAllTracks(updatedTracks);

      console.log(
        `Song "${currentTrack.title}" liked status is now: ${newLikedStatus}`
      );
    } catch (error) {
      console.error("Error handling liked songs:", error);
    }
  };

  // Handle the start of slider dragging.
  const handleSliderStart = () => {
    setIsSeeking(true);
  };

  // Handle the end of slider dragging.
  const handleSliderEnd = async (value: number) => {
    setIsSeeking(false);
    if (durationMillis) {
      const newPositionMillis = value * durationMillis;
      setPositionMillis(newPositionMillis); // Update playback position
      if (isPlaying) {
        await play(); // Resume playback if playing
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaProvider className="flex-1">
        <View className="flex-1 w-full bg-[#0F0F0F]">
          <View className="flex-row justify-between items-center p-4 pt-14">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsOptionsVisible(true)}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 justify-center items-center">
            <View className="w-full h-1/2 overflow-hidden rounded-xl justify-center items-center mb-6">
              {currentTrack?.picture?.pictureData ? (
                <Image
                  source={{ uri: currentTrack.picture.pictureData }}
                  style={{
                    width: "90%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                  alt="Album Art"
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={require("@/assets/images/itunes.png")}
                  style={{
                    width: "90%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                  alt="Album Art"
                  resizeMode="contain"
                />
              )}
            </View>
            <View className="w-full flex flex-row justify-between mb-6">
              <View className="w-3/4 ml-4 bg-slate-500 overflow-auto">
                <Text
                  className="text-white text-base mt-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {currentTrack?.title || currentTrack?.filename || ""}
                </Text>
                <Text
                  className="text-white text-base mt-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {currentTrack?.artist}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleLikedSongs}
                className="w-1/4 flex justify-center items-center"
              >
                {currentTrack?.isLiked ? (
                  <FontAwesome name="heart" size={25} color="white" />
                ) : (
                  <FontAwesome name="heart-o" size={25} color="white" />
                )}
              </TouchableOpacity>
            </View>

            <View className="flex flex-row items-center w-3/4 mb-6">
              <Text className="text-white text-xs">
                {formatMillisecondsToMinutes(positionMillis)}
              </Text>
              <Slider
                style={{ flex: 1, marginHorizontal: 10 }}
                minimumValue={0}
                maximumValue={1}
                value={sliderValue}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#ffffff"
                thumbTintColor="#1DB954"
                onValueChange={handleSliderChange}
                onSlidingStart={handleSliderStart}
                onSlidingComplete={handleSliderEnd}
              />
              <Text className="text-white text-xs">
                {durationMillis && formatMillisecondsToMinutes(durationMillis)}
              </Text>
            </View>

            <View className="flex flex-row justify-between w-3/4">
              <TouchableOpacity onPress={previousTrack} className="mr-4 p-3">
                <FontAwesome6 name="backward" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={isPlaying ? pause : play}
                className="mx-4  p-3"
              >
                <FontAwesome6
                  name={isPlaying ? "pause" : "play"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={nextTrack} className="ml-4 p-3">
                <FontAwesome6 name="forward" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TrackOptions
          isVisible={isOptionsVisible}
          onClose={() => setIsOptionsVisible(false)}
          track={currentTrack}
        />
      </SafeAreaProvider>
    </SafeAreaProvider>
  );
};

export default PlayerScreen;
