import { View, Text, FlatList } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useMusicPlayer } from "@/app/MusicProvider";
import { SongData } from "@/lib/types";
import Song from "@/app/Songs";

const FavoritesScreen = () => {
  const { allTracks, currentTrack, setCurrentTrack } = useMusicPlayer();
  const [likedTracks, setLikedTracks] = useState<SongData[]>([]);

  useEffect(() => {
    const liked = allTracks.filter((track) => track.isLiked);
    setLikedTracks(liked);
  }, [allTracks]);

  return (
    <View className={`m-0 ${currentTrack ? "mb-20" : ""}`}>
      <FlatList
        data={likedTracks}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <MemoizedSong
            data={item}
            onclick={() => {
              console.log(`clicked on ${item.title}`);
              setCurrentTrack(item);
            }}
          />
        )}
      />
    </View>
  );
};

export default FavoritesScreen;

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);
