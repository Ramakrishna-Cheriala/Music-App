import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import MusicInfo from "@/lib/MusicInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { memo, useCallback, useEffect, useState } from "react";
import { useMusicPlayer } from "@/app/MusicProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import { SongData } from "@/lib/types";
import Song from "@/app/Songs";

const SONGS_LIMIT = 20;
const CLEAR_ASYNC_STORAGE = false;
const CLEAR_STORAGE = false;
const func = loadDataFromFileSystemOnePerSong;

async function* loadDataFromFileSystemOnePerSongInChunks(n: number = 100) {
  const metadataFolderPath = `${FileSystem.documentDirectory}/songs/`;
  if (CLEAR_STORAGE) {
    await FileSystem.deleteAsync(metadataFolderPath);
  }
  const folderInfo = await FileSystem.getInfoAsync(metadataFolderPath);
  if (folderInfo.exists) {
    console.log(`from file system one per song`);
    let allSongsData: SongData[] = [];
    const filesInfo = await FileSystem.readDirectoryAsync(metadataFolderPath);
    // console.log(filesInfo)
    for (let index = 0; index < filesInfo.length; index++) {
      const file = filesInfo[index];
      const json = await FileSystem.readAsStringAsync(
        `${metadataFolderPath}${file}`
      );
      allSongsData.push(JSON.parse(json));
      if (allSongsData.length % 100 === 0) {
        yield allSongsData;
        allSongsData = [];
      }
    }
    yield allSongsData;
    // for (const file of filesInfo) {
    //   // console.log(file);
    //   const json = await FileSystem.readAsStringAsync(
    //     `${metadataFolderPath}${file}`
    //   );
    //   allSongsData.push(JSON.parse(json));
    // }
    // return allSongsData;
    return;
  }

  await FileSystem.makeDirectoryAsync(metadataFolderPath, {
    intermediates: true,
  });
  let data2 = await loadDataFromDisk();
  for (const song of data2) {
    try {
      await FileSystem.writeAsStringAsync(
        `${metadataFolderPath}${song.id}.json`,
        JSON.stringify(song)
      );
    } catch (err) {
      console.log(err);
    }
  }
  return data2;
}

const SongScreen = () => {
  const [songsList, setSongsList] = useState<SongData[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongData | null>(null);
  const { setAllTracks, currentTrack, setCurrentTrack } = useMusicPlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      const startTime = new Date().getTime();
      let endTime = new Date().getTime();
      // for await (const x of func()) {
      //   console.log(x.length);
      //   setSongsList((prevData) => [...prevData, ...x]);
      //   endTime = new Date().getTime();
      //   console.log(
      //     `time taken part - ${(endTime - startTime) / (1000 * 60)} min or ${
      //       (endTime - startTime) / 1000
      //     } sec`
      //   );
      // }
      let songs = await func();
      endTime = new Date().getTime();
      console.log(
        `time taken - ${(endTime - startTime) / (1000 * 60)} min or ${
          (endTime - startTime) / 1000
        } sec`
      );
      setSongsList(songs);
      setAllTracks(songs);
    };
    fetchSongs();
  }, [setAllTracks]);
  return (
    <View className={`m-0 ${currentTrack ? "mb-20" : ""}`}>
      <FlatList
        data={songsList}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <MemoizedSong
            data={item}
            onclick={() => {
              console.log(`clicked on ${item.title}`);
              setCurrentTrack(item);
            }}
          />
        )}
      />
    </View>
  );
};

export default SongScreen;

const MemoizedSong = memo(
  Song,
  (prevProps, nextProps) => prevProps.data === nextProps.data
);

// export type SongData = MusicInfoResponse & MediaLibrary.Asset;

async function loadDataFromDisk() {
  console.log(`in loadDataFromDisk`);

  let hasNext = true;
  let after;
  let allSongs: MediaLibrary.Asset[] = [];
  let allSongsData: SongData[] = [];

  while (hasNext) {
    let response = await MediaLibrary.getAssetsAsync({
      first: SONGS_LIMIT,
      mediaType: "audio",
      after,
    });

    const songsDataPromises = response.assets.map(async (song, index) => {
      let metadata = await MusicInfo.getMusicInfoAsync(song.uri, {
        title: true,
        artist: true,
        album: true,
        genre: true,
        picture: true,
      });
      // reading metadata from storage
      console.log(`${song.uri} reading metadata - ${index}`);

      return { ...song, ...metadata, isLiked: false };
    });

    let songsData = await Promise.all(songsDataPromises);

    allSongs = allSongs.concat(response.assets);
    allSongsData = allSongsData.concat(songsData);
    hasNext = response.hasNextPage && false;
    after = response.endCursor;
  }

  return allSongsData;
}

async function loadDataFromFileSystemOnePerSong() {
  console.log("in func");
  const metadataFolderPath = `${FileSystem.documentDirectory}/metadata/`;
  if (CLEAR_STORAGE) {
    await FileSystem.deleteAsync(metadataFolderPath);
  }
  const folderInfo = await FileSystem.getInfoAsync(metadataFolderPath);
  if (folderInfo.exists) {
    console.log(`from file system one per song`);
    let allSongsData: SongData[] = [];
    const filesInfo = await FileSystem.readDirectoryAsync(metadataFolderPath);
    // console.log(filesInfo);
    for (const file of filesInfo) {
      // console.log(file);
      const json = await FileSystem.readAsStringAsync(
        `${metadataFolderPath}${file}`
      );
      allSongsData.push(JSON.parse(json));
    }
    return allSongsData;
  }

  await FileSystem.makeDirectoryAsync(metadataFolderPath, {
    intermediates: true,
  });
  let data2 = await loadDataFromDisk();
  for (const song of data2) {
    try {
      await FileSystem.writeAsStringAsync(
        `${metadataFolderPath}${song.id}.json`,
        JSON.stringify(song)
      );
    } catch (err) {
      console.log(err);
    }
  }
  return data2;
}

function loadDataFromMMKV() {}
