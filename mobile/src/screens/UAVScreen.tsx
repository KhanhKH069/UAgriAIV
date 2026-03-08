import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { mockUAVs } from '../services/mockData';
import { useTranslation } from 'react-i18next';

const UAVScreen = () => {
    const { t } = useTranslation();
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 48 }}>✈️</Text>
                    <Text style={styles.title}>{t('common.uav_management')}</Text>
                    <Text style={styles.subtitle}>{t('dashboard.uav_status')}</Text>
                </View>

                <Text style={styles.sectionTitle}>{t('dashboard.active_uavs')}</Text>

                {mockUAVs.map(uav => {
                    const statusColor = uav.status === 'active' ? '#00d66a' : uav.status === 'charging' ? '#fbbf24' : '#7aad8e';
                    const statusLabel = { active: t('dashboard.uav_state_active'), idle: t('dashboard.uav_state_idle'), charging: t('dashboard.uav_state_charging'), maintenance: t('dashboard.uav_state_maintenance') }[uav.status] || 'Không xác định';

                    return (
                        <View key={uav.id} style={styles.uavCard}>
                            <View style={styles.uavHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: `${statusColor}18`, borderColor: `${statusColor}30` }]}>
                                    <Text style={{ fontSize: 20 }}>✈️</Text>
                                    {uav.status === 'active' && <View style={[styles.activeDot, { backgroundColor: statusColor }]} />}
                                </View>
                                <View style={styles.uavTitleContainer}>
                                    <Text style={styles.uavName}>{uav.name}</Text>
                                    <Text style={styles.uavStatus}>{statusLabel} • Pin: {uav.battery}%</Text>
                                </View>
                            </View>

                            <View style={styles.statsGrid}>
                                <View style={styles.statsCol}>
                                    <Text style={styles.statLabel}>{t('dashboard.scanned_area')}</Text>
                                    <Text style={styles.statValue}>{uav.total_area_scanned.toLocaleString()} <Text style={styles.unit}>{t('dashboard.unit_ha')}</Text></Text>
                                </View>
                                <View style={styles.statsCol}>
                                    <Text style={styles.statLabel}>{t('weather.wind')}</Text>
                                    <Text style={styles.statValue}>{uav.current_speed} <Text style={styles.unit}>km/h</Text></Text>
                                </View>
                                <View style={styles.statsCol}>
                                    <Text style={styles.statLabel}>{t('dashboard.subtitle')}</Text>
                                    <Text style={styles.statValue}>{uav.remaining_flight_time} <Text style={styles.unit}>min</Text></Text>
                                </View>
                            </View>
                        </View>
                    );
                })}

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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    uavCard: {
        backgroundColor: '#0a1a11',
        borderWidth: 1,
        borderColor: 'rgba(30,53,40,0.8)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    uavHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1e3528',
        paddingBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        position: 'relative',
    },
    activeDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#0a1a11',
    },
    uavTitleContainer: {
        flex: 1,
    },
    uavName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    uavStatus: {
        color: '#4d7360',
        fontSize: 13,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsCol: {
        flex: 1,
    },
    statLabel: {
        color: '#7aad8e',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    unit: {
        fontSize: 12,
        color: '#4d7360',
        fontWeight: 'normal',
    },
});

export default UAVScreen;
