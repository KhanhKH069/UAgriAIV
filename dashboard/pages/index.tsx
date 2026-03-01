/**
 * Dashboard Home — Tổng quan hệ thống
 * TV4: Software Lead
 */
import { useEffect, useState } from "react";

interface Stats { totalFlights: number; totalDetections: number; highSeverity: number; }

export default function Home() {
  const [stats, setStats] = useState<Stats>({ totalFlights: 0, totalDetections: 0, highSeverity: 0 });

  useEffect(() => {
    // TODO: fetch từ backend
  }, []);

  return (
    <main style={{ background: "#0a0f0d", minHeight: "100vh", color: "#d4edd9", fontFamily: "monospace", padding: 32 }}>
      <h1 style={{ color: "#2dff7a", letterSpacing: 3, fontSize: 18 }}>🛸 UAV AI CROP DISEASE — DASHBOARD</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, margin: "24px 0" }}>
        <StatCard label="Tổng buổi bay"    value={stats.totalFlights}    color="#2dff7a" />
        <StatCard label="Phát hiện bệnh"   value={stats.totalDetections} color="#f5a623" />
        <StatCard label="Mức độ cao"        value={stats.highSeverity}    color="#ff4757" />
      </div>

      <div style={{ background: "#121e17", border: "1px solid #1e3328", borderRadius: 4, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#4a6b58" }}>[ GPS Heatmap — Mapbox/Leaflet component here ]</span>
      </div>
    </main>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: "#121e17", border: `1px solid #1e3328`, borderRadius: 4, padding: 20 }}>
      <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#4a6b58", letterSpacing: 1, marginTop: 4 }}>{label.toUpperCase()}</div>
    </div>
  );
}
