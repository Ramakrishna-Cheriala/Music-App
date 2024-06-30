import * as FileSystem from "expo-file-system";
import { SongData, songMetaData } from "./types";

// const METADATA_DIR = FileSystem.documentDirectory + "metadata/";

export const addAndRemoveFromFavorites = async (
  currentTrack: SongData,
  isSongLiked: boolean | undefined
) => {
  if (!currentTrack) return;

  try {
    const metadataFilePath = `${FileSystem.documentDirectory}/metadata/${currentTrack.id}.json`;

    const songData = await FileSystem.readAsStringAsync(metadataFilePath);
    const songMetadata = JSON.parse(songData);

    const newLikedStatus: boolean | undefined = !isSongLiked;
    console.log("newLikedStatus", newLikedStatus);
    songMetadata.isLiked = newLikedStatus;

    await FileSystem.writeAsStringAsync(
      metadataFilePath,
      JSON.stringify(songMetadata)
    );
    console.log(
      `Song "${currentTrack.title}" liked status is now: ${newLikedStatus}`
    );

    return newLikedStatus;

    // const updatedTracks = allTracks.map((track) =>
    //   track.id === currentTrack.id
    //     ? { ...track, isLiked: newLikedStatus }
    //     : track
    // );

    // setCurrentTrack({ ...currentTrack, isLiked: newLikedStatus });

    // setIsSongLiked(newLikedStatus);
    // setAllTracks(updatedTracks);
  } catch (error) {
    console.error("Error handling liked songs:", error);
  }
};
