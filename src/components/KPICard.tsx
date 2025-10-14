// src/components/KPICard.tsx
'use client';

import React from 'react';
import { KPIMetric } from '@/lib/types';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface KPICardProps {
    metric: KPIMetric;
    className?: string;
}

export function KPICard({ metric, className }: KPICardProps) {
    const { name, value, target, unit, trend, trendValue, status } = metric;

    const formatValue = (val: number | string, unit: string) => {
        if (typeof val === 'string') return val;
        if (unit === 'LKR') return formatCurrency(val);
        if (unit === '%') return formatPercentage(val);
        return val.toLocaleString();
    };

    const achievementRate = typeof value === 'number' && typeof target === 'number'
        ? (value / target) * 100
        : 100;

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : ArrowRight;

    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-gray-600 uppercase">{name}</h3>
                <div className="flex items-center text-xs font-medium text-green-600">
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {Math.abs(trendValue)}{unit === '%' ? 'pp' : unit}
                </div>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatValue(value, unit)}
            </div>

            <div className="text-sm text-gray-600">
                Target: {formatValue(target, unit)} ({achievementRate.toFixed(1)}%)
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                    className={cn(
                        'h-2 rounded-full transition-all duration-500',
                        achievementRate >= 100 ? 'bg-green-600' : 'bg-red-600'
                    )}
                    style={{ width: `${Math.min(achievementRate, 100)}%` }}
                />
            </div>
        </div>
    );
}
