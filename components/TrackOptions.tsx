import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
  Image,
} from "react-native";
import { SongData } from "@/lib/types";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { addAndRemoveFromFavorites } from "@/lib/utils";
import { useMusicPlayer } from "@/app/MusicProvider";
import Playlists from "./Playlists";

type OptionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  track: SongData | null;
};

const TrackOptions: React.FC<OptionsModalProps> = ({
  isVisible,
  onClose,
  track,
}) => {
  const [addToPlaylist, setAddToPlaylist] = useState(false);
  const [addToQueue, setAddToQueue] = useState(false);
  const { allTracks, setAllTracks } = useMusicPlayer();
  const [isSongLiked, setIsSongLiked] = useState<boolean | undefined>(false);

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

  if (!track) return null;
  // setIsSongLiked(track.isLiked);

  const handleLikedSongs = async () => {
    if (!track) return;
    setIsSongLiked(track.isLiked);
    console.log("is song liked? ", isSongLiked);

    try {
      const newLikedStatus = await addAndRemoveFromFavorites(
        track,
        isSongLiked
      );

      console.log("newLikedStatus", newLikedStatus);

      const updatedTracks = allTracks.map((t) =>
        t.id === track.id ? { ...t, isLiked: newLikedStatus } : t
      );

      setAllTracks(updatedTracks);
      track.isLiked = newLikedStatus;
      setIsSongLiked(newLikedStatus);

      console.log(
        `Song "${track.title}" liked status is now: ${newLikedStatus}`
      );
    } catch (error) {
      console.error("Error handling liked songs:", error);
    } finally {
      onClose();
    }
  };

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

              {/* Track Details */}
              <View className="flex items-center mb-4">
                {track?.picture?.pictureData ? (
                  <Image
                    className="w-40 h-40 rounded-lg"
                    source={{ uri: track?.picture?.pictureData }}
                    alt="Album Art"
                  />
                ) : (
                  <Image
                    className="w-40 h-40 rounded-lg"
                    source={require("@/assets/images/itunes.png")}
                    alt="Album Art"
                  />
                )}
              </View>

              <View className="mb-6 flex justify-center items-center">
                <Text className="text-white text-lg font-semibold">
                  {track.title || "Unknown Title"}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  {track.artist || "Unknown Artist"}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {track.album || "Unknown Album"}
                </Text>
              </View>

              {/* Action Options */}
              <View className="mb-4">
                <TouchableOpacity className="py-2" onPress={handleLikedSongs}>
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    {track.isLiked ? (
                      <>
                        <FontAwesome name="heart" size={25} color="red" />
                        <Text className="text-red-500 text-base ml-3">
                          Remove from Favorites
                        </Text>
                      </>
                    ) : (
                      <>
                        <FontAwesome name="heart-o" size={25} color="green" />
                        <Text className="text-green-500 text-base ml-3">
                          Add to Favorites
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-2 mt-3"
                  onPress={() => {
                    setAddToPlaylist(true);
                    // onClose();
                  }}
                >
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    <>
                      <MaterialCommunityIcons
                        name="playlist-plus"
                        size={25}
                        color="white"
                      />
                      <Text className="text-white text-base ml-3">
                        Add to Playlist
                      </Text>
                    </>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-2 mt-3"
                  onPress={() => console.log("Add to Queue")}
                >
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    {addToQueue ? (
                      <>
                        <MaterialIcons
                          name="queue-music"
                          size={25}
                          color="white"
                        />
                        <Text className="text-green-500 text-base ml-3">
                          Add to Queue
                        </Text>
                      </>
                    ) : (
                      <>
                        <MaterialIcons
                          name="queue-music"
                          size={25}
                          color="red"
                        />
                        <Text className="text-red-500 text-base ml-3">
                          Remove from Queue
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-2 mt-3"
                  onPress={() => console.log("View Album")}
                >
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    <MaterialCommunityIcons
                      name="album"
                      size={25}
                      color="white"
                    />
                    <Text className="text-white text-base ml-3">
                      View Album
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-2 mt-3"
                  onPress={() => console.log("Edit")}
                >
                  <View className="flex flex-row items-center pb-3 border-b border-gray-600">
                    <AntDesign name="edit" size={25} color="white" />
                    <Text className="text-white text-base ml-3">Edit</Text>
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
      <Playlists
        isVisible={addToPlaylist}
        onClose={() => setAddToPlaylist(false)}
        track={track}
      />
    </Modal>
  );
};

export default TrackOptions;
