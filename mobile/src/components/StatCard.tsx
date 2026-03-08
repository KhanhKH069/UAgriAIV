import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    change?: number;
    changeLabel?: string;
    glowClass?: string; // used in web but we'll adapt for mobile
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    unit,
    change,
    changeLabel,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {change !== undefined && (
                        <View style={[styles.changeBadge, { backgroundColor: change > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(0,214,106,0.1)' }]}>
                            {change > 0 ? (
                                <Text style={{ fontSize: 12 }}>📈</Text>
                            ) : change < 0 ? (
                                <Text style={{ fontSize: 12 }}>📉</Text>
                            ) : (
                                <Text style={{ fontSize: 12 }}>—</Text>
                            )}
                            <Text style={[styles.changeText, { color: change > 0 ? '#f87171' : '#34d399' }]}>
                                {Math.abs(change)}%
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.value}>
                    {value}
                    {unit && <Text style={styles.unit}> {unit}</Text>}
                </Text>
                {changeLabel && (
                    <Text style={styles.changeLabel}>{changeLabel}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#0a1a11',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(30,53,40,0.8)',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        color: '#7aad8e',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
    },
    changeText: {
        fontSize: 10,
        fontWeight: '600',
        marginLeft: 4,
    },
    body: {
        marginTop: 4,
    },
    value: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '700',
    },
    unit: {
        color: '#4d7360',
        fontSize: 14,
        fontWeight: '500',
    },
    changeLabel: {
        color: '#4d7360',
        fontSize: 11,
        marginTop: 4,
    },
});

export default StatCard;
