import { useState } from "react";
import { SongData, songMetaData } from "@/lib/types";
import { useMusicPlayer } from "@/app/MusicProvider";

let demoTrack: SongData | null = null;
let setDemoTrack: (track: SongData | null) => void;

const useCurrentTrack = () => {
  const [track, setTrack] = useState<SongData | null>(demoTrack);
  const { setCurrentTrack } = useMusicPlayer();

  setDemoTrack = (track: SongData | null) => {
    // setTrack({});
    demoTrack = track;
    setTrack(track);
    setCurrentTrack(track);
  };

  console.log("current track: ", demoTrack?.filename);

  return { demoTrack: track, setDemoTrack };
};

export default useCurrentTrack;
