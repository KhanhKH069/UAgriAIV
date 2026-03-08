import React from 'react'
import clsx from 'clsx'

interface BadgeProps {
    severity: 'critical' | 'high' | 'medium' | 'low'
    label?: string
}

const config = {
    critical: { cls: 'badge-critical', label: 'Nghiêm trọng' },
    high: { cls: 'badge-high', label: 'Cao' },
    medium: { cls: 'badge-medium', label: 'Trung bình' },
    low: { cls: 'badge-low', label: 'Thấp' },
}

export default function Badge({ severity, label }: BadgeProps) {
    const { cls, label: defaultLabel } = config[severity]
    return (
        <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', cls)}>
            {label ?? defaultLabel}
        </span>
    )
}
