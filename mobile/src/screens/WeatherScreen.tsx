import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import StatCard from '../components/StatCard';
import { mockWeather } from '../services/mockData';
import { fetchCurrentWeather } from '../services/api';
import { useTranslation } from 'react-i18next';

const WeatherScreen = () => {
    const { t } = useTranslation();
    const [weather, setWeather] = React.useState(mockWeather);

    React.useEffect(() => {
        const getWeatherData = async () => {
            const data = await fetchCurrentWeather();
            if (data && data.temperature) {
                setWeather(data);
            }
        };
        getWeatherData();
    }, []);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 48 }}>⛅</Text>
                    <Text style={styles.title}>{t('weather.title')}</Text>
                    <Text style={styles.subtitle}>{t('dashboard.subtitle')} {weather.timestamp ? new Date(weather.timestamp).toLocaleTimeString('vi-VN') : new Date().toLocaleTimeString('vi-VN')}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t('weather.current_weather')}</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statsCol}>
                            <Text style={styles.statLabel}>{t('weather.current_weather').split(' ')[0]}</Text>
                            <Text style={styles.statValue}>{weather.temperature}°C</Text>
                        </View>
                        <View style={styles.statsCol}>
                            <Text style={styles.statLabel}>{t('weather.humidity')}</Text>
                            <Text style={styles.statValue}>{weather.humidity}%</Text>
                        </View>
                        <View style={styles.statsCol}>
                            <Text style={styles.statLabel}>{t('weather.wind')}</Text>
                            <Text style={styles.statValue}>{weather.wind_speed} km/h</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t('weather.soil_conditions')}</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statsCol}>
                            <Text style={styles.statLabel}>{t('weather.soil_moisture')}</Text>
                            <Text style={styles.statValue}>{weather.soil_moisture || 68}%</Text>
                        </View>
                        <View style={styles.statsCol}>
                            <Text style={styles.statLabel}>{t('weather.soil_ph')}</Text>
                            <Text style={styles.statValue}>{weather.soil_ph || 6.2}</Text>
                        </View>
                        <View style={styles.statsCol}>
                            <Text style={styles.statLabel}>{t('weather.soil_temp')}</Text>
                            <Text style={styles.statValue}>{weather.soil_temp || 26.3}°C</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.warningCard}>
                    <Text style={styles.warningTitle}>{t('weather.pest_alert_title')}</Text>
                    <Text style={styles.warningText}>{weather.pest_risk_reason}</Text>
                </View>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#060d0a',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 16,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        color: '#7aad8e',
        fontSize: 14,
    },
    card: {
        backgroundColor: '#0a1a11',
        borderWidth: 1,
        borderColor: 'rgba(30,53,40,0.8)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsCol: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        color: '#7aad8e',
        fontSize: 13,
        marginBottom: 8,
    },
    statValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    warningCard: {
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.25)',
        borderRadius: 16,
        padding: 16,
    },
    warningTitle: {
        color: '#f87171',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    warningText: {
        color: '#ffb3b3',
        fontSize: 13,
        lineHeight: 20,
    },
});

export default WeatherScreen;
