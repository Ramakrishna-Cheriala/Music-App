import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import MusicInfo from "@/lib/MusicInfo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { songMetaData } from "@/lib/types";
import { useMusicPlayer } from "@/app/MusicProvider";

const SongScreen: React.FC = () => {
  const [songs, setSongs] = useState<MediaLibrary.Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // loadDataFromDisk();
        let allSongs: MediaLibrary.Asset[] = [];
        let hasNextPage = true;
        let nextPage: MediaLibrary.AssetRef = "0";

        while (hasNextPage) {
          const pageInfo = await getAssetsPage(nextPage);
          allSongs = [...allSongs, ...pageInfo.assets];
          // hasNextPage = pageInfo.hasNextPage;
          hasNextPage = false;
          nextPage = pageInfo.endCursor;
        }

        setSongs(allSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const getAssetsPage = async (page: MediaLibrary.AssetRef) => {
    const { assets, endCursor, hasNextPage } =
      await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: 20,
        after: page,
      });

    return { assets, endCursor, hasNextPage };
  };

  const renderSongItem = ({ item }: { item: MediaLibrary.Asset }) => {
    return <Song data={item} />;
  };

  return (
    <View className="flex-1 justify-center items-center">
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

// Memoize the Song component to prevent unnecessary re-renders
const Song = memo(({ data }: { data: MediaLibrary.Asset }) => {
  const [metadata, setMetadata] = useState<songMetaData | null>(null);
  const { setCurrentTrack } = useMusicPlayer();

  return (
    <TouchableHighlight>
      <View className="w-full flex flex-row items-center gap-4 border-b-2 border-gray-300 p-2">
        <View className="flex items-center">
          {metadata?.picture?.pictureData ? (
            <Image
              style={{ width: 50, height: 50, borderRadius: 10 }}
              source={{ uri: metadata?.picture?.pictureData }}
              alt="Album Art"
            />
          ) : (
            <Image
              style={{ width: 50, height: 50, borderRadius: 10 }}
              source={require("@/assets/images/itunes.png")}
              alt="Album Art"
            />
          )}
        </View>
        <View className="w-2/3 mr-4">
          <Text className="text-white" numberOfLines={1} ellipsizeMode="tail">
            {data.filename.split(".")[0]}
          </Text>
          <Text className="text-white" numberOfLines={1} ellipsizeMode="tail">
            {metadata?.title || "Unknown"}
          </Text>
          <Text className="text-white" numberOfLines={1} ellipsizeMode="tail">
            {metadata?.artist || "Unknown"}
          </Text>
        </View>
        <View className="">
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="white"
          />
        </View>
      </View>
    </TouchableHighlight>
  );
});

export default SongScreen;
