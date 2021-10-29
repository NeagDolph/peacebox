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

import {name as appName} from './app.json';
import {DefaultTheme, Provider as PaperProvider, Text} from 'react-native-paper';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {store, persistor} from './app/store/store';

import AsyncStorage from "@react-native-async-storage/async-storage";
import DevMenu from 'react-native-dev-menu';
import crashlytics from '@react-native-firebase/crashlytics';

import { LogBox } from 'react-native';

//ignore logs

// Ignore log notification by message:
LogBox.ignoreLogs(['EventEmitter...']);

const RootStack = createNativeStackNavigator();

function RootStackScreen() {
    return (
        <RootStack.Navigator theme={DarkTheme}>
            <RootStack.Screen name="Home" component={HomePage} options={{headerShown: false, orientation: "portrait_up"}}/>
            <RootStack.Screen name="Freewriting" component={Freewriting} options={{headerShown: false, orientation: "portrait_up"}}/>
            <RootStack.Screen name="settings" component={SettingsPage} options={{headerShown: false, orientation: "portrait_up"}}/>
            <RootStack.Screen name="Patterns" component={BreathingHome} options={{headerShown: false, orientation: "portrait_up"}}/>
            <RootStack.Screen name="Use" component={PatternUse} options={{headerShown: false, orientation: "portrait_up"}}/>
            <RootStack.Screen name="Time" component={PatternTime} options={{headerShown: false, animation: "fade", statusBarHidden: true, orientation: "portrait_up"}}/>
            <RootStack.Screen name="Edit" component={PatternModal} options={{headerShown: false, presentation: 'modal', orientation: "portrait_up"}}/>
            <RootStack.Screen name="Completed" component={PatternCompleted} options={{headerShown: false, animation: "fade", orientation: "portrait_up"}}/>
            <RootStack.Screen name="About" component={AboutPage} options={{headerShown: false, orientation: "portrait_up"}}/>
        </RootStack.Navigator>
    );
}

const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3498db',
        accent: '#f1c40f',
    },
};

export default function Main() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <PaperProvider theme={theme}>
                    <NavigationContainer>
                       <RootStackScreen/>
                    </NavigationContainer>
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
}

DevMenu.addItem('Clear AsyncStorage', () => AsyncStorage.clear());
DevMenu.addItem('Crash App', () => crashlytics().crash());


AppRegistry.registerComponent(appName, () => Main);
