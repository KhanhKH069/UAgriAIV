import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout/Layout'
import { mockWeather, mockForecast, mockAlerts } from '../lib/mockData'

const weatherIcon = (cond: string) => {
    if (cond.includes('Rain')) return '🌧️'
    if (cond.includes('Sunny') || cond.includes('Clear')) return '☀️'
    if (cond.includes('Snow')) return '❄️'
    return '☁️'
}
const tempDataFallback = mockForecast.map(f => ({ day: f.date.slice(5), min: f.temp_min, max: f.temp_max, hum: f.humidity }))

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="px-3 py-2 rounded-xl text-xs" style={{ background: '#0f1f17', border: '1px solid #1e3528', color: '#e8f5ee' }}>
                <div className="font-semibold mb-1">{label}</div>
                {payload.map((p, i) => <div key={i} style={{ color: p.color ?? '#00d66a' }}>{p.name}: {p.value}{p.name?.includes('hum') ? '%' : '°C'}</div>)}
            </div>
        )
    }
    return null
}

export default function WeatherPage() {
    const { t } = useTranslation()
    const [currentWeather, setCurrentWeather] = useState(mockWeather)
    const [forecast, setForecast] = useState(mockForecast)

    const riskColor = (r: string) => r === 'high' ? '#ef4444' : r === 'medium' ? '#fbbf24' : '#34d399'
    const riskLabel = (r: string) => r === 'high' ? t('weather.risk_high') : r === 'medium' ? t('weather.risk_medium') : t('weather.risk_low')

    useEffect(() => {
        // Fetch current weather
        fetch('http://localhost:8000/api/weather/current')
            .then(res => res.json())
            .then(data => {
                if (data && data.temperature) setCurrentWeather(data)
            })
            .catch(err => console.error("Lỗi fetch current weather:", err))

        // Fetch forecast
        fetch('http://localhost:8000/api/weather/forecast')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    // Map Open-Meteo format to mock format
                    const mapped = data.map((d: any) => ({
                        date: d.time || d.date,
                        temp_min: d.temp_min || Math.round(d.temperature - 2) || d.temperature,
                        temp_max: d.temp_max || Math.round(d.temperature + 2) || d.temperature,
                        humidity: d.humidity,
                        condition: d.condition || 'Clear',
                        pest_risk: d.pest_risk_level || d.pest_risk || 'low'
                    }))
                    setForecast(mapped)
                }
            })
            .catch(err => console.error("Lỗi fetch forecast:", err))
    }, [])

    const tempData = forecast.map(f => ({ day: f.date.slice(5, 10).replace('T', ' '), min: f.temp_min, max: f.temp_max, hum: f.humidity }))

    return (
        <>
            <Head><title>UAgriAIV – {t('weather.title')}</title></Head>
            <Layout title={t('weather.title')} subtitle={t('weather.subtitle')} alerts={mockAlerts} onRefresh={() => { }}>

                {/* ── Current weather ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* Main weather card */}
                    <div className="md:col-span-2 glass-card p-6"
                        style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.06), rgba(15,31,23,0.9))' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-xs font-medium mb-1" style={{ color: '#7aad8e' }}>{t('weather.current_weather')}</div>
                                <div className="flex items-end gap-3 mb-3">
                                    <span className="text-6xl font-bold text-white">{currentWeather.temperature}°</span>
                                    <span className="text-2xl mb-2" style={{ color: '#7aad8e' }}>C</span>
                                </div>
                                <div className="text-sm text-white mb-4">{currentWeather.condition}</div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-xs mb-1" style={{ color: '#4d7360' }}>{t('weather.humidity')}</div>
                                        <div className="text-sm font-semibold text-white">{currentWeather.humidity}%</div>
                                    </div>
                                    <div>
                                        <div className="text-xs mb-1" style={{ color: '#4d7360' }}>{t('weather.wind')}</div>
                                        <div className="text-sm font-semibold text-white">{currentWeather.wind_speed} km/h</div>
                                    </div>
                                    <div>
                                        <div className="text-xs mb-1" style={{ color: '#4d7360' }}>{t('weather.pest_risk_label')}</div>
                                        <div className="text-sm font-semibold" style={{ color: riskColor(currentWeather.pest_risk_level || 'low') }}>
                                            {riskLabel(currentWeather.pest_risk_level || 'low')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
                                    style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.2)' }}>
                                    ☁️
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pest risk alert */}
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span style={{ fontSize: '16px' }}>⚠️</span>
                            <h3 className="font-semibold text-white text-sm">{t('weather.pest_alert_title')}</h3>
                        </div>
                        <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <div className="text-xs font-semibold mb-1" style={{ color: riskColor(currentWeather.pest_risk_level || 'low') }}>{t('weather.pest_risk_label').toUpperCase()} {riskLabel(currentWeather.pest_risk_level || 'low').toUpperCase()}</div>
                            <p className="text-xs leading-relaxed" style={{ color: '#e8f5ee' }}>{currentWeather.pest_risk_reason}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs" style={{ color: '#7aad8e' }}>{t('weather.favorable_conditions')}</div>
                            {['Nhiệt độ 25–32°C', 'Độ ẩm > 75%', 'Mưa xen kẽ nắng', 'Gió nhẹ < 15km/h'].map(c => (
                                <div key={c} className="flex items-center gap-2 text-xs" style={{ color: '#e8f5ee' }}>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ef4444' }} />{c}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── 5-day forecast ── */}
                <div className="glass-card p-5 mb-6">
                    <h3 className="font-semibold text-white text-sm mb-4">{t('weather.forecast_5d')}</h3>
                    <div className="grid grid-cols-5 gap-2 mb-5">
                        {forecast.slice(0, 5).map(f => {
                            const Icon = weatherIcon(f.condition)
                            return (
                                <div key={f.date} className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:bg-white/5"
                                    style={{ border: '1px solid #1e3528' }}>
                                    <div className="text-xs font-medium" style={{ color: '#7aad8e' }}>
                                        {f.date.includes('T') ? f.date.slice(11, 16) : new Date(f.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                                    </div>
                                    <span style={{ fontSize: '20px' }}>{Icon}</span>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-white">{f.temp_max}°</div>
                                        <div className="text-xs" style={{ color: '#4d7360' }}>{f.temp_min}°</div>
                                    </div>
                                    <div className="text-xs" style={{ color: '#7aad8e' }}>{f.humidity}%</div>
                                    <div className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                                        style={{ background: `${riskColor(f.pest_risk)}15`, color: riskColor(f.pest_risk) }}>
                                        {riskLabel(f.pest_risk)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {/* Temp chart */}
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={tempData}>
                            <defs>
                                <linearGradient id="maxG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="minG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" tick={{ fill: '#4d7360', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#4d7360', fontSize: 11 }} axisLine={false} tickLine={false} unit="°" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="max" name="T.max" stroke="#f97316" strokeWidth={2} fill="url(#maxG)" dot={{ fill: '#f97316', r: 3 }} />
                            <Area type="monotone" dataKey="min" name="T.min" stroke="#38bdf8" strokeWidth={2} fill="url(#minG)" dot={{ fill: '#38bdf8', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* ── Soil Conditions ── */}
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span style={{ fontSize: '16px' }}>⛰️</span>
                        <h3 className="font-semibold text-white text-sm">{t('weather.soil_conditions')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: t('weather.soil_moisture'), value: currentWeather.soil_moisture || 68, unit: '%', icon: '💧', color: '#38bdf8', warn: (currentWeather.soil_moisture || 68) > 80 ? 'Quá ẩm – nguy cơ bệnh nấm' : null, max: 100 },
                            { label: t('weather.soil_ph'), value: currentWeather.soil_ph || 6.2, unit: '', icon: '🌱', color: '#00d66a', warn: (currentWeather.soil_ph || 6.2) < 5.5 ? 'Đất quá chua' : null, max: 14 },
                            { label: t('weather.soil_temp'), value: currentWeather.soil_temp || 26.3, unit: '°C', icon: '🌡️', color: '#f97316', warn: null, max: 50 },
                        ].map(s => (
                            <div key={s.label} className="p-4 rounded-xl" style={{ background: '#1a2e22', border: '1px solid #1e3528' }}>
                                <div className="flex items-center gap-2 mb-3">
                                    <span style={{ fontSize: '15px' }}>{s.icon}</span>
                                    <span className="text-xs font-medium" style={{ color: '#7aad8e' }}>{s.label}</span>
                                </div>
                                <div className="text-2xl font-bold text-white mb-2">{s.value}{s.unit}</div>
                                <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: '#1e3528' }}>
                                    <div className="h-full rounded-full transition-all" style={{ width: `${(s.value / s.max) * 100}%`, background: s.color }} />
                                </div>
                                {s.warn && (
                                    <div className="text-xs flex items-center gap-1" style={{ color: '#fbbf24' }}>
                                        <span style={{ fontSize: '10px' }}>⚠️</span>{s.warn}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)' }}>
                        <div className="text-xs font-semibold mb-1" style={{ color: '#a78bfa' }}>{t('weather.ai_analysis')}</div>
                        <p className="text-xs leading-relaxed" style={{ color: '#e8f5ee' }}>
                            Độ ẩm đất hiện tại ({currentWeather.soil_moisture || 68}%) kết hợp với nhiệt độ đất {currentWeather.soil_temp || 26.3}°C và pH {currentWeather.soil_ph || 6.2}
                            tạo điều kiện hiện tại cho cây trồng.
                        </p>
                    </div>
                </div>
            </Layout>
        </>
    )
}
