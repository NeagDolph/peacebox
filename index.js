import * as React from 'react';
import {AppRegistry} from 'react-native';

import HomePage from './app/home/home-page';
import Freewriting from './app/freewriting/freewriting-page';
import SettingsPage from './app/settings/settings-page';
import BreathingHome from './app/breathing/breathing-home';
import PatternEdit from './app/breathing/pattern/pattern-edit';
import PatternUse from './app/breathing/pattern/pattern-use';

import {name as appName} from './app.json';
import {DefaultTheme, Provider as PaperProvider, Text} from 'react-native-paper';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {store, persistor} from './app/store/store';

import {library} from '@fortawesome/fontawesome-svg-core';

import faBolt from '@fortawesome/fontawesome-free-solid/faBolt';
import faBurn from '@fortawesome/fontawesome-free-solid/faBurn';
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate';
import faCloud from '@fortawesome/fontawesome-free-solid/faCloud';
import faGem from '@fortawesome/fontawesome-free-solid/faGem';
import faCog from '@fortawesome/fontawesome-free-solid/faCog';
import faRecycle from '@fortawesome/fontawesome-free-solid/faRecycle';
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle';
import faTrashAlt from '@fortawesome/fontawesome-free-regular/faTrashAlt';
import faLongArrowAltLeft from '@fortawesome/fontawesome-free-solid/faLongArrowAltLeft';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';

library.add(
    faBolt,
    faBurn,
    faCertificate,
    faCloud,
    faGem,
    faCog,
    faTrashAlt,
    faRecycle,
    faInfoCircle,
    faLongArrowAltLeft,
    faPlus,
);

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6874E8',
        accent: '#F1D26A',
        background: '#f8f9fa',
        text: '#1C211F',
        placeholder: '#8A897C',
    },
};
const RootStack = createNativeStackNavigator();
const BreathingStack = createNativeStackNavigator();


function BreathingStackScreen() {
    return (
        <BreathingStack.Navigator>
            <BreathingStack.Screen name="Patterns" component={BreathingHome} options={{headerShown: false}}/>
            <BreathingStack.Screen name="Edit" component={PatternEdit} options={{headerShown: false}}/>
            <BreathingStack.Screen name="Use" component={PatternUse} options={{headerShown: false}}/>
        </BreathingStack.Navigator>
    );
}
function RootStackScreen() {
    return (
        <RootStack.Navigator>
            <RootStack.Screen name="Home" component={HomePage} options={{headerShown: false}}/>
            <RootStack.Screen name="Freewriting" component={Freewriting} options={{headerShown: false}}/>
            <RootStack.Screen name="settings" component={SettingsPage} options={{headerShown: false}}/>
            <RootStack.Screen name="Breathing" component={BreathingStackScreen} options={{headerShown: false}}/>
        </RootStack.Navigator>
    );
}

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
AppRegistry.registerComponent(appName, () => Main);
