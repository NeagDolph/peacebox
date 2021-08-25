import * as React from 'react';
import {AppRegistry, Text} from 'react-native';
import HomePage from './app/home/home-page';
import Freewriting from './app/freewriting/freewriting-page';
import {name as appName} from './app.json';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Provider as StoreProvider} from 'react-redux';
import store from './app/store';

import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faBolt,
    faBrain,
    faBurn,
    faCertificate,
    faCloud,
    faGem,
    faPrayingHands,
    faCog,
} from '@fortawesome/free-solid-svg-icons';


library.add(
    faBolt,
    faBrain,
    faBurn,
    faCertificate,
    faCloud,
    faGem,
    faPrayingHands,
    faCog,
);

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6874E8',
        accent: '#F1D26A',
        background: '#E8F0FF',
        text: '#1C211F',
        placeholder: '#8A897C',
    },
};


const Stack = createNativeStackNavigator();

export default function Main() {
    return (
        <StoreProvider store={store}>
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Home" component={HomePage} options={{headerShown: false}}/>
                        <Stack.Screen name="Freewriting" component={Freewriting}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </StoreProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
