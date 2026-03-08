import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import './src/locales'; // initialize i18next
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { StatusBar } from 'react-native';

const App = () => {
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#060d0a" />
            <BottomTabNavigator />
        </NavigationContainer>
    );
};

export default App;
