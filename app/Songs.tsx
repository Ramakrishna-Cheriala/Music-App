import { SongData } from "@/lib/types";
import { useMusicPlayer } from "./MusicProvider";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Song = ({ data, onclick }: { data: SongData; onclick: Function }) => {
  console.log(`rendering songs`);
  console.log("------------------------");
  //   const { setCurrentTrack } = useMusicPlayer();

  const handlePress = (data: SongData) => {
    //   setCurrentTrack(data);
    onclick(data);
  };

  return (
    <View className="bg-gray-950 rounded-lg shadow-md">
      <TouchableOpacity
        onPress={() => handlePress(data)}
        className="p-3 flex-row items-center"
      >
        <View className="flex items-center mr-3">
          {data?.picture?.pictureData ? (
            <Image
              className="w-14 h-14 rounded-lg"
              source={{ uri: data?.picture?.pictureData }}
              alt="Album Art"
            />
          ) : (
            <Image
              className="w-14 h-14 rounded-lg"
              source={require("@/assets/images/itunes.png")}
              alt="Album Art"
            />
          )}
        </View>
        <View className="flex-1 mr-3">
          <Text
            className="text-white text-lg font-semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.title || data.filename.split(".")[0] || "Unknown Title"}
          </Text>
          <Text
            className="text-gray-400 text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.artist || "Unknown Artist"}
          </Text>
          <Text
            className="text-gray-500 text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data?.album || "Unknown Album"}
          </Text>
        </View>
        <TouchableOpacity
          // onPress={toggleMenu}
          className="flex items-center justify-center"
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default Song;