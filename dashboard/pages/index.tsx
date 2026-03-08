import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import Layout from '../components/Layout/Layout'
import StatCard from '../components/UI/StatCard'
import Badge from '../components/UI/Badge'
import { mockDetections, mockWeather, mockUAVs, mockAlerts } from '../lib/mockData'
import { useTranslation } from 'react-i18next'

const weeklyPestData = [
    { day: 'T2', count: 120 }, { day: 'T3', count: 180 }, { day: 'T4', count: 145 },
    { day: 'T5', count: 210 }, { day: 'T6', count: 190 }, { day: 'T7', count: 234 }, { day: 'CN', count: 200 },
]
const pestTypeData = [
    { name: 'Đạo ôn', value: 45, color: '#ef4444' },
    { name: 'Sâu đục thân', value: 25, color: '#f97316' },
    { name: 'Sương mai', value: 18, color: '#fbbf24' },
    { name: 'Khảm lá', value: 12, color: '#34d399' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="px-3 py-2 rounded-xl text-xs" style={{ background: '#0f1f17', border: '1px solid #1e3528', color: '#e8f5ee' }}>
                <div className="font-semibold mb-1">{label}</div>
                {payload.map((p, i) => (
                    <div key={i} style={{ color: p.color ?? '#00d66a' }}>{p.name ?? p.dataKey}: {p.value}</div>
                ))}
            </div>
        )
    }
    return null
}

export default function DashboardPage() {
    const { t } = useTranslation()
    const [irrigating, setIrrigating] = useState(false)
    const [irrigated, setIrrigated] = useState(false)
    const [timeStr, setTimeStr] = useState('')

    const [weather, setWeather] = useState(mockWeather)

    useEffect(() => {
        setTimeStr(new Date().toLocaleString('vi-VN'))

        // Fetch real weather data
        fetch('http://localhost:8000/api/weather/current')
            .then(res => res.json())
            .then(data => {
                if (data && data.temperature) setWeather(data)
            })
            .catch(err => console.error("Lỗi lấy dữ liệu thời tiết:", err))
    }, [])
    const [showTreatment, setShowTreatment] = useState(false)

    const activeUAVs = mockUAVs.filter(u => u.status === 'active').length
    const totalDetections = mockDetections.reduce((a, d) => a + d.affected_count, 0)
    const criticalAlerts = mockAlerts.filter(a => !a.resolved && a.severity === 'critical').length

    const handleIrrigate = () => {
        setIrrigating(true)
        setTimeout(() => { setIrrigating(false); setIrrigated(true) }, 2000)
    }

    return (
        <>
            <Head>
                <title>UAgriAIV – Tổng quan</title>
                <meta name="description" content="Nền tảng quản lý nông nghiệp thông minh" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Layout title={t('dashboard.title')} subtitle={`${t('dashboard.subtitle')}: ${timeStr}`} alerts={mockAlerts} onRefresh={() => { }}>

                {/* ── Active Alerts Banner ── */}
                {criticalAlerts > 0 && (
                    <div className="mb-6 px-4 py-3 rounded-2xl flex items-start gap-3"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                        <div>
                            <p className="text-sm font-semibold text-white">{t('dashboard.critical_alerts', { count: criticalAlerts })}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#f87171' }}>
                                {mockAlerts.filter(a => !a.resolved && a.severity === 'critical').map(a => a.message).join(' • ')}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Quick Stats ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard title={t('dashboard.total_affected_trees')} value={totalDetections} unit={t('dashboard.unit_tree')} change={12.5} changeLabel="vs tuần trước" glowClass="glow-red" />
                    <StatCard title={t('dashboard.pest_risk')} value={weather.pest_risk_level === 'high' ? t('weather.risk_high') : weather.pest_risk_level === 'medium' ? t('weather.risk_medium') : t('weather.risk_low')} glowClass={weather.pest_risk_level === 'high' ? 'glow-red' : weather.pest_risk_level === 'medium' ? 'glow-amber' : ''} />
                    <StatCard title={t('dashboard.active_uavs')} value={activeUAVs} unit={`/${mockUAVs.length}`} />
                    <StatCard title={t('dashboard.scanned_area')} value={mockUAVs.reduce((a, u) => a + u.total_area_scanned, 0).toLocaleString()} unit={t('dashboard.unit_ha')} change={8.3} changeLabel="tuần này" />
                </div>

                {/* ── Action Buttons ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Irrigation */}
                    <button
                        onClick={handleIrrigate}
                        disabled={irrigating || irrigated}
                        className="action-btn p-5 text-left w-full disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div>
                                <div className="font-semibold text-white text-sm">{t('common.action_irrigate')}</div>
                                <div className="text-xs" style={{ color: '#7aad8e' }}>
                                    {irrigated ? 'Đã kích hoạt' : irrigating ? 'Đang xử lý...' : 'Kích hoạt toàn bộ khu'}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs leading-relaxed" style={{ color: '#4d7360' }}>
                            {t('common.action_irrigate_desc')}
                        </div>
                        {irrigating && (
                            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e3528' }}>
                                <div className="h-full rounded-full animate-pulse" style={{ width: '60%', background: '#38bdf8' }} />
                            </div>
                        )}
                    </button>

                    {/* Treatment Plan */}
                    <button onClick={() => setShowTreatment(true)} className="action-btn p-5 text-left w-full">
                        <div className="flex items-center gap-3 mb-3">
                            <div>
                                <div className="font-semibold text-white text-sm">{t('common.action_treatment')}</div>
                                <div className="text-xs" style={{ color: '#7aad8e' }}>Tạo kế hoạch xử lý</div>
                            </div>
                        </div>
                        <div className="text-xs leading-relaxed" style={{ color: '#4d7360' }}>
                            {t('common.action_treatment_desc')}
                        </div>
                    </button>

                    {/* Medicine Suggestion */}
                    <Link href="/crop-health" className="action-btn p-5 text-left block">
                        <div className="flex items-center gap-3 mb-3">
                            <div>
                                <div className="font-semibold text-white text-sm">{t('common.action_medicine')}</div>
                                <div className="text-xs" style={{ color: '#7aad8e' }}>{t('common.action_medicine_desc')}</div>
                            </div>
                        </div>
                        <div className="text-xs leading-relaxed" style={{ color: '#4d7360' }}>
                            {t('common.action_medicine_sub')}
                        </div>
                    </Link>
                </div>

                {/* ── Charts Row ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Pest trend */}
                    <div className="lg:col-span-2 glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-white text-sm">{t('dashboard.pest_trend_7d')}</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#4d7360' }}>{t('dashboard.pest_trend_sub')}</p>
                            </div>
                            <div className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                                ↑ 12%
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={weeklyPestData}>
                                <defs>
                                    <linearGradient id="pg1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" tick={{ fill: '#4d7360', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#4d7360', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="count" name="Số cây" stroke="#ef4444" strokeWidth={2} fill="url(#pg1)" dot={{ fill: '#ef4444', r: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pest type pie */}
                    <div className="glass-card p-5">
                        <h3 className="font-semibold text-white text-sm mb-1">{t('dashboard.pest_type_dist')}</h3>
                        <p className="text-xs mb-4" style={{ color: '#4d7360' }}>{t('dashboard.pest_type_sub')}</p>
                        <ResponsiveContainer width="100%" height={140}>
                            <PieChart>
                                <Pie data={pestTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                                    {pestTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-1.5 mt-2">
                            {pestTypeData.map(d => (
                                <div key={d.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                        <span style={{ color: '#7aad8e' }}>{d.name}</span>
                                    </div>
                                    <span className="font-medium text-white">{d.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Bottom row: recent detections + UAV quick status ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Recent detections */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white text-sm">{t('common.recent_detections')}</h3>
                            <Link href="/crop-health" className="text-xs" style={{ color: '#00d66a' }}>{t('common.view_all')} →</Link>
                        </div>
                        <div className="space-y-3">
                            {mockDetections.slice(0, 4).map(d => (
                                <div key={d.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: '#1e3528' }}>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative" style={{ background: 'rgba(239,68,68,0.1)' }}>
                                        {d.image_url ? (
                                            <img src={d.image_url} alt={d.pest_type} className="w-full h-full object-cover" />
                                        ) : (
                                            <span style={{ fontSize: '10px', color: '#ef4444' }}>⚠️</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white truncate">{d.pest_type}</div>
                                        <div className="text-xs" style={{ color: '#4d7360' }}>{d.field_zone} • {d.affected_count} cây</div>
                                    </div>
                                    <Badge severity={d.severity} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* UAV quick status */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white text-sm">{t('dashboard.uav_status')}</h3>
                            <Link href="/uav" className="text-xs" style={{ color: '#00d66a' }}>{t('dashboard.uav_details')}</Link>
                        </div>
                        <div className="space-y-3">
                            {mockUAVs.map(uav => {
                                const statusColor = uav.status === 'active' ? '#00d66a' : uav.status === 'charging' ? '#fbbf24' : '#7aad8e'
                                const statusLabel = uav.status === 'active' ? t('dashboard.uav_state_active') : uav.status === 'charging' ? t('dashboard.uav_state_charging') : uav.status === 'idle' ? t('dashboard.uav_state_idle') : t('dashboard.uav_state_maintenance')
                                return (
                                    <div key={uav.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: '#1e3528' }}>
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: `${statusColor}18`, border: `1px solid ${statusColor}30`, color: statusColor }}>
                                                ✈️
                                            </div>
                                            {uav.status === 'active' && <div className="status-dot absolute -top-0.5 -right-0.5" style={{ background: statusColor }} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-white">{uav.name}</div>
                                            <div className="text-xs" style={{ color: '#4d7360' }}>{statusLabel} • Pin: {uav.battery}%</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-white">{uav.total_area_scanned.toLocaleString()}</div>
                                            <div className="text-xs" style={{ color: '#4d7360' }}>ha</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Treatment Plan Modal ── */}
                {showTreatment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setShowTreatment(false)}
                    >
                        <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-white mb-1">Phác đồ điều trị</h2>
                            <p className="text-xs mb-4" style={{ color: '#4d7360' }}>Dựa trên phân tích AI • Đạo ôn – Nghiêm trọng</p>
                            <div className="space-y-3">
                                {[
                                    { name: 'Tricyclazole 75%WP', dosage: '1g/L nước', freq: '2 lần/tuần', cost: 400000 },
                                    { name: 'Isoprothiolane 40%EC', dosage: '1.5ml/L nước', freq: '1 lần/tuần', cost: 300000 },
                                ].map(m => (
                                    <div key={m.name} className="p-3 rounded-xl" style={{ background: '#1a2e22', border: '1px solid #1e3528' }}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="text-sm font-semibold text-white">{m.name}</div>
                                                <div className="text-xs mt-1" style={{ color: '#7aad8e' }}>Liều: {m.dosage} · {m.freq}</div>
                                            </div>
                                            <div className="text-xs font-medium text-right" style={{ color: '#fbbf24' }}>
                                                {m.cost.toLocaleString('vi-VN')}đ/ha
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(0,214,106,0.06)', border: '1px solid rgba(0,214,106,0.15)' }}>
                                <div className="text-xs font-medium" style={{ color: '#34d399' }}>Phương pháp phun: UAV Spraying</div>
                                <div className="text-xs mt-1" style={{ color: '#4d7360' }}>Khu vực: Khu A, Khu B · Hiệu quả ước tính: 92%</div>
                            </div>
                            <button onClick={() => setShowTreatment(false)}
                                className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #00d66a, #00884a)' }}>
                                Áp dụng phác đồ
                            </button>
                        </div>
                    </div>
                )}
            </Layout>
        </>
    )
}
