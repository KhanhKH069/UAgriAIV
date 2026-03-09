import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

interface BadgeProps {
    severity: 'critical' | 'high' | 'medium' | 'low'
    label?: string
}

export default function Badge({ severity, label }: BadgeProps) {
    const { t } = useTranslation()
    const config = {
        critical: { cls: 'badge-critical', label: t('common.severity_critical') },
        high: { cls: 'badge-high', label: t('common.severity_high') },
        medium: { cls: 'badge-medium', label: t('common.severity_medium') },
        low: { cls: 'badge-low', label: t('common.severity_low') },
    }
    const { cls, label: defaultLabel } = config[severity]
    return (
        <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', cls)}>
            {label ?? defaultLabel}
        </span>
    )
}
