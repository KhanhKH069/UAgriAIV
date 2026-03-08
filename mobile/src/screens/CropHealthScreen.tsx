import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const CropHealthScreen = () => {
    const { t } = useTranslation();
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 48 }}>🌿</Text>
                    <Text style={styles.title}>{t('common.crop_health')}</Text>
                    <Text style={styles.subtitle}>{t('dashboard.pest_trend_sub')}</Text>
                </View>

                <View style={styles.emptyCard}>
                    <Text style={{ fontSize: 32 }}>⚠️</Text>
                    <Text style={styles.emptyText}>{t('common.view_all')} ({t('dashboard.uav_state_maintenance')})</Text>
                    <Text style={styles.emptySubtext}>Tính năng đang được phát triển.</Text>
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
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
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
        textAlign: 'center',
    },
    emptyCard: {
        backgroundColor: '#0a1a11',
        borderWidth: 1,
        borderColor: 'rgba(30,53,40,0.8)',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        width: '100%',
    },
    emptyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        color: '#4d7360',
        fontSize: 13,
        textAlign: 'center',
    },
});

export default CropHealthScreen;
