import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
    severity: 'low' | 'medium' | 'high' | 'critical' | string;
}

const Badge: React.FC<BadgeProps> = ({ severity }) => {
    let bgColor = 'rgba(156,163,175,0.1)';
    let color = '#9ca3af';
    let label = severity;

    switch (severity) {
        case 'low':
            bgColor = 'rgba(52,211,153,0.1)';
            color = '#34d399';
            label = 'Thấp';
            break;
        case 'medium':
            bgColor = 'rgba(251,191,36,0.1)';
            color = '#fbbf24';
            label = 'TB';
            break;
        case 'high':
            bgColor = 'rgba(249,115,22,0.1)';
            color = '#f97316';
            label = 'Cao';
            break;
        case 'critical':
            bgColor = 'rgba(239,68,68,0.1)';
            color = '#f87171';
            label = 'Nghiêm trọng';
            break;
    }

    return (
        <View style={[styles.badge, { backgroundColor: bgColor, borderColor: color + '40' }]}>
            <Text style={[styles.text, { color }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 10,
        fontWeight: '700',
    },
});

export default Badge;
