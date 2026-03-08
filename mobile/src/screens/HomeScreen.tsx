import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { mockDetections, mockWeather, mockUAVs, mockAlerts } from '../services/mockData';
import { fetchCurrentWeather } from '../services/api';
import { useTranslation } from 'react-i18next';

const HomeScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const [irrigating, setIrrigating] = useState(false);
    const [irrigated, setIrrigated] = useState(false);
    const [weather, setWeather] = useState(mockWeather);

    React.useEffect(() => {
        const getWeatherData = async () => {
            const data = await fetchCurrentWeather();
            if (data && data.temperature) {
                setWeather(data);
            }
        };
        getWeatherData();
    }, []);

    const activeUAVs = mockUAVs.filter(u => u.status === 'active').length;
    const totalDetections = mockDetections.reduce((a, d) => a + d.affected_count, 0);
    const criticalAlerts = mockAlerts.filter(a => !a.resolved && a.severity === 'critical').length;

    const handleIrrigate = () => {
        setIrrigating(true);
        setTimeout(() => { setIrrigating(false); setIrrigated(true); }, 2000);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* ── Active Alerts Banner ── */}
            {criticalAlerts > 0 && (
                <View style={styles.alertBanner}>
                    <Text style={{ fontSize: 20 }}>⚠️</Text>
                    <View style={styles.alertBannerText}>
                        <Text style={styles.alertBannerTitle}>{t('dashboard.critical_alerts', { count: criticalAlerts })}</Text>
                        <Text style={styles.alertBannerDesc} numberOfLines={2}>
                            {mockAlerts.filter(a => !a.resolved && a.severity === 'critical').map(a => a.message).join(' • ')}
                        </Text>
                    </View>
                </View>
            )}

            {/* ── Quick Stats ── */}
            <View style={styles.gridContainer}>
                <View style={styles.gridCo2}>
                    <StatCard title={t('dashboard.total_affected_trees')} value={totalDetections} unit={t('dashboard.unit_tree')} change={12.5} />
                </View>
                <View style={styles.gridCo2}>
                    <StatCard title={t('dashboard.pest_risk')} value={weather.pest_risk_level === 'high' ? t('weather.risk_high') : weather.pest_risk_level === 'medium' ? t('weather.risk_medium') : t('weather.risk_low')} />
                </View>
                <View style={styles.gridCo2}>
                    <StatCard title={t('dashboard.active_uavs')} value={activeUAVs} unit={`/${mockUAVs.length}`} />
                </View>
                <View style={styles.gridCo2}>
                    <StatCard title={t('dashboard.scanned_area')} value={mockUAVs.reduce((a, u) => a + u.total_area_scanned, 0).toLocaleString()} unit={t('dashboard.unit_ha')} change={8.3} />
                </View>
            </View>

            {/* ── Action Buttons ── */}

            <TouchableOpacity
                style={[styles.actionBtn, (irrigating || irrigated) && styles.actionBtnDisabled]}
                onPress={handleIrrigate}
                disabled={irrigating || irrigated}
            >
                <View style={styles.actionIconContainer}>
                    {irrigated ? <Text style={{ fontSize: 24 }}>✓</Text> : <Text style={{ fontSize: 24 }}>💧</Text>}
                </View>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>{t('common.action_irrigate')}</Text>
                    <Text style={styles.actionDesc}>
                        {irrigated ? 'Đã kích hoạt' : irrigating ? 'Đang xử lý...' : 'Kích hoạt toàn bộ khu'}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
                <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(251,191,36,0.15)', borderColor: 'rgba(251,191,36,0.3)' }]}>
                    <Text style={{ fontSize: 24 }}>📄</Text>
                </View>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>{t('common.action_treatment')}</Text>
                    <Text style={styles.actionDesc}>{t('common.action_treatment_desc')}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('CropHealth')}>
                <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(167,139,250,0.15)', borderColor: 'rgba(167,139,250,0.3)' }]}>
                    <Text style={{ fontSize: 24 }}>🧪</Text>
                </View>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>{t('common.action_medicine')}</Text>
                    <Text style={styles.actionDesc}>{t('common.action_medicine_sub')}</Text>
                </View>
            </TouchableOpacity>

            {/* ── Recent Detections ── */}
            <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>{t('common.recent_detections')}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CropHealth')}>
                    <Text style={styles.linkText}>{t('common.view_all')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                {mockDetections.slice(0, 3).map((d, index) => (
                    <View key={d.id} style={[styles.listItem, index === 2 && { borderBottomWidth: 0 }]}>
                        <View style={styles.listIconContainer}>
                            <Text style={{ fontSize: 16 }}>⚠️</Text>
                        </View>
                        <View style={styles.listTextContainer}>
                            <Text style={styles.listTitle}>{d.pest_type}</Text>
                            <Text style={styles.listSub}>{d.field_zone} • {d.affected_count} {t('dashboard.unit_tree')}</Text>
                        </View>
                        <Badge severity={d.severity} />
                    </View>
                ))}
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
    alertBanner: {
        flexDirection: 'row',
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.25)',
        borderRadius: 16,
        padding: 12,
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    alertBannerText: {
        marginLeft: 12,
        flex: 1,
    },
    alertBannerTitle: {
        color: '#xffffff',
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 4,
    },
    alertBannerDesc: {
        color: '#f87171',
        fontSize: 12,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridCo2: {
        width: '48%',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 8,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    linkText: {
        color: '#00d66a',
        fontSize: 13,
        fontWeight: '600',
    },
    actionBtn: {
        flexDirection: 'row',
        backgroundColor: '#0a1a11',
        borderWidth: 1,
        borderColor: 'rgba(30,53,40,0.8)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    actionBtnDisabled: {
        opacity: 0.7,
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(56,189,248,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(56,189,248,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    actionDesc: {
        color: '#7aad8e',
        fontSize: 12,
    },
    card: {
        backgroundColor: '#0a1a11',
        borderWidth: 1,
        borderColor: 'rgba(30,53,40,0.8)',
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1e3528',
    },
    listIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: 'rgba(239,68,68,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    listTextContainer: {
        flex: 1,
    },
    listTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    listSub: {
        color: '#4d7360',
        fontSize: 12,
        marginTop: 2,
    },
});

export default HomeScreen;
