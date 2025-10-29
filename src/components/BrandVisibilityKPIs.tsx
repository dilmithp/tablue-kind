// src/components/BrandVisibilityKPIs.tsx
'use client';

import React from 'react';
import { Store, CheckCircle, Package, TrendingUp, BarChart3 } from 'lucide-react';

interface BrandVisibilityData {
    totalOutletsAudited: number;
    overallCompliancePercent: number;
    brandShelfSharePercent: number;
    competitorShelfSharePercent: number;
    changeVsLastCycle: number;
}

interface BrandVisibilityKPIsProps {
    data: BrandVisibilityData;
}

export function BrandVisibilityKPIs({ data }: BrandVisibilityKPIsProps) {
    const {
        totalOutletsAudited,
        overallCompliancePercent,
        brandShelfSharePercent,
        competitorShelfSharePercent,
        changeVsLastCycle
    } = data;

    const kpiCards = [
        {
            id: 'outlets-audited',
            icon: <Store className="w-6 h-6 text-blue-600" />,
            label: 'Total Outlets Audited',
            value: totalOutletsAudited.toLocaleString(),
            description: 'Outlets with valid planogram submissions',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100'
        },
        {
            id: 'compliance',
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
            label: 'Overall Compliance %',
            value: `${overallCompliancePercent.toFixed(1)}%`,
            description: '% of compliant planograms',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100'
        },
        {
            id: 'brand-share',
            icon: <Package className="w-6 h-6 text-purple-600" />,
            label: 'Your Brand Shelf Share %',
            value: `${brandShelfSharePercent.toFixed(1)}%`,
            description: '% of total compliant shelf space',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100'
        },
        {
            id: 'competitor-share',
            icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
            label: 'Competitor Shelf Share %',
            value: `${competitorShelfSharePercent.toFixed(1)}%`,
            description: '% of shelf space for competitors',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100'
        },
        {
            id: 'change-cycle',
            icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
            label: 'Change vs Last Cycle',
            value: `${changeVsLastCycle >= 0 ? '+' : ''}${changeVsLastCycle.toFixed(1)}%`,
            description: 'Trend of shelf share change',
            bgColor: changeVsLastCycle >= 0 ? 'bg-emerald-50' : 'bg-red-50',
            iconBg: changeVsLastCycle >= 0 ? 'bg-emerald-100' : 'bg-red-100',
            valueColor: changeVsLastCycle >= 0 ? 'text-emerald-700' : 'text-red-700'
        }
    ];

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow-sm border border-blue-100 p-6">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                    Brand Visibility & Shelf Share
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">
                    Real-time planogram compliance and shelf space analytics
                </p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-5 gap-4">
                {kpiCards.map((kpi) => (
                    <div
                        key={kpi.id}
                        className={`${kpi.bgColor} rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`${kpi.iconBg} rounded-lg p-2 flex items-center justify-center`}>
                                {kpi.icon}
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className={`text-3xl font-bold ${kpi.valueColor || 'text-gray-900'}`}>
                                {kpi.value}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                                {kpi.label}
                            </div>
                            <div className="text-xs text-gray-600">
                                {kpi.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

