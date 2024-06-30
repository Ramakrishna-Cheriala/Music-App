import {
  View,
  Text,
  Modal,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SongData } from "@/lib/types";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CreatePlaylist from "./CreatePlaylist"; // Adjust the path as needed

const playlistPath = `${FileSystem.documentDirectory}/playlists/`;

type OptionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  track: SongData | null;
};

const Playlists: React.FC<OptionsModalProps> = ({
  isVisible,
  onClose,
  track,
}) => {
  const [playlists, setPlaylists] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
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
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePress = async (fileName: string) => {
    if (!track) return;

    const playlistFilePath = `${playlistPath}${fileName}`;
    console.log(playlistFilePath);

    try {
      const fileContent = await FileSystem.readAsStringAsync(playlistFilePath);
      const playlistData = JSON.parse(fileContent);

      const isTrackInPlaylist = playlistData.tracks.some(
        (item: SongData) => item.id === track.id
      );

      if (!isTrackInPlaylist) {
        playlistData.tracks.push(track);
        console.log("length of playlist: ", playlistData.tracks.length);

        await FileSystem.writeAsStringAsync(
          playlistFilePath,
          JSON.stringify(playlistData, null, 2)
        );

        console.log(`Track "${track.title}" added to playlist "${fileName}".`);
      } else {
        console.log(
          `Track "${track.title}" is already in the playlist "${fileName}".`
        );
      }

      onClose();
    } catch (error) {
      console.error("Error handling playlist:", error);
    } finally {
      onClose();
    }
  };

  const handleCreatePlaylist = (playlistName: string) => {
    setPlaylists([...playlists, `${playlistName}.json`]);
  };

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-center items-center bg-transparent">
          <View className="bg-black w-[80%] h-[50%] rounded-lg p-4">
            <Text className="text-white text-xl mb-4">Playlists</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <>
                <TouchableOpacity
                  className="bg-blue-500 p-3 rounded-lg mb-4 ml-2 mr-2"
                  onPress={() => setCreateModalVisible(true)}
                >
                  <Text className="text-white text-center">
                    Create Playlist
                  </Text>
                </TouchableOpacity>
                <FlatList
                  data={playlists}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="bg-[#343437] p-3 rounded-lg mb-2 ml-2 mr-2"
                      onPress={() => {
                        // setSelectedPlaylist(item);
                        handlePress(item);
                      }}
                    >
                      <View className="flex flex-row justify-start items-center">
                        <MaterialCommunityIcons
                          name="playlist-plus"
                          size={25}
                          color="white"
                        />
                        <Text className="text-white text-xl ml-1">
                          {item.replace(".json", "")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
            <View className="flex justify-center items-center mt-4">
              <TouchableOpacity
                className="bg-red-500 p-3 rounded-lg w-[50%]"
                onPress={onClose}
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Playlist Modal */}
      <CreatePlaylist
        modalVisible={createModalVisible}
        setModalVisible={setCreateModalVisible}
        onCreate={handleCreatePlaylist}
      />
    </>
  );
};

export default Playlists;
