import * as React from 'react';
import {AppRegistry} from 'react-native';

import HomePage from './app/home/home-page';
import Freewriting from './app/freewriting/freewriting-page';
import SettingsPage from './app/settings/settings-page';
import BreathingHome from './app/breathing/breathing-page';
import PatternModal from './app/breathing/edit/pattern-edit';
import PatternTime from './app/breathing/use/pattern-time';
import PatternUse from './app/breathing/use/pattern-use';

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
import PatternCompleted from './app/breathing/use/pattern-completed';

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


const RootStack = createNativeStackNavigator();

function RootStackScreen() {
    return (
        <RootStack.Navigator>
            <RootStack.Group>
                <RootStack.Screen name="Home" component={HomePage} options={{headerShown: false}}/>
                <RootStack.Screen name="Freewriting" component={Freewriting} options={{headerShown: false}}/>
                <RootStack.Screen name="settings" component={SettingsPage} options={{headerShown: false}}/>
                <RootStack.Screen name="Patterns" component={BreathingHome} options={{headerShown: false}}/>
                <RootStack.Screen name="Use" component={PatternUse} options={{headerShown: false}}/>
                <RootStack.Screen name="Time" component={PatternTime} options={{headerShown: false, animation: "fade", statusBarHidden: true}}/>
                <RootStack.Screen name="Edit" component={PatternModal} options={{headerShown: false, presentation: 'modal'}}/>
                <RootStack.Screen name="Completed" component={PatternCompleted} options={{headerShown: false, animation: "fade"}}/>
            </RootStack.Group>
        </RootStack.Navigator>
    );
}


export default function Main() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <PaperProvider>
                    <NavigationContainer>
                       <RootStackScreen/>
                    </NavigationContainer>
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
}
AppRegistry.registerComponent(appName, () => Main);
