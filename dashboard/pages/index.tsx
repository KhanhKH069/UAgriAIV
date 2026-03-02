/**
 * Dashboard Home — Tổng quan hệ thống
 * TV4: Software Lead
 * Run: npm run dev → http://localhost:3000
 */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

interface Stats {
  totalFlights:    number;
  totalDetections: number;
  highSeverity:    number;
}

export default function Home() {
  const [stats,   setStats]   = useState<Stats>({ totalFlights: 0, totalDetections: 0, highSeverity: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/flights/`),
      axios.get(`${API}/detections/`),
    ])
      .then(([flights, dets]) => {
        setStats({
          totalFlights:    flights.data.total   ?? 0,
          totalDetections: dets.data.total      ?? 0,
          highSeverity:    0,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0f0d] text-[#d4edd9] p-8 font-mono">
      <h1 className="text-[#2dff7a] text-lg tracking-widest mb-6">
        🛸 UAgriAIV — DASHBOARD
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Buổi bay"      value={stats.totalFlights}    color="text-[#2dff7a]" />
        <StatCard label="Phát hiện bệnh" value={stats.totalDetections} color="text-[#f5a623]" />
        <StatCard label="Mức độ cao"     value={stats.highSeverity}    color="text-[#ff4757]" />
      </div>

      {/* Map placeholder */}
      <div className="bg-[#121e17] border border-[#1e3328] rounded h-96 flex items-center justify-center">
        <span className="text-[#4a6b58] text-sm">
          [ GPS Heatmap — import MapContainer from react-leaflet here ]
        </span>
      </div>
    </main>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#121e17] border border-[#1e3328] rounded p-5">
      <div className={`text-4xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-[#4a6b58] tracking-widest mt-1">{label.toUpperCase()}</div>
    </div>
  );
}
