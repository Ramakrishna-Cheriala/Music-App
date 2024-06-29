import { View, Text } from "react-native";
import React from "react";
import { useMusicPlayer } from "@/app/MusicProvider";

const FavoritesScreen = () => {
  const { allTracks } = useMusicPlayer();
  return (
    <View className="flex-1 items-center justify-center ">
      <Text className="text-white">FavScreen</Text>
    </View>
  );
};

export default FavoritesScreen;
