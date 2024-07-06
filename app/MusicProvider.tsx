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
  //
  albums: string[];
  artists: string[];
  isPlaying: boolean;
  selectedTracks: SongData[] | null;
  //
  isShuffled: boolean;
  setShuffledIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsShuffled: (isShuffled: boolean) => void;
  setShuffledIndices: (indices: number[]) => void;
  //
  setSelectedTracks: (tracks: SongData[]) => void;
  setAllTracks: (tracks: SongData[]) => void;
  setCurrentTrack: (track: SongData | null) => void;
  setAlbums: (albums: string[]) => void;
  setArtists: (artists: string[]) => void;
  setLikedTracks: (likedTracks: SongData[]) => void;
  //
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  //
  positionMillis: number;
  durationMillis: number | undefined;
  setPositionMillis: (position: number) => void;
  //
  queue: SongData[];
  setQueue: (track: SongData[]) => void;
  addToQueue: (track: SongData) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(
  undefined
);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allTracks, setAllTracks] = useState<SongData[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<SongData[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SongData | null>(null);
  const [albums, setAlbums] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  //
  const [likedTracks, setLikedTracks] = useState<SongData[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  //
  const [positionMillis, setPositionMillis] = useState<number>(0);
  const [durationMillis, setDurationMillis] = useState<number | undefined>(0);
  //
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [shuffledIndex, setShuffledIndex] = useState<number>(0);
  //
  const [queue, setQueue] = useState<SongData[]>([]);
  const [originalIndex, setOriginalIndex] = useState<number | null>(null);

  const audioInstance = useRef<Audio.Sound | null>(null);
  const playbackInstance = useRef<Audio.Sound | null>(null);
  const playbackStatus = useRef<any | null>(null);

  const nextTrack = useCallback(() => {
    setPositionMillis(0);
    if (queue.length > 0) {
      console.log("music provider in queue: ", queue.length);
      const [nextTrackInQueue, ...remainingQueue] = queue;
      setQueue(remainingQueue);
      setCurrentTrack(nextTrackInQueue);
    }
    //
    else if (originalIndex !== null) {
      // Queue has finished, resume from original position in selectedTracks
      console.log("in music provider - resuming from original index");
      const resumeIndex = (originalIndex + 1) % selectedTracks.length;
      setCurrentTrack(selectedTracks[resumeIndex]);
      setOriginalIndex(null); // Reset the original index
    }
    //
    else if (isShuffled && shuffledIndices.length > 0) {
      console.log(
        "music provider is shuffled in next track: ",
        shuffledIndices.length
      );
      const currentShuffledIndex = shuffledIndices.indexOf(shuffledIndex);
      const newIndex =
        shuffledIndices[(currentShuffledIndex + 1) % shuffledIndices.length];
      setCurrentTrack(selectedTracks[newIndex]);
      setShuffledIndex(newIndex);
    }

    //
    else {
      if (currentTrack && selectedTracks.length > 0) {
        const currentIndex = selectedTracks.findIndex(
          (track) => track.id === currentTrack.id
        );
        const nextIndex = (currentIndex + 1) % selectedTracks.length;
        setCurrentTrack(selectedTracks[nextIndex]);
      }
    }
  }, [
    currentTrack,
    selectedTracks,
    isShuffled,
    shuffledIndices,
    shuffledIndex,
    queue,
    originalIndex,
  ]);

  const previousTrack = useCallback(() => {
    setPositionMillis(0);
    // console.log("positionMillis in previous track: ", positionMillis);

    if (isShuffled && shuffledIndices.length > 0) {
      console.log(
        "music provider is shuffled in previous track: ",
        shuffledIndices.length
      );
      const currentShuffledIndex = shuffledIndices.indexOf(shuffledIndex);
      if (currentShuffledIndex === 0) return;
      const newIndex =
        shuffledIndices[(currentShuffledIndex - 1) % shuffledIndices.length];
      setCurrentTrack(selectedTracks[newIndex]);
      setShuffledIndex(newIndex);
    }
    //
    else {
      if (currentTrack && selectedTracks.length > 0) {
        const currentIndex = selectedTracks.findIndex(
          (track) => track.id === currentTrack.id
        );
        const previousIndex =
          (currentIndex - 1 + selectedTracks.length) % selectedTracks.length;
        setCurrentTrack(selectedTracks[previousIndex]);
      }
    }
  }, [currentTrack, selectedTracks]);

  const play = async () => {
    try {
      if (currentTrack) {
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
            // console.log(durationMillis, " duration edi");
            setPositionMillis(status.positionMillis);
            // console.log(positionMillis, " position edi");
            // console.log("current tract duration: ", currentTrack.duration);
          }

          if (status.didJustFinish) {
            console.log("song ipoendi ra");
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
      setPositionMillis(0);
      play();
    }
  }, [currentTrack]);

  const addToQueue = useCallback(
    (track: SongData) => {
      // Log the current queue length before adding
      console.log(
        "Queue length (before adding) in music provider: ",
        queue.length
      );

      // Use the functional form of setQueue to update the queue state
      setQueue((prevQueue) => {
        const newQueue = [...prevQueue, track];
        console.log("New track added to queue: ", track.title);
        console.log(
          "Queue length (after adding) in music provider: ",
          newQueue.length
        );
        return newQueue;
      });
    },
    [queue]
  );

  useEffect(() => {
    if (queue.length > 0 && originalIndex === null && currentTrack) {
      const currentIndex = selectedTracks.findIndex(
        (track) => track.id === currentTrack.id
      );
      setOriginalIndex(currentIndex);
    }
  }, [queue, originalIndex, currentTrack, selectedTracks]);

  const contextValue: MusicPlayerContextProps = {
    allTracks,
    currentTrack,
    albums,
    artists,
    isPlaying,
    selectedTracks,
    isShuffled,
    setIsShuffled,
    setShuffledIndex,
    setShuffledIndices,
    setSelectedTracks,
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
    queue,
    setQueue,
    addToQueue,
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
