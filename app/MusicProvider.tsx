import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Audio } from "expo-av";
import { SongData, songMetaData } from "@/lib/types";

interface MusicPlayerContextProps {
  allTracks: SongData[];
  currentTrack: SongData | null;
  albums: string[];
  artists: string[];
  isPlaying: boolean;
  setAllTracks: (tracks: SongData[]) => void;
  setCurrentTrack: (track: SongData | null) => void;
  setAlbums: (albums: string[]) => void;
  setArtists: (artists: string[]) => void;
  setLikedTracks: (likedTracks: SongData[]) => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  positionMillis: number;
  durationMillis: number | undefined;
  setPositionMillis: (position: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(
  undefined
);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allTracks, setAllTracks] = useState<SongData[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SongData | null>(null);
  const [albums, setAlbums] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [likedTracks, setLikedTracks] = useState<SongData[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [positionMillis, setPositionMillis] = useState<number>(0);
  const [durationMillis, setDurationMillis] = useState<number | undefined>(0);

  const audioInstance = useRef<Audio.Sound | null>(null);
  const playbackInstance = useRef<Audio.Sound | null>(null);
  const playbackStatus = useRef<any | null>(null);

  const nextTrack = useCallback(() => {
    if (currentTrack && allTracks.length > 0) {
      setPositionMillis(0);
      console.log("positionMillis in next track: ", positionMillis);
      const currentIndex = allTracks.findIndex(
        (track) => track.id === currentTrack.id
      );
      const nextIndex = (currentIndex + 1) % allTracks.length;
      setCurrentTrack(allTracks[nextIndex]);
    }
  }, [currentTrack, allTracks]);

  const previousTrack = useCallback(() => {
    setPositionMillis(0);
    console.log("positionMillis in previous track: ", positionMillis);
    if (currentTrack && allTracks.length > 0) {
      const currentIndex = allTracks.findIndex(
        (track) => track.id === currentTrack.id
      );
      const previousIndex =
        (currentIndex - 1 + allTracks.length) % allTracks.length;
      setCurrentTrack(allTracks[previousIndex]);
    }
  }, [currentTrack, allTracks]);

  const play = async () => {
    try {
      if (currentTrack) {
        console.log("vundi ra 1");
        if (audioInstance.current) {
          await audioInstance.current.unloadAsync();
          audioInstance.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: currentTrack.uri },
          { shouldPlay: true, positionMillis }
        );

        audioInstance.current = sound;
        playbackInstance.current = sound;

        sound.setOnPlaybackStatusUpdate((status: any) => {
          playbackStatus.current = status;
          if (status.isLoaded && !status.isLooping) {
            setDurationMillis(status.durationMillis);
            console.log(durationMillis, " duration edi");
            setPositionMillis(status.positionMillis);
            console.log(positionMillis, " position edi");
            console.log("current tract duration: ", currentTrack.duration);
          }

          if (status.didJustFinish) {
            console.log("song ipoendi ra pukkaa");
            nextTrack();
          }
        });

        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const pause = useCallback(async () => {
    try {
      if (audioInstance.current) {
        console.log("pause");
        await audioInstance.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error pausing audio:", error);
    }
  }, []);

  useEffect(() => {
    if (currentTrack) {
      play();
    }
  }, [currentTrack]);

  const contextValue: MusicPlayerContextProps = {
    allTracks,
    currentTrack,
    albums,
    artists,
    isPlaying,
    setAllTracks,
    setCurrentTrack,
    setAlbums,
    setArtists,
    setLikedTracks,
    play,
    pause,
    nextTrack,
    previousTrack,
    positionMillis,
    durationMillis,
    setPositionMillis,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};
