import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Sidebar from './Sidebar'
import type { Alert } from '../../lib/api'
import Header from './Header'

const bottomNav = [
    { href: '/', label: 'Tổng quan' },
    { href: '/crop-health', label: 'Cây trồng' },
    { href: '/weather', label: 'Thời tiết' },
    { href: '/uav', label: 'UAV' },
]

interface LayoutProps {
    children: React.ReactNode
    title: string
    subtitle?: string
    alerts?: Alert[]
    onRefresh?: () => void
}

export default function Layout({ children, title, subtitle, alerts, onRefresh }: LayoutProps) {
    const router = useRouter()

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            <Sidebar />

            {/* Main area */}
            <div className="main-content" style={{ marginLeft: '240px', minHeight: '100vh' }}>
                <Header title={title} subtitle={subtitle} alerts={alerts} onRefresh={onRefresh} />
                <main className="p-4 md:p-6 animate-fade-in">
                    {children}
                </main>
            </div>

            {/* Mobile bottom nav */}
            <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 px-2 py-2 gap-1"
                style={{ background: 'rgba(10,26,17,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(30,53,40,0.8)' }}
            >
                {bottomNav.map(({ href, label }) => {
                    const isActive = router.pathname === href
                    return (
                        <Link key={href} href={href}
                            className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all"
                            style={{
                                color: isActive ? '#00d66a' : '#4d7360',
                                background: isActive ? 'rgba(0,214,106,0.08)' : 'transparent',
                            }}
                        >
                            <span className="text-xs font-bold leading-5">{label.substring(0, 2).toUpperCase()}</span>
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
