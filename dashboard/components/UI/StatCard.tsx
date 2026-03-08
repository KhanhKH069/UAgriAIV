import React from 'react'
import clsx from 'clsx'

interface StatCardProps {
    title: string
    value: string | number
    unit?: string
    iconColor?: string
    change?: number
    changeLabel?: string
    glowClass?: string
    children?: React.ReactNode
}

export default function StatCard({
    title, value, unit, iconColor = '#00d66a',
    change, changeLabel, glowClass, children
}: StatCardProps) {
    const isPositive = change !== undefined && change >= 0

    return (
        <div className={clsx('glass-card p-5 transition-all duration-300 hover:translate-y-[-2px]', glowClass)}>
            <div className="flex items-start justify-between mb-3">
                <div className="text-sm font-medium" style={{ color: '#7aad8e' }}>{title}</div>
            </div>
            <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-white leading-none">{value}</span>
                {unit && <span className="text-sm mb-0.5" style={{ color: '#4d7360' }}>{unit}</span>}
            </div>
            {change !== undefined && (
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium" style={{ color: isPositive ? '#34d399' : '#f87171' }}>
                        {isPositive ? '+' : ''}{change}%
                    </span>
                    {changeLabel && <span className="text-xs" style={{ color: '#4d7360' }}>{changeLabel}</span>}
                </div>
            )}
            {children}
        </div>
    )
}
