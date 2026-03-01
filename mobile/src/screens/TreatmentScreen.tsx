/**
 * TreatmentScreen — Hiển thị phác đồ điều trị
 * TV4: Software Lead
 */
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { fetchTreatment } from "../services/api";

export default function TreatmentScreen({ route }: any) {
  const { diseaseId } = route.params;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchTreatment(diseaseId).then(setData);
  }, [diseaseId]);

  if (!data) return <ActivityIndicator style={{ marginTop: 40 }} color="#2dff7a" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{data.name_vi}</Text>
      <Text style={styles.crop}>Cây trồng: {data.crop}</Text>
      <Text style={styles.sectionHead}>🔬 Triệu chứng</Text>
      <Text style={styles.body}>{data.symptoms}</Text>
      {data.treatment && (
        <>
          <Text style={styles.sectionHead}>💊 Phác đồ điều trị</Text>
          <View style={styles.card}>
            <Row label="Thuốc"       value={data.treatment.medicine} />
            <Row label="Liều lượng"  value={data.treatment.dose_per_ha + " / ha"} />
            <Row label="Thời điểm"   value={data.treatment.timing} />
            <Row label="Số lần phun" value={`Tối đa ${data.treatment.max_applications} lần, cách ${data.treatment.interval_days} ngày`} />
          </View>
        </>
      )}
      <Text style={styles.sectionHead}>🌱 Phòng ngừa</Text>
      <Text style={styles.body}>{data.prevention}</Text>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 6 }}>
      <Text style={{ color: "#8aab94", width: 110, fontSize: 12 }}>{label}:</Text>
      <Text style={{ color: "#d4edd9", flex: 1, fontSize: 12 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#0a0f0d", padding: 20 },
  title:       { fontSize: 20, fontWeight: "800", color: "#2dff7a", marginBottom: 4 },
  crop:        { color: "#8aab94", marginBottom: 16, fontSize: 13 },
  sectionHead: { fontSize: 14, fontWeight: "700", color: "#f5a623", marginTop: 16, marginBottom: 8 },
  body:        { color: "#d4edd9", fontSize: 13, lineHeight: 20 },
  card:        { backgroundColor: "#121e17", borderRadius: 8, padding: 14, borderWidth: 1, borderColor: "#1e3328" },
});
