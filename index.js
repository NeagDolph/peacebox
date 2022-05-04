import * as React from 'react';
import {AppRegistry} from 'react-native';

import HomePage from './app/home/home-page';
import Freewriting from './app/freewriting/freewriting-page';
import SettingsPage from './app/settings/settings-page';
import BreathingHome from './app/breathing/breathing-page';
import PatternModal from './app/breathing/edit/pattern-edit';
import PatternTime from './app/breathing/use/pattern-time';
import PatternUse from './app/breathing/use/pattern-use';
import PatternCompleted from './app/breathing/use/pattern-completed';
import AboutPage from './app/home/about/about-page';
import AudioPage from './app/audio/audio-page';

import {name as appName} from './app.json';
import {DefaultTheme, Provider as PaperProvider, Text} from 'react-native-paper';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {store, persistor} from './app/store/store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DevMenu from 'react-native-dev-menu';
import crashlytics from '@react-native-firebase/crashlytics';

import TrackPlayer from 'react-native-track-player';

import {LogBox} from 'react-native';
import GestureHandlerRootView from 'react-native-gesture-handler';
import {colors} from './app/config/colors';
import AudioPlayer from './app/audio/player/audio-player';
import {deleteTape, setAudioData, setDownloaded, setProgress} from './app/store/features/tapesSlice';
import RNBackgroundDownloader, {download, completeHandler} from 'react-native-background-downloader'
import {useEffect} from 'react';
import {getAudioList} from './app/helpers/getAudioList';
//ignore logs

// Ignore log notification by message:
LogBox.ignoreLogs(['EventEmitter.removeListener']);

const RootStack = createNativeStackNavigator();

function RootStackScreen() {
    return (

        <RootStack.Navigator theme={DarkTheme} screenOptions={{
            cardStyle: {backgroundColor: colors.background},
        }}>
            <RootStack.Screen name="Home" component={HomePage}
                              options={{headerShown: false, orientation: 'portrait_up'}}/>
            <RootStack.Screen name="Freewriting" component={Freewriting}
                              options={{headerShown: false, orientation: 'portrait_up'}}/>
            <RootStack.Screen name="settings" component={SettingsPage}
                              options={{headerShown: false, orientation: 'portrait_up'}}/>
            <RootStack.Screen name="Patterns" component={BreathingHome}
                              options={{headerShown: false, orientation: 'portrait_up'}}/>
            <RootStack.Screen name="Use" component={PatternUse}
                              options={{headerShown: false, orientation: 'portrait_up'}}/>
            <RootStack.Screen name="Time" component={PatternTime} options={{
                headerShown: false,
                animation: 'fade',
                statusBarHidden: true,
                orientation: 'portrait_up',
            }}/>
            <RootStack.Screen name="Edit" component={PatternModal}
                              options={{headerShown: false, presentation: 'modal', orientation: 'portrait_up'}}/>
            <RootStack.Screen name="Completed" component={PatternCompleted}
                              options={{headerShown: false, animation: 'fade', orientation: 'portrait_up'}}/>
            <RootStack.Screen name="About" component={AboutPage}
                              options={{headerShown: false, orientation: 'portrait_up'}}/>
            <RootStack.Screen name="Audio" component={AudioPage}
                              options={{headerShown: false, orientation: 'portrait_up'}}/>
            <RootStack.Screen name="AudioPlayer" component={AudioPlayer}
                              options={{headerShown: false, orientation: 'portrait_up'}}/>
        </RootStack.Navigator>

    );
}

const theme = {
    ...DefaultTheme,
    dark: colors.dark,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        ...colors,
    },
};

export default function Main() {
    useEffect(() => {
        reattachDownloads()
            .catch(console.error)

        console.log("RUN")
        getAudioList()
            .then(data => store.dispatch(setAudioData({audioData: data})))
            .catch(e => console.warn(e))
    }, [])

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <PaperProvider theme={theme}>
                    <NavigationContainer theme={theme}>
                        <RootStackScreen/>
                    </NavigationContainer>
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
}

const reattachDownloads = async() => {
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();

    for (let task of lostTasks) {
        console.log(`Task ${task.id} was found!`)
        const [set, tape, part] = task.id.split("/")

        if (!set || !tape || !part) continue;
        task.progress(percent => {
            console.log(task.id, `Downloaded: ${percent * 100}%`)
            store.dispatch(setProgress({set, tape, part, progress: percent * 100}))
        }).done(() => {
            console.log('Download is done!')
            store.dispatch(setDownloaded({set, tape, part}))
            completeHandler(task.id)
        }).error(error => {
            console.log('Download canceled due to error: ', error)
            store.dispatch(deleteTape({set, tape}));
        })
    }
}

DevMenu.addItem('Clear AsyncStorage', () => AsyncStorage.clear());
DevMenu.addItem('Crash App', () => crashlytics().crash());

TrackPlayer.registerPlaybackService(() => require('./app/services/audio'))
AppRegistry.registerComponent(appName, () => Main);
