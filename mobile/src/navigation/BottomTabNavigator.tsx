import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import HomeScreen from '../screens/HomeScreen';
import CropHealthScreen from '../screens/CropHealthScreen';
import WeatherScreen from '../screens/WeatherScreen';
import UAVScreen from '../screens/UAVScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(nextLang);
    };

    const HeaderRight = () => (
        <TouchableOpacity onPress={toggleLanguage} style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>🌐</Text>
            <Text style={{ color: '#00d66a', marginLeft: 6, fontWeight: 'bold', fontSize: 14 }}>{i18n.language.toUpperCase()}</Text>
        </TouchableOpacity>
    );

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#0a1a11',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(30,53,40,0.8)',
                },
                headerTintColor: '#fff',
                headerRight: () => <HeaderRight />,
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 16,
                },
                tabBarStyle: {
                    backgroundColor: '#0a1a11',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(30,53,40,0.8)',
                    height: Platform.OS === 'ios' ? 88 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#00d66a',
                tabBarInactiveTintColor: '#7aad8e',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: t('common.dashboard'),
                    tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🏠</Text>,
                }}
            />
            <Tab.Screen
                name="CropHealth"
                component={CropHealthScreen}
                options={{
                    title: t('common.crop_health'),
                    tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🌿</Text>,
                    tabBarBadge: 3,
                    tabBarBadgeStyle: { backgroundColor: '#ef4444', color: '#fff', fontSize: 10 }
                }}
            />
            <Tab.Screen
                name="Weather"
                component={WeatherScreen}
                options={{
                    title: t('common.weather'),
                    tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>⛅</Text>,
                }}
            />
            <Tab.Screen
                name="UAV"
                component={UAVScreen}
                options={{
                    title: t('common.uav_management'),
                    tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>✈️</Text>,
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
