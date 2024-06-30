import { View, Text, FlatList } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SongData } from "@/lib/types";
import * as FileSystem from "expo-file-system";
import Song from "./Songs";
import { useMusicPlayer } from "./MusicProvider";

const playlistPath = `${FileSystem.documentDirectory}/playlists/`;

const PlaylistData = () => {
  const route = useRoute();
  const { playlist } = route.params as { playlist: string };

  const [playlistData, setPlaylistData] = useState<SongData[]>([]);
  const { setCurrentTrack } = useMusicPlayer();
  console.log(playlist);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const playlistFilePath = `${playlistPath}${playlist}`;
        const fileContent = await FileSystem.readAsStringAsync(
          playlistFilePath
        );
        const data = JSON.parse(fileContent);
        setPlaylistData(data.tracks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlaylistData();
  }, [playlist]);
  console.log(playlistData.length);
  return (
    <SafeAreaView>
      <View>
        <Text className="text-white text-5xl w-full">
          {playlist.replace(".json", "")}
        </Text>
        <FlatList
          data={playlistData}
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
    </SafeAreaView>
  );
};

export default PlaylistData;

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);
