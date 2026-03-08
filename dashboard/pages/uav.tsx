import React, { useState } from 'react'
import Head from 'next/head'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts'
import Layout from '../components/Layout/Layout'
import { mockUAVs, mockFlights, mockAlerts } from '../lib/mockData'

const flightTypeLabel: Record<string, string> = {
    surveillance: 'Giám sát', spraying: 'Phun thuốc', mapping: 'Lập bản đồ'
}
const flightTypeColor: Record<string, string> = {
    surveillance: '#38bdf8', spraying: '#34d399', mapping: '#a78bfa'
}
const statusColor: Record<string, string> = {
    active: '#00d66a', idle: '#7aad8e', charging: '#fbbf24', maintenance: '#f97316'
}
const statusLabel: Record<string, string> = {
    active: 'Đang bay', idle: 'Chờ', charging: 'Sạc pin', maintenance: 'Bảo trì'
}

const areaHistory = [
    { date: '01/03', area: 32 }, { date: '02/03', area: 45 }, { date: '03/03', area: 28 },
    { date: '04/03', area: 56 }, { date: '05/03', area: 48 }, { date: '06/03', area: 38 }, { date: '07/03', area: 64 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="px-3 py-2 rounded-xl text-xs" style={{ background: '#0f1f17', border: '1px solid #1e3528', color: '#e8f5ee' }}>
                <div className="font-semibold mb-1">{label}</div>
                {payload.map((p, i) => <div key={i} style={{ color: p.color ?? '#00d66a' }}>{p.name}: {p.value}</div>)}
            </div>
        )
    }
    return null
}

export default function UAVPage() {
    const [selectedUAV, setSelectedUAV] = useState(mockUAVs[0].id)
    const uav = mockUAVs.find(u => u.id === selectedUAV) ?? mockUAVs[0]
    const uavFlights = mockFlights.filter(f => f.uav_id === selectedUAV)

    const batteryColor = uav.battery > 60 ? '#00d66a' : uav.battery > 30 ? '#fbbf24' : '#ef4444'

    return (
        <>
            <Head><title>UAgriAIV – Trạng thái UAV</title></Head>
            <Layout title="Trạng thái UAV" subtitle="Quản lý & giám sát thiết bị bay" alerts={mockAlerts} onRefresh={() => { }}>

                {/* ── Fleet overview ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {mockUAVs.map(u => (
                        <button key={u.id}
                            onClick={() => setSelectedUAV(u.id)}
                            className="glass-card p-5 text-left transition-all hover:translate-y-[-2px]"
                            style={selectedUAV === u.id ? {
                                border: `1px solid ${statusColor[u.status]}`,
                                boxShadow: `0 0 20px ${statusColor[u.status]}20`,
                            } : {}}>
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="font-semibold text-white text-sm">{u.name}</div>
                                    <div className="text-xs mt-0.5 flex items-center gap-1.5">
                                        <div className="status-dot" style={{ background: statusColor[u.status] }} />
                                        <span style={{ color: statusColor[u.status] }}>{statusLabel[u.status]}</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                    style={{ background: `${statusColor[u.status]}18`, border: `1px solid ${statusColor[u.status]}30` }}>
                                    ✈️
                                </div>
                            </div>
                            {/* Battery bar */}
                            <div className="mb-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span style={{ color: '#7aad8e' }}>Pin</span>
                                    <span className="font-semibold" style={{ color: u.battery > 60 ? '#00d66a' : u.battery > 30 ? '#fbbf24' : '#ef4444' }}>
                                        {u.battery}%
                                    </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e3528' }}>
                                    <div className="h-full rounded-full transition-all"
                                        style={{ width: `${u.battery}%`, background: u.battery > 60 ? '#00d66a' : u.battery > 30 ? '#fbbf24' : '#ef4444' }} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                                <div>
                                    <div style={{ color: '#4d7360' }}>Diện tích</div>
                                    <div className="font-semibold text-white">{u.total_area_scanned.toLocaleString()} ha</div>
                                </div>
                                <div>
                                    <div style={{ color: '#4d7360' }}>Còn lại</div>
                                    <div className="font-semibold text-white">{u.remaining_flight_time} phút</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* ── Selected UAV details ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Metrics */}
                    <div className="glass-card p-5">
                        <h3 className="font-semibold text-white text-sm mb-4">{uav.name} – Chi tiết</h3>
                        <div className="space-y-4">
                            {[
                                { icon: '🔋', label: 'Pin', value: `${uav.battery}%`, color: batteryColor },
                                { icon: '⏱️', label: 'Thời gian bay còn lại', value: `${uav.remaining_flight_time} phút`, color: '#38bdf8' },
                                { icon: '⚡', label: 'Tốc độ bay', value: `${uav.current_speed} km/h`, color: '#a78bfa' },
                                { icon: '📈', label: 'Tốc độ quét', value: `${uav.scan_speed} ha/h`, color: '#00d66a' },
                                { icon: '🗺️', label: 'Tổng diện tích quét', value: `${uav.total_area_scanned.toLocaleString()} ha`, color: '#fbbf24' },
                                {
                                    icon: '📅', label: 'Buổi bay gần nhất',
                                    value: new Date(uav.last_flight).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
                                    color: '#34d399'
                                },
                            ].map(m => (
                                <div key={m.label} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>
                                        <span style={{ fontSize: '14px' }}>{m.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs" style={{ color: '#4d7360' }}>{m.label}</div>
                                        <div className="text-sm font-semibold text-white">{m.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Area scanned history chart */}
                    <div className="lg:col-span-2 glass-card p-5">
                        <h3 className="font-semibold text-white text-sm mb-1">Diện tích quét theo ngày (7 ngày)</h3>
                        <p className="text-xs mb-4" style={{ color: '#4d7360' }}>Tổng toàn đội UAV (ha/ngày)</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={areaHistory} barCategoryGap="35%">
                                <XAxis dataKey="date" tick={{ fill: '#4d7360', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#4d7360', fontSize: 11 }} axisLine={false} tickLine={false} unit=" ha" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="area" name="Diện tích" fill="#00d66a" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── Flight history table ── */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-white text-sm">Lịch sử bay</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#4d7360' }}>
                                {uav.name} – {uavFlights.filter(f => f.status !== 'scheduled').length} chuyến đã hoàn thành
                            </p>
                        </div>
                    </div>

                    {uavFlights.length === 0 ? (
                        <div className="text-center py-8 text-sm" style={{ color: '#4d7360' }}>Chưa có lịch sử bay</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #1e3528' }}>
                                        {['Ngày bay', 'Kiểu bay', 'Thời gian', 'Diện tích', 'Tốc độ TB', 'Trạng thái'].map(h => (
                                            <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold" style={{ color: '#4d7360' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {uavFlights.map(f => (
                                        <tr key={f.id} className="border-b hover:bg-white/3 transition-colors"
                                            style={{ borderColor: '#1e3528' }}>
                                            <td className="py-3 pr-4 text-xs" style={{ color: '#7aad8e' }}>{f.date}</td>
                                            <td className="py-3 pr-4">
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                    style={{ background: `${flightTypeColor[f.flight_type]}15`, color: flightTypeColor[f.flight_type] }}>
                                                    {flightTypeLabel[f.flight_type]}
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4 text-white">{f.duration > 0 ? `${f.duration} phút` : '—'}</td>
                                            <td className="py-3 pr-4 font-semibold text-white">{f.area_covered > 0 ? `${f.area_covered} ha` : '—'}</td>
                                            <td className="py-3 pr-4 text-white">{f.avg_speed > 0 ? `${f.avg_speed} km/h` : '—'}</td>
                                            <td className="py-3">
                                                {f.status === 'completed' && (
                                                    <span className="flex items-center gap-1 text-xs" style={{ color: '#34d399' }}>
                                                        <span style={{ fontSize: '10px' }}>✓</span>Hoàn thành
                                                    </span>
                                                )}
                                                {f.status === 'aborted' && (
                                                    <span className="flex items-center gap-1 text-xs" style={{ color: '#ef4444' }}>
                                                        <span style={{ fontSize: '10px' }}>✗</span>Hủy bỏ
                                                    </span>
                                                )}
                                                {f.status === 'scheduled' && (
                                                    <span className="flex items-center gap-1 text-xs" style={{ color: '#fbbf24' }}>
                                                        <span style={{ fontSize: '10px' }}>📅</span>Đã lên lịch
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Layout>
        </>
    )
}
