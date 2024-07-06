import { View, Text, FlatList } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useMusicPlayer } from "@/app/MusicProvider";
import { SongData } from "@/lib/types";
import Song from "@/app/Songs";
import Search from "@/components/Search";
import Buttons from "@/components/Buttons";

const FavoritesScreen = () => {
  const { allTracks, currentTrack, setCurrentTrack, setSelectedTracks } =
    useMusicPlayer();
  const [likedTracks, setLikedTracks] = useState<SongData[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<SongData[]>([]);

  useEffect(() => {
    const liked = allTracks.filter((track) => track.isLiked);
    setLikedTracks(liked);
  }, [allTracks]);

  return (
    <View className={`m-0 ${currentTrack ? "mb-56" : "mb-32"}`}>
      <Search
        mainData={likedTracks}
        onResults={setFilteredTracks}
        placeholder="Search Liked Tracks.."
      />
      <Buttons mainData={likedTracks} />
      <FlatList
        data={filteredTracks.length > 0 ? filteredTracks : likedTracks}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <MemoizedSong
            data={item}
            onclick={() => {
              console.log(`clicked on ${item.title}`);
              setSelectedTracks(likedTracks);
              console.log(
                "current selected tracks is from liked songs: ",
                likedTracks.length
              );
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
