import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

const navItems = [
    { href: '/', labelKey: 'dashboard', badge: null },
    { href: '/crop-health', labelKey: 'crop_health', badge: 3 },
    { href: '/weather', labelKey: 'weather', badge: null },
    { href: '/uav', labelKey: 'uav_management', badge: null },
]

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const router = useRouter()
    const { t, i18n } = useTranslation()

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'vi' : 'en'
        i18n.changeLanguage(nextLang)
    }

    return (
        <aside
            className={clsx(
                'sidebar fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300',
                collapsed ? 'w-16' : 'w-60'
            )}
            style={{
                background: 'linear-gradient(180deg, #0a1a11 0%, #060d0a 100%)',
                borderRight: '1px solid rgba(30,53,40,0.8)',
            }}
        >
            {/* Logo */}
            <div className={clsx('flex items-center gap-3 px-4 py-5', collapsed && 'justify-center px-2')}>
                <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #00d66a, #00884a)' }}>
                        UA
                    </div>
                    <div className="absolute -inset-1 rounded-xl opacity-30" style={{ background: 'radial-gradient(circle, #00d66a, transparent)' }} />
                </div>
                {!collapsed && (
                    <div>
                        <div className="text-sm font-bold text-white tracking-wide">UAgriAIV</div>
                        <div className="text-xs" style={{ color: '#4d7360' }}>Smart Farm</div>
                    </div>
                )}
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 text-[10px] font-bold"
                style={{ background: '#00d66a', border: '2px solid #060d0a', color: 'black' }}
            >
                {collapsed ? '>' : '<'}
            </button>

            {/* Nav items */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {!collapsed && <div className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#4d7360' }}>Menu</div>}
                {navItems.map(({ href, labelKey, badge }) => {
                    const isActive = router.pathname === href
                    const shortLabel = t(`common.${labelKey}`).substring(0, 2).toUpperCase()
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                                isActive
                                    ? 'text-white'
                                    : 'text-[#7aad8e] hover:text-white hover:bg-white/5',
                                collapsed && 'justify-center'
                            )}
                            style={isActive ? {
                                background: 'linear-gradient(135deg, rgba(0,214,106,0.15), rgba(0,136,74,0.08))',
                                boxShadow: '0 0 16px rgba(0,214,106,0.12)',
                                border: '1px solid rgba(0,214,106,0.2)',
                            } : {}}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: '#00d66a' }} />
                            )}
                            {collapsed && <span className={clsx(isActive ? 'text-[#00d66a]' : 'text-[#7aad8e]', 'font-bold text-xs')}>{shortLabel}</span>}
                            {!collapsed && (
                                <>
                                    <span className="text-sm font-medium flex-1">{t(`common.${labelKey}`)}</span>
                                    {badge !== null && (
                                        <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
                                            {badge}
                                        </span>
                                    )}
                                </>
                            )}
                            {collapsed && badge !== null && (
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom */}
            <div className={clsx('p-2 border-t space-y-1', collapsed && 'flex flex-col items-center')} style={{ borderColor: '#1e3528' }}>
                <button
                    onClick={toggleLanguage}
                    className={clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full hover:bg-white/5',
                        collapsed && 'justify-center'
                    )}
                    style={{ color: '#00d66a' }}
                >
                    <span className="text-xs font-bold mr-1">EN/VI</span>
                    {!collapsed && <span className="text-sm font-bold uppercase">{i18n.language}</span>}
                </button>
                {[
                    { short: 'CĐ', label: 'Cài đặt' },
                    { short: 'ĐX', label: 'Đăng xuất' },
                ].map(({ short, label }) => (
                    <button
                        key={label}
                        className={clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full hover:bg-white/5',
                            collapsed && 'justify-center'
                        )}
                        style={{ color: '#7aad8e' }}
                    >
                        {collapsed && <span className="text-xs font-bold">{short}</span>}
                        {!collapsed && <span className="text-sm">{label}</span>}
                    </button>
                ))}
            </div>
        </aside>
    )
}
