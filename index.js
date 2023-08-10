import * as React from "react";
import { useEffect } from "react";
import { AppRegistry, LogBox, Platform } from "react-native";

import HomePage from "./app/home/home-page";
import Freewriting from "./app/freewriting/freewriting-page";
import SettingsPage from "./app/settings/settings-page";
import BreathingHome from "./app/breathing/breathing-page";
import PatternModal from "./app/breathing/edit/pattern-edit";
import PatternTime from "./app/breathing/use/pattern-time";
import PatternUse from "./app/breathing/use/pattern-use";
import PatternCompleted from "./app/breathing/use/pattern-completed";
import AboutPage from "./app/home/about/about-page";
import AudioPage from "./app/audio/audio-page";

import { name as appName } from "./app.json";
import { DefaultTheme } from "react-native-paper";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { persistor, store } from "./app/store/store";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DevMenu from "react-native-dev-menu";
// import crashlytics from '@react-native-firebase/crashlytics';
import TrackPlayer, { Capability } from "react-native-track-player";
import { colors } from "./app/config/colors";
import AudioPlayer from "./app/audio/player/audio-player";
import { deleteTape, setAudioData, setDownloaded, setProgress } from "./app/store/features/tapesSlice";
import RNBackgroundDownloader, { completeHandler } from "@kesha-antonov/react-native-background-downloader";
import { getAudioList } from "./app/helpers/getAudioList";
import { hydrateDownloadData, processDownloadQ } from "./app/helpers/downloadAudio";
import { GestureHandlerRootView } from "react-native-gesture-handler";


//ignore logs

// Ignore log notification by message:
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

const RootStack = createNativeStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator
      theme={DarkTheme}
      screenOptions={{
        cardStyle: { backgroundColor: colors.background },
        gestureEnabled: true,
        animation: "none",
        headerShown: false,
        orientation: "portrait_up"
      }}>
      <RootStack.Screen
        name="Home"
        component=
          {HomePage}
      />
      <RootStack.Screen
        name="Freewriting"
        component={Freewriting}
      />
      <RootStack.Screen
        name="settings"
        component={SettingsPage}
        options={{
          animation: "fade"
        }}
      />
      <RootStack.Screen
        name="Patterns"
        component={BreathingHome}
      />
      <RootStack.Screen
        name="Use"
        component={PatternUse}
      />
      <RootStack.Screen
        name="Time"
        component={PatternTime}
        options={{
          statusBarHidden: true,
        }}
      />
      <RootStack.Screen
        name="Edit"
        component={PatternModal}
        options={{
          presentation: "modal",
        }}
      />
      <RootStack.Screen
        name="Completed"
        component={PatternCompleted}
        options={{
          animation: "fade"
        }}
      />
      <RootStack.Screen
        name="About"
        component={AboutPage}
      />
      <RootStack.Screen
        name="Audio"
        component={AudioPage}
      />
      <RootStack.Screen
        name="AudioPlayer"
        component={AudioPlayer}
      />
    </RootStack.Navigator>
  );
}

const theme = {
  ...DefaultTheme,
  dark: colors.dark,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    ...colors
  }
};

export default function Main() {
  useEffect(() => {
    TrackPlayer.setupPlayer().then(() => {
      TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToPrevious,
          Capability.Stop,
          Capability.SeekTo
        ],
        android: {
          appKilledPlaybackBehavior: "StopPlaybackAndRemoveNotification"
        }
      });
    });

    getAudioList()
      .then(data => {
        store.dispatch(setAudioData({ audioData: data }));
        hydrateDownloadData(data);
      })
      .catch(e => console.warn(e));
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer theme={theme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootStackScreen />
          </GestureHandlerRootView>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const reattachDownloads = async () => {
  let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();

  for (let task of lostTasks) {
    console.log(`Task ${task.id} was found!`);
    const [set, tape, part] = task.id.split("/");

    if (!set || !tape || !part) {
      continue;
    }

    task
      .progress(percent => {
        // console.log(task.id, `Downloaded: ${percent * 100}%`)
        store.dispatch(setProgress({ set, tape, part, progress: percent * 100 }));
      })
      .done(() => {
        console.log("Download is done!");
        store.dispatch(setDownloaded({ set, tape, part }));
        if (Platform.OS === "ios") completeHandler(task.id);
        processDownloadQ();
      })
      .error(error => {
        console.log("Download canceled due to error (Reattached): ", error);
        store.dispatch(deleteTape({ set, tape }));
        if (Platform.OS === "ios") completeHandler(task.id);

      });
  }
};

reattachDownloads().catch(console.error);

DevMenu.addItem("Clear AsyncStorage", () => AsyncStorage.clear());
DevMenu.addItem("Crash App", () => crashlytics().crash());

TrackPlayer.registerPlaybackService(() => require("./app/services/audio"));
AppRegistry.registerComponent(appName, () => Main);
