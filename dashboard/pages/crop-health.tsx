import React, { useState } from 'react'
import Head from 'next/head'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import Layout from '../components/Layout/Layout'
import Badge from '../components/UI/Badge'
import { mockDetections, mockAlerts } from '../lib/mockData'
import { useTranslation } from 'react-i18next'

const severityFilter = (t: any) => [t('common.all'), 'critical', 'high', 'medium', 'low']
const pestZoneData = (t: any) => [
    { zone: `${t('common.zone')} A`, [t('common.disease_blast')]: 234, [t('common.disease_stem_borer')]: 45, [t('common.disease_downy_mildew')]: 12 },
    { zone: `${t('common.zone')} B`, [t('common.disease_blast')]: 89, [t('common.disease_stem_borer')]: 30, [t('common.disease_downy_mildew')]: 8 },
    { zone: `${t('common.zone')} C`, [t('common.disease_blast')]: 45, [t('common.disease_stem_borer')]: 18, [t('common.disease_downy_mildew')]: 25 },
    { zone: `${t('common.zone')} D`, [t('common.disease_blast')]: 12, [t('common.disease_stem_borer')]: 5, [t('common.disease_downy_mildew')]: 3 },
]
const radarData = [
    { subject: 'Mật độ', A: 85 },
    { subject: 'Tốc độ lây', A: 70 },
    { subject: 'Kháng thuốc', A: 40 },
    { subject: 'Lan rộng', A: 60 },
    { subject: 'Nguy hiểm', A: 90 },
]
const medicines = [
    { name: 'Tricyclazole 75%WP', target: 'Đạo ôn', dosage: '1g/L', cost: 400000, effectiveness: 92 },
    { name: 'Fipronil 5%SC', target: 'Sâu đục thân', dosage: '1ml/L', cost: 280000, effectiveness: 88 },
    { name: 'Mancozeb 80%WP', target: 'Sương mai', dosage: '2.5g/L', cost: 380000, effectiveness: 89 },
    { name: 'Dinotefuran 20%WP', target: 'Khảm lá', dosage: '1g/L', cost: 480000, effectiveness: 75 },
    { name: 'Kasugamycin 2L', target: 'Héo xanh', dosage: '2ml/L', cost: 500000, effectiveness: 60 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="px-3 py-2 rounded-xl text-xs" style={{ background: '#0f1f17', border: '1px solid #1e3528', color: '#e8f5ee' }}>
                <div className="font-semibold mb-1">{label}</div>
                {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
            </div>
        )
    }
    return null
}

export default function CropHealthPage() {
    const { t } = useTranslation()
    const [filter, setFilter] = useState(t('common.all'))
    const [selectedPest, setSelectedPest] = useState(null)
    const [showMedicine, setShowMedicine] = useState(false)
    const [showPlan, setShowPlan] = useState(false)

    const filtered = filter === t('common.all') ? mockDetections : mockDetections.filter(d => d.severity === filter)

    return (
        <>
            <Head><title>UAgriAIV – {t('common.crop_health')}</title></Head>
            <Layout title={t('common.crop_health')} subtitle="Crop Health Status" alerts={mockAlerts} onRefresh={() => { }}>

                {/* ── Summary stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: t('crop_health.total_infected'), value: mockDetections.reduce((a, d) => a + d.affected_count, 0), color: '#ef4444' },
                        { label: t('crop_health.critical'), value: mockDetections.filter(d => d.severity === 'critical').length, color: '#f97316' },
                        { label: t('crop_health.pest_types'), value: [...new Set(mockDetections.map(d => d.pest_type))].length, color: '#fbbf24' },
                        { label: t('crop_health.affected_zones'), value: [...new Set(mockDetections.map(d => d.field_zone))].length, color: '#a78bfa' },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-4">
                            <div className="text-xs mb-2" style={{ color: '#7aad8e' }}>{s.label}</div>
                            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* ── Action row ── */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button onClick={() => setShowPlan(true)} className="action-btn px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-white">
                        <span style={{ fontSize: '15px' }}>📝</span> {t('common.action_treatment')}
                    </button>
                    <button onClick={() => setShowMedicine(true)} className="action-btn px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-white">
                        <span style={{ fontSize: '15px' }}>🧪</span> {t('common.action_medicine')}
                    </button>
                    <button className="action-btn px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-white">
                        <span style={{ fontSize: '15px' }}>📊</span> {t('crop_health.export_report')}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Bar chart by zone */}
                    <div className="lg:col-span-2 glass-card p-5">
                        <h3 className="font-semibold text-white text-sm mb-1">{t('crop_health.distribution')}</h3>
                        <p className="text-xs mb-4" style={{ color: '#4d7360' }}>{t('crop_health.distribution_sub')}</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={pestZoneData(t)} barCategoryGap="20%">
                                <XAxis dataKey="zone" tick={{ fill: '#4d7360', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#4d7360', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="Đạo ôn" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Sâu đục thân" fill="#f97316" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Sương mai" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="flex gap-4 mt-2">
                            {[['Đạo ôn', '#ef4444'], ['Sâu đục thân', '#f97316'], ['Sương mai', '#fbbf24']].map(([n, c]) => (
                                <div key={n} className="flex items-center gap-1.5 text-xs" style={{ color: '#7aad8e' }}>
                                    <div className="w-2 h-2 rounded-sm" style={{ background: c }} />{n}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Radar chart – Rầy nâu danger profile */}
                    <div className="glass-card p-5">
                        <h3 className="font-semibold text-white text-sm mb-1">{t('crop_health.danger_profile')}</h3>
                        <p className="text-xs mb-2" style={{ color: '#4d7360' }}>{t('crop_health.danger_profile_sub')}</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#1e3528" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#7aad8e', fontSize: 10 }} />
                                <Radar name="Score" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.18} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── Detection list ── */}
                <div className="glass-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h3 className="font-semibold text-white text-sm">{t('crop_health.detection_list')}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Filter */}
                            <div className="flex gap-1">
                                {severityFilter(t).map(f => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        className="text-xs px-2.5 py-1 rounded-lg transition-all font-medium"
                                        style={{
                                            background: filter === f ? 'rgba(0,214,106,0.15)' : 'rgba(30,53,40,0.4)',
                                            color: filter === f ? '#00d66a' : '#7aad8e',
                                            border: `1px solid ${filter === f ? 'rgba(0,214,106,0.3)' : 'transparent'}`,
                                        }}>
                                        {f === 'critical' ? t('common.severity_critical') : f === 'high' ? t('common.severity_high') : f === 'medium' ? t('common.severity_medium') : f === 'low' ? t('common.severity_low') : f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #1e3528' }}>
                                    {[t('common.time'), t('common.pest_type'), t('common.area'), t('common.tree_count'), t('common.severity'), t('common.confidence')].map(h => (
                                        <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold" style={{ color: '#4d7360' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(d => (
                                    <tr key={d.id} className="border-b transition-colors hover:bg-white/3 cursor-pointer"
                                        style={{ borderColor: '#1e3528' }}
                                        onClick={() => setSelectedPest(d)}>
                                        <td className="py-3 pr-4 text-xs" style={{ color: '#7aad8e' }}>
                                            {new Date(d.timestamp).toLocaleTimeString('vi-VN')}
                                        </td>
                                        <td className="py-3 pr-4 font-medium text-white">
                                            <div className="flex items-center gap-2">
                                                {d.image_url && <img src={d.image_url} alt={d.pest_type} className="w-8 h-8 rounded-md object-cover border" style={{ borderColor: '#1e3528' }} />}
                                                {d.pest_type}
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="flex items-center gap-1 text-xs" style={{ color: '#7aad8e' }}>
                                                📍{d.field_zone}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 font-semibold text-white">{d.affected_count}</td>
                                        <td className="py-3 pr-4"><Badge severity={d.severity} /></td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1e3528' }}>
                                                    <div className="h-full rounded-full" style={{ width: `${d.confidence * 100}%`, background: '#00d66a' }} />
                                                </div>
                                                <span className="text-xs" style={{ color: '#7aad8e' }}>{Math.round(d.confidence * 100)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Medicine Modal ── */}
                {showMedicine && (
                    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setShowMedicine(false)}>
                        <div className="glass-card p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-white mb-1">{t('crop_health.medicine_modal_title')}</h2>
                            <p className="text-xs mb-4" style={{ color: '#4d7360' }}>{t('crop_health.medicine_modal_sub')}</p>
                            <div className="space-y-3">
                                {medicines.map(m => (
                                    <div key={m.name} className="p-4 rounded-xl transition-all hover:bg-white/5"
                                        style={{ background: '#1a2e22', border: '1px solid #1e3528' }}>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <div className="text-sm font-semibold text-white">{m.name}</div>
                                                <div className="text-xs mt-0.5" style={{ color: '#7aad8e' }}>{t('crop_health.medicine_target')}: {m.target} · {t('crop_health.medicine_dosage')}: {m.dosage}</div>
                                            </div>
                                            <div className="text-xs font-bold text-right" style={{ color: '#fbbf24' }}>
                                                {m.cost.toLocaleString('vi-VN')} đ
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1e3528' }}>
                                                <div className="h-full rounded-full" style={{ width: `${m.effectiveness}%`, background: '#00d66a' }} />
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: '#34d399' }}>{m.effectiveness}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setShowMedicine(false)}
                                className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-black"
                                style={{ background: 'linear-gradient(135deg, #00d66a, #00884a)' }}>
                                {t('common.close')}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Treatment Plan Modal ── */}
                {showPlan && (
                    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setShowPlan(false)}>
                        <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-white mb-1">{t('crop_health.plan_modal_title')}</h2>
                            <p className="text-xs mb-4" style={{ color: '#4d7360' }}>{t('crop_health.plan_modal_sub')}</p>
                            {mockDetections.map(d => (
                                <div key={d.id} className="mb-3 p-3 rounded-xl" style={{ background: '#1a2e22', border: '1px solid #1e3528' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge severity={d.severity} />
                                        {d.image_url && <img src={d.image_url} alt={d.pest_type} className="w-8 h-8 rounded-md object-cover border" style={{ borderColor: '#1e3528' }} />}
                                        <span className="font-semibold text-white text-sm">{d.pest_type}</span>
                                        <span className="text-xs ml-auto" style={{ color: '#4d7360' }}>{d.field_zone}</span>
                                    </div>
                                    <div className="text-xs" style={{ color: '#7aad8e' }}>
                                        {t('crop_health.plan_recommendation', { time: d.severity === 'critical' ? '12h' : d.severity === 'high' ? '24h' : '48h' })}
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setShowPlan(false)}
                                className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold text-black"
                                style={{ background: 'linear-gradient(135deg, #00d66a, #00884a)' }}>
                                {t('crop_health.plan_confirm')}
                            </button>
                        </div>
                    </div>
                )}
            </Layout>
        </>
    )
}
