// src/components/EnhancedKPICard.tsx
'use client';

import React from 'react';
import { KPIMetric } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EnhancedKPICardProps {
  metric: KPIMetric;
  icon?: React.ReactNode;
  className?: string;
}

export function EnhancedKPICard({ metric, icon, className }: EnhancedKPICardProps) {
  const { name, value, target, unit, trend, trendValue, status } = metric;

  const formatValue = (val: number | string, unit: string) => {
    if (typeof val === 'string') return val;
    if (unit === 'LKR') return formatCurrency(val).replace('LKR ', '');
    if (unit === '%') return formatPercentage(val);
    return val.toLocaleString();
  };

  const getTrendColor = (trend: string, status: string) => {
    if (status === 'success') return 'text-emerald-600';
    if (status === 'warning') return 'text-amber-600';
    if (status === 'danger') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getValueColor = (status: string) => {
    if (status === 'success') return 'text-gray-900';
    if (status === 'warning') return 'text-amber-700';
    if (status === 'danger') return 'text-red-700';
    return 'text-gray-900';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="p-6">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {icon && (
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {name}
            </h3>
          </div>
          <div className={`flex items-center space-x-1 ${getTrendColor(trend, status)}`}>
            {getTrendIcon()}
            <span className="text-sm font-semibold">
              {trendValue > 0 ? '+' : ''}{formatPercentage(trendValue)}
            </span>
          </div>
        </div>

        {/* Main Value */}
        <div className="mb-3">
          <div className={`text-4xl font-bold tracking-tight ${getValueColor(status)}`}>
            {formatValue(value, unit)}
          </div>
          {unit === 'LKR' && (
            <div className="text-xs text-gray-500 mt-1">Sri Lankan Rupees</div>
          )}
        </div>

        {/* Target Comparison */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Target: {formatValue(target, unit)}
          </span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              status === 'success' ? 'bg-emerald-500' :
              status === 'warning' ? 'bg-amber-500' : 
              status === 'danger' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            <span className={`font-semibold ${getTrendColor(trend, status)}`}>
              {status === 'success' ? 'On Track' : 
               status === 'warning' ? 'Monitor' : 
               status === 'danger' ? 'Action Needed' : 'Stable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}