import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as FileSystem from "expo-file-system";

interface CreatePlaylistProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onCreate: (playlistName: string) => void;
}

const playlistPath = `${FileSystem.documentDirectory}/playlists/`;

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({
  modalVisible,
  setModalVisible,
  onCreate,
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState<string>("");

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim() === "") {
      alert("Please enter a valid playlist name.");
      return;
    }

    try {
      // Replace spaces with underscores in the playlist name
      const safePlaylistName = newPlaylistName.replace(/\s+/g, "_");
      const playlistFileName = `${safePlaylistName}.json`;
      const playlistFilePath = `${playlistPath}${playlistFileName}`;

      // Check if a playlist with the same name already exists
      const files = await FileSystem.readDirectoryAsync(playlistPath);
      if (files.includes(playlistFileName)) {
        alert("A playlist with this name already exists.");
        return;
      }

      // Create an empty playlist file
      await FileSystem.writeAsStringAsync(
        playlistFilePath,
        JSON.stringify({ name: safePlaylistName, tracks: [] })
      );

      onCreate(safePlaylistName); // Inform parent component about the new playlist
      setNewPlaylistName("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-transparent bg-opacity-50">
        <View className="w-4/5 bg-white p-6 rounded-lg">
          <Text className="text-lg font-bold mb-4">Create New Playlist</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-lg mb-4"
            placeholder="Enter playlist name"
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-red-500 p-3 rounded-lg flex-1 mr-2"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg flex-1 ml-2"
              onPress={handleCreatePlaylist}
            >
              <Text className="text-white text-center">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePlaylist;
