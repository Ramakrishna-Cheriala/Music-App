import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
  ToastAndroid,
} from "react-native";
import { SongData } from "@/lib/types";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const playlistPath = `${FileSystem.documentDirectory}/playlists/`;

type OptionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  playlist: string;
};

const PlaylistOptions: React.FC<OptionsModalProps> = ({
  isVisible,
  onClose,
  playlist,
}) => {
  // PanResponder to detect dragging
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 100) {
          // if drag distance on Y-axis is greater than 100
          onClose();
        }
      },
    })
  ).current;
  // setIsSongLiked(track.isLiked);

  console.log("in playlist options: ", playlist);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-transparent">
          <TouchableWithoutFeedback>
            <View className="bg-[#343437] p-6 rounded-t-lg">
              <View className="items-center mb-4" {...panResponder.panHandlers}>
                <View className="bg-gray-600 w-16 h-1.5 rounded-full mb-4" />
              </View>

              {/* Action Options */}
              <View className="mb-4">
                <TouchableOpacity className="py-2 mt-3">
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    <>
                      <MaterialCommunityIcons
                        name="delete"
                        size={25}
                        color="white"
                      />
                      <Text className="text-white text-base ml-3">
                        Delete Playlist
                      </Text>
                    </>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-2 mt-3"
                  onPress={() => console.log("Edit")}
                >
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    <AntDesign name="edit" size={25} color="white" />
                    <Text className="text-white text-base ml-3">
                      Edit Playlist
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                className="py-3 mt-6 bg-red-500 rounded-lg"
                onPress={onClose}
              >
                <Text className="text-white text-center text-base">Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PlaylistOptions;
