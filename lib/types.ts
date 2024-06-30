// export type MusicInfoResponse = {
//   id?: string;
//   title?: string;
//   artist?: string;
//   album?: string;
//   genre?: string;
//   picture?: {
//     description: string;
//     pictureData: string;
//   };
//   filename?: string;
//   duration?: string;
// };
import * as MediaLibrary from "expo-media-library";

export type songMetaData = {
  id?: string;
  title?: string;
  picture?: {
    description: string;
    pictureData: string;
  };
  artist?: string;
  filename?: string;
  uri: string;
  album?: string;
  duration: number;
};

export type RootStackParamList = {
  //   Songs: undefined;
  Player: { metaData: songMetaData | null };
};

export declare class MusicInfoResponse {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  picture?: Picture;
  isLiked?: boolean;
}

export declare class Picture {
  description: string;
  pictureData: string;
}

export type SongData = MusicInfoResponse & MediaLibrary.Asset;
