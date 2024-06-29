// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   Dimensions,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import TrackPlayer, {
//   Capability,
//   State,
//   Event,
//   usePlaybackState,
//   useProgress,
//   useTrackPlayerEvents,
//   Track,
//   PlaybackState,
// } from "react-native-track-player";
// import Slider from "@react-native-community/slider";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// import { MaterialIcons } from "@expo/vector-icons";

// import podcasts from "@/assets/data";

// function MusicPlayer() {
//   const podcastsCount = podcasts.length;
//   const [trackIndex, setTrackIndex] = useState(0);
//   const [trackTitle, setTrackTitle] = useState<string>();
//   const [trackArtist, setTrackArtist] = useState<string>();
//   const [trackArtwork, setTrackArtwork] = useState<string>();

//   // TrackPlayer.registerPlaybackService(() => require("@/lib/service"));
//   const playBackState = usePlaybackState();
//   const progress = useProgress();

//   const setupPlayer = async () => {
//     try {
//       await TrackPlayer.setupPlayer();
//       await TrackPlayer.updateOptions({
//         // stopr: true,
//         capabilities: [
//           // Capability.Play,
//           Capability.Pause,
//           Capability.SkipToNext,
//           Capability.SkipToPrevious,
//           Capability.Stop,
//           Capability.SeekTo,
//         ],
//         // compactCapabilities: [Capability.Play, Capability.Pause],
//       });
//       await TrackPlayer.add(podcasts);
//       await gettrackdata();
//       await TrackPlayer.play();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
//     if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
//       const track: Track | undefined = await TrackPlayer.getTrack(
//         event.nextTrack
//       );
//       const { title, artwork, artist } = track as Track;
//       console.log(event.nextTrack);
//       setTrackIndex(event.nextTrack);
//       setTrackTitle(title);
//       setTrackArtist(artist);
//       setTrackArtwork(artwork);
//     }
//   });

//   const gettrackdata = async () => {
//     let trackIndex = (await TrackPlayer.getCurrentTrack()) as number;
//     let trackObject = (await TrackPlayer.getTrack(trackIndex)) as Track;
//     console.log(trackIndex);
//     setTrackIndex(trackIndex);
//     setTrackTitle(trackObject.title);
//     setTrackArtist(trackObject.artist);
//     setTrackArtwork(trackObject.artwork);
//   };

//   const togglePlayBack = async (playBackState: any) => {
//     // const currentTrack = await TrackPlayer.getCurrentTrack();
//     if (!playBackState) return;
//     const currentTrack = await TrackPlayer.getActiveTrackIndex();
//     const state = await TrackPlayer.getPlaybackState();
//     if (currentTrack != null) {
//       if (
//         playBackState.state === State.Paused ||
//         playBackState.state === State.Ready
//         // state == State.Paused
//       ) {
//         await TrackPlayer.play();
//       } else {
//         await TrackPlayer.pause();
//       }
//     }
//   };

//   const nexttrack = async () => {
//     if (trackIndex < podcastsCount - 1) {
//       await TrackPlayer.skipToNext();
//       gettrackdata();
//     }
//   };

//   const previoustrack = async () => {
//     if (trackIndex > 0) {
//       await TrackPlayer.skipToPrevious();
//       gettrackdata();
//     }
//   };

//   useEffect(() => {
//     // setupPlayer();
//   }, []);

//   return (
//     <View>
//       <Text>in playlist</Text>
//       <Text>in music player</Text>
//       <Text>in playlist</Text>
//       <Text>in music player</Text>
//       <Text>in playlist</Text>
//       <Text>in music player</Text>
//       <Text>in playlist</Text>
//       <Text>in music player</Text>
//     </View>
//   );
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.mainContainer}>
//         <View style={styles.mainWrapper}>
//           <Image source={{ uri: trackArtwork }} style={styles.imageWrapper} />
//         </View>
//         <View style={styles.songText}>
//           <Text
//             style={[styles.songContent, styles.songTitle]}
//             numberOfLines={3}
//           >
//             {trackTitle}
//           </Text>
//           <Text
//             style={[styles.songContent, styles.songArtist]}
//             numberOfLines={2}
//           >
//             {trackArtist}
//           </Text>
//         </View>
//         <View>
//           <Slider
//             style={styles.progressBar}
//             value={progress.position}
//             minimumValue={0}
//             maximumValue={progress.duration}
//             thumbTintColor="#FFD369"
//             minimumTrackTintColor="#FFD369"
//             maximumTrackTintColor="#fff"
//             onSlidingComplete={async (value) => await TrackPlayer.seekTo(value)}
//           />
//           <View style={styles.progressLevelDuraiton}>
//             <Text style={styles.progressLabelText}>
//               {new Date(progress.position * 1000)
//                 .toLocaleTimeString()
//                 .substring(3)}
//             </Text>
//             <Text style={styles.progressLabelText}>
//               {new Date((progress.duration - progress.position) * 1000)
//                 .toLocaleTimeString()
//                 .substring(3)}
//             </Text>
//           </View>
//         </View>
//         <View style={styles.musicControlsContainer}>
//           <TouchableOpacity onPress={previoustrack}>
//             {/* <Ionicons
//               name="play-skip-back-outline"
//               size={35}
//               color="#FFD369"
//             /> */}
//             <MaterialIcons name="skip-next" size={24} color="black" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
//             {/* <Ionicons
//               name={
//                 playBackState === State.Playing
//                   ? 'ios-pause-circle'
//                   : playBackState === State.Connecting
//                   ? 'ios-caret-down-circle'
//                   : 'ios-play-circle'
//               }
//               size={75}
//               color="#FFD369"
//             /> */}
//             <MaterialIcons name="skip-next" size={24} color="black" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={nexttrack}>
//             {/* <Ionicons
//               name="play-skip-forward-outline"
//               size={35}
//               color="#FFD369"
//             /> */}
//             <MaterialIcons name="skip-next" size={24} color="black" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// export default MusicPlayer;

// const { width, height } = Dimensions.get("window");

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#222831",
//   },
//   mainContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   mainWrapper: {
//     width: width,
//     height: width,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   imageWrapper: {
//     alignSelf: "center",
//     width: "90%",
//     height: "90%",
//     borderRadius: 15,
//   },
//   songText: {
//     marginTop: 2,
//     height: 70,
//   },
//   songContent: {
//     textAlign: "center",
//     color: "#EEEEEE",
//   },
//   songTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   songArtist: {
//     fontSize: 16,
//     fontWeight: "300",
//   },
//   progressBar: {
//     alignSelf: "stretch",
//     marginTop: 40,
//     marginLeft: 5,
//     marginRight: 5,
//   },
//   progressLevelDuraiton: {
//     width: width,
//     padding: 5,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   progressLabelText: {
//     color: "#FFF",
//   },
//   musicControlsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 20,
//     width: "60%",
//   },
// });
