import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SongData } from "@/lib/types";
import * as FileSystem from "expo-file-system";
import Song from "../../Songs";
import { useMusicPlayer } from "../../MusicProvider";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import PlaylistOptions from "@/components/PlaylistOptions";
import Search from "@/components/Search";
import Buttons from "@/components/Buttons";

const playlistPath = `${FileSystem.documentDirectory}/playlists/`;

const PlaylistData = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { setCurrentTrack, currentTrack, setSelectedTracks } = useMusicPlayer();

  const { playlist } = route.params as { playlist: string };

  const [playlistData, setPlaylistData] = useState<SongData[]>([]);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
  const [filteredTracks, setFilteredTracks] = useState<SongData[]>([]);

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
  // console.log(playlistData.length);

  const handleDelete = async (trackId: string) => {
    try {
      const playlistFilePath = `${playlistPath}${playlist}`;
      const fileContent = await FileSystem.readAsStringAsync(playlistFilePath);
      const data = JSON.parse(fileContent);

      //
      const filteredData = data.tracks.filter(
        (item: SongData) => item.id !== trackId
      );

      //
      data.tracks = filteredData;
      await FileSystem.writeAsStringAsync(
        playlistFilePath,
        JSON.stringify(data, null, 2)
      );

      //
      setPlaylistData(filteredData);
      ToastAndroid.showWithGravity(
        "Song removed from playlist",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } catch (error) {
      console.log(error);
      ToastAndroid.showWithGravity(
        "Error removing song from playlist",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  };

  return (
    <SafeAreaView>
      <View className={`m-0 ${currentTrack ? "mb-40" : "mb-20"}`}>
        <View className="flex flex-row justify-between">
          <TouchableOpacity
            className="w-[10%] flex justify-center items-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-5xl w-[80%]">
            {playlist.replace(".json", "")}
          </Text>
        </View>
        <Search
          mainData={playlistData}
          onResults={setFilteredTracks}
          placeholder={`Search ${playlist.replace(".json", "")}...`}
        />
        <Buttons mainData={playlistData} />
        <FlatList
          data={filteredTracks.length > 0 ? filteredTracks : playlistData}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <View className="flex flex-row">
              <View className="w-[90%]">
                <MemoizedSong
                  data={item}
                  onclick={() => {
                    console.log(`clicked on ${item.title}`);
                    setSelectedTracks(playlistData);
                    console.log(
                      `current selected tracks is from ${playlist}: ${playlist.length}`
                    );
                    setCurrentTrack(item);
                  }}
                />
              </View>
              <TouchableOpacity
                className="flex justify-center items-center"
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={25}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      {/* <PlaylistOptions
        isVisible={isOptionsVisible}
        onClose={() => setIsOptionsVisible(false)}
        playlist={playlist}
      /> */}
    </SafeAreaView>
  );
};

export default PlaylistData;

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);
