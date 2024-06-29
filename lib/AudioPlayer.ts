import { useMusicPlayer } from "@/app/MusicProvider";
import { Audio } from "expo-av";

export const playAudio = async () => {
  let audioInstance: Audio.Sound | null = null;

  const { currentTrack, positionMillis, durationMillis } = useMusicPlayer();
  try {
    if (currentTrack) {
      if (audioInstance !== null) {
        await audioInstance.unloadAsync();
        audioInstance.setOnPlaybackStatusUpdate(null);
        audioInstance = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: currentTrack.uri },
        { shouldPlay: true }
      );

      audioInstance = sound;
      setIsPlaying(true);

      audioInstance.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && !status.isLooping) {
          setDurationMillis(status.durationMillis);
          setPositionMillis(status.positionMillis);
        }

        if (status.didJustFinish) {
          nextTrack();
        }
      });
    }
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};
