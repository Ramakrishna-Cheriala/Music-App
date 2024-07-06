import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
// import { useMusicPlayer } from "./MusicProvider";
import { addAndRemoveFromFavorites } from "@/lib/utils";
import { useMusicPlayer } from "@/app/MusicProvider";

const LikeButton = ({ track }) => {
  const [isLiked, setIsLiked] = useState(track?.isLiked);
  const { allTracks, setAllTracks, setCurrentTrack } = useMusicPlayer();

  useEffect(() => {
    setIsLiked(track?.isLiked);
  }, [track]);

  const handleLikedSongs = useCallback(async () => {
    if (!track) return;

    try {
      const newLikedStatus = await addAndRemoveFromFavorites(track, isLiked);
      setIsLiked(newLikedStatus);

      const updatedTracks = allTracks.map((item) =>
        item.id === track.id ? { ...item, isLiked: newLikedStatus } : item
      );

      setAllTracks(updatedTracks);
      setCurrentTrack({ ...track, isLiked: newLikedStatus });
    } catch (error) {
      console.error("Error handling liked songs:", error);
    }
  }, [isLiked, track, allTracks, setAllTracks, setCurrentTrack]);

  return (
    <TouchableOpacity onPress={handleLikedSongs}>
      {isLiked ? (
        <FontAwesome name="heart" size={25} color="white" />
      ) : (
        <FontAwesome name="heart-o" size={25} color="white" />
      )}
    </TouchableOpacity>
  );
};

export default React.memo(LikeButton);
