import React, { useState } from 'react'
import type { Alert } from '../../lib/api'

interface HeaderProps {
    title: string
    subtitle?: string
    alerts?: Alert[]
    onRefresh?: () => void
}

export default function Header({ title, subtitle, alerts = [], onRefresh }: HeaderProps) {
    const [showAlerts, setShowAlerts] = useState(false)
    const unresolved = alerts.filter(a => !a.resolved)

    const severityColor = (s: string) => {
        if (s === 'critical') return '#ef4444'
        if (s === 'high') return '#f97316'
        if (s === 'medium') return '#fbbf24'
        return '#34d399'
    }

    const typeLabel = (t: string) => {
        const m: Record<string, string> = { pest: 'Sâu bệnh', weather: 'Thời tiết', disease: 'Bệnh cây', irrigation: 'Tưới tiêu' }
        return m[t] ?? t
    }

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
            style={{ background: 'rgba(6,13,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(30,53,40,0.6)' }}
        >
            {/* Title */}
            <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-sm mt-0.5" style={{ color: '#7aad8e' }}>{subtitle}</p>}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                    style={{ background: 'rgba(15,31,23,0.8)', border: '1px solid rgba(30,53,40,0.8)', color: '#4d7360' }}
                >
                    <span>[Tìm]</span>
                    <input type="text" placeholder="Tìm kiếm..." className="bg-transparent outline-none w-36 text-sm" style={{ color: '#e8f5ee' }} />
                </div>

                {/* Refresh */}
                {onRefresh && (
                    <button onClick={onRefresh}
                        className="px-3 py-1.5 rounded-xl transition-all hover:bg-white/5 text-sm"
                        style={{ color: '#7aad8e', border: '1px solid rgba(30,53,40,0.8)' }}
                    >
                        Tải lại
                    </button>
                )}

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        className="relative px-3 py-1.5 rounded-xl transition-all hover:bg-white/5 text-sm"
                        style={{ color: '#7aad8e', border: '1px solid rgba(30,53,40,0.8)' }}
                    >
                        Thông báo
                        {unresolved.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center text-white"
                                style={{ background: '#ef4444' }}
                            >
                                {unresolved.length}
                            </span>
                        )}
                    </button>

                    {/* Dropdown */}
                    {showAlerts && (
                        <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            style={{ background: '#0f1f17', border: '1px solid #1e3528' }}
                        >
                            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e3528' }}>
                                <span className="font-semibold text-white text-sm">Cảnh báo</span>
                                <button onClick={() => setShowAlerts(false)} style={{ color: '#4d7360', fontSize: '12px' }}>
                                    Đóng
                                </button>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {unresolved.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-sm" style={{ color: '#4d7360' }}>
                                        Không có cảnh báo nào
                                    </div>
                                ) : unresolved.map(alert => (
                                    <div key={alert.id} className="px-4 py-3 border-b hover:bg-white/3 transition-colors"
                                        style={{ borderColor: '#1e3528' }}
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                                style={{ background: severityColor(alert.severity) }} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium px-1.5 py-0.5 rounded"
                                                        style={{ background: 'rgba(0,214,106,0.1)', color: '#00d66a' }}>
                                                        {typeLabel(alert.type)}
                                                    </span>
                                                </div>
                                                <p className="text-xs leading-relaxed" style={{ color: '#e8f5ee' }}>{alert.message}</p>
                                                <p className="text-xs mt-1" style={{ color: '#4d7360' }}>
                                                    {new Date(alert.timestamp).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-black"
                    style={{ background: 'linear-gradient(135deg, #00d66a, #00884a)' }}>
                    K
                </div>
            </div>
        </header>
    )
}
