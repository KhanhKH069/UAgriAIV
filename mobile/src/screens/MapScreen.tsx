/**
 * MapScreen — Bản đồ GPS Heatmap bệnh cây realtime
 * TV4: Software Lead
 */
import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity,
} from "react-native";
import MapView, { Heatmap, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { fetchHeatmap, fetchRecentAlerts } from "../services/api";

type HeatPoint = { lat: number; lng: number; weight: number; disease: string; severity: string };
type Alert     = { id: string; disease_name: string; severity: string; timestamp: string; lat: number; lng: number };

const SEVERITY_COLOR: Record<string, string> = {
  high:   "#FF3B30",
  medium: "#FF9500",
  low:    "#FFCC00",
  none:   "#34C759",
};

export default function MapScreen({ navigation }: any) {
  const [points,  setPoints]  = useState<HeatPoint[]>([]);
  const [alerts,  setAlerts]  = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [heatmapData, alertData] = await Promise.all([fetchHeatmap(), fetchRecentAlerts()]);
      setPoints(heatmapData);
      setAlerts(alertData);
    } catch (e) {
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{ latitude: 21.0285, longitude: 105.8542, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      >
        {points.length > 0 && (
          <Heatmap
            points={points.map(p => ({ latitude: p.lat, longitude: p.lng, weight: p.weight }))}
            radius={30}
            opacity={0.7}
          />
        )}
        {alerts.map(a => (
          <Marker
            key={a.id}
            coordinate={{ latitude: a.lat, longitude: a.lng }}
            pinColor={SEVERITY_COLOR[a.severity] ?? "#888"}
            title={a.disease_name}
            description={a.severity.toUpperCase()}
          />
        ))}
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>⚠️ Cảnh báo gần nhất</Text>
        {loading ? (
          <ActivityIndicator color="#2dff7a" />
        ) : (
          <FlatList
            data={alerts.slice(0, 5)}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.alertItem, { borderLeftColor: SEVERITY_COLOR[item.severity] }]}
                onPress={() => navigation.navigate("Treatment", { diseaseId: item.disease_name })}
              >
                <Text style={styles.alertDisease}>{item.disease_name}</Text>
                <Text style={styles.alertMeta}>
                  {item.severity.toUpperCase()} · {new Date(item.timestamp).toLocaleTimeString("vi-VN")}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  map:          { flex: 1 },
  panel:        { maxHeight: 220, backgroundColor: "#0f1a14", paddingHorizontal: 16, paddingTop: 10 },
  panelTitle:   { color: "#2dff7a", fontWeight: "700", marginBottom: 8, fontSize: 13 },
  alertItem:    { borderLeftWidth: 3, paddingLeft: 10, marginBottom: 8 },
  alertDisease: { color: "#d4edd9", fontWeight: "600", fontSize: 13 },
  alertMeta:    { color: "#8aab94", fontSize: 11, marginTop: 2 },
});
