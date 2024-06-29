import * as FileSystem from "expo-file-system";

export const getAllAudioFiles = async () => {
  try {
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );
    const audioFiles = files
      .filter(
        (file) =>
          file.endsWith(".mp3") ||
          file.endsWith(".wav") ||
          file.endsWith(".flac")
      )
      .map((file) => `${FileSystem.documentDirectory}/${file}`);

    // return audioFiles;
    console.log("length-utils: ", audioFiles.length);
  } catch (error) {
    console.error("Error fetching audio files: ", error);
    return [];
  }
};
