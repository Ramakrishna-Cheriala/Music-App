import * as FileSystem from "expo-file-system";
import { songMetaData } from "./types";

// const METADATA_DIR = FileSystem.documentDirectory + "metadata/";

const ensureMetadataDirExists = async (METADATA_DIR: string) => {
  const dirInfo = await FileSystem.getInfoAsync(METADATA_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(METADATA_DIR, { intermediates: true });
  }
};

export const saveMetadataToFileSystem = async (
  id: string,
  metadata: songMetaData
) => {
  const METADATA_DIR = FileSystem.documentDirectory + "metadata/";

  await ensureMetadataDirExists(METADATA_DIR);
  const filePath = `${METADATA_DIR}${id}.json`;
  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(metadata));
};

export const loadMetadataFromFileSystem = async (id: string) => {
  const METADATA_DIR = FileSystem.documentDirectory + "metadata/";
  const filePath = `${METADATA_DIR}${id}.json`;
  const fileInfo = await FileSystem.getInfoAsync(filePath);

  if (fileInfo.exists) {
    const metadataJson = await FileSystem.readAsStringAsync(filePath);
    return JSON.parse(metadataJson);
  }
  return null;
};

export const loadDataFromDisk = async () => {
  const METADATA_DIR = FileSystem.documentDirectory + "metadata/";
  const files = await FileSystem.readDirectoryAsync(METADATA_DIR);
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    // const json = await FileSystem.readAsStringAsync(
    //   `${METADATA_DIR}${file}`
    // );
    console.log(file);
  }
  console.log(files.length);
};

export const formatMillisecondsToMinutes = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
};
