import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { colors } from "@/constants/tokens";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CreatePlaylist from "@/components/CreatePlaylist";
import { useNavigation } from "@react-navigation/native";
import { useMusicPlayer } from "@/app/MusicProvider";

const playlistPath = `${FileSystem.documentDirectory}/playlists/`;

const PlayListScreen = () => {
  const navigation = useNavigation();
  const [playlists, setPlaylists] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { currentTrack } = useMusicPlayer();

  useEffect(() => {
    const checkForPlaylists = async () => {
      try {
        const dirInfo = await FileSystem.getInfoAsync(playlistPath);

        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(playlistPath, {
            intermediates: true,
          });
        }

        const files = await FileSystem.readDirectoryAsync(playlistPath);
        const jsonFiles = files.filter((file) => file.endsWith(".json"));

        setPlaylists(jsonFiles);
      } catch (error) {
        console.error("Error checking for playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    checkForPlaylists();
  }, []);

  const addPlaylist = (newPlaylistName: string) => {
    const newPlaylistFile = `${newPlaylistName}.json`;
    setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylistFile]);
  };

  const handlePress = (item: string) => {
    navigation.navigate("PlaylistData", { playlist: item });
  };

  const handleDelete = async (playlist: string) => {
    try {
      FileSystem.deleteAsync(`${playlistPath}${playlist}`);
      ToastAndroid.showWithGravity(
        "Playlist Deleted",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
      setPlaylists(playlists.filter((item) => item !== playlist));
    } catch (error) {
      console.log(error);
      ToastAndroid.showWithGravity(
        "Cannot Delete Playlist! Try Again",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  };

  const renderPlaylistItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View className="p-4 bg-gray-800 rounded-lg mb-2 flex flex-row justify-between">
        <Text className="text-white">{item.replace(".json", "")}</Text>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <MaterialCommunityIcons name="delete" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        className={`flex-1 items-center justify-center bg-${colors.background}`}
      >
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 bg-${colors.background} p-4 ${
        currentTrack ? "mb-56" : "mb-32"
      }`}
    >
      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: 4 }}
        ListHeaderComponent={() => (
          <View className="flex mb-4">
            <TouchableOpacity
              className="flex flex-row items-center bg-blue-500 p-4 rounded-lg"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={25} color="white" />
              <Text className="text-white text-xl ml-2">
                Create New Playlist
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center">
            <Text className="text-white mb-4">No playlists found</Text>
          </View>
        )}
      />

      <CreatePlaylist
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onCreate={addPlaylist}
      />
    </View>
  );
};

export default PlayListScreen;
