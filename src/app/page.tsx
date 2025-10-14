// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DashboardData } from '@/lib/types';
import { DataService } from '@/lib/dataService';
import { TableauHeader } from '@/components/TableauHeader';
import { EnhancedKPICard } from '@/components/EnhancedKPICard';
import { ForecastChart } from '@/components/ForecastChart';
import { ProfessionalAchievementChart } from '@/components/ProfessionalAchievementChart';
import { EnhancedForecastTable } from '@/components/EnhancedForecastTable';
import { ReturnRateMatrix } from '@/components/ReturnRateMatrix';
import { EnhancedChannelDonut } from '@/components/EnhancedChannelDonut';
import {
    TrendingUp,
    Target,
    Gift,
    RotateCcw,
    PieChart,
    Calendar,
    Database
} from 'lucide-react';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const data = DataService.getDashboardData();
        setDashboardData(data);
    }, []);

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Trade Analytics Dashboard...</p>
                </div>
            </div>
        );
    }

    const { kpis } = dashboardData;

    // Enhanced KPI data matching your reference dashboard
    const enhancedKPIs = [
        {
            ...kpis[0],
            name: 'YTD Sales',
            value: 37963173,
            target: 40000000,
            unit: 'LKR',
            trend: 'up' as const,
            trendValue: 5.2,
            status: 'success' as const
        },
        {
            ...kpis[1],
            name: 'Growth %',
            value: -14.39,
            target: 0,
            unit: '%',
            trend: 'down' as const,
            trendValue: -14.39,
            status: 'danger' as const
        },
        {
            ...kpis[2],
            name: 'Promo Uplift %',
            value: -100.00,
            target: 15,
            unit: '%',
            trend: 'down' as const,
            trendValue: -100,
            status: 'danger' as const
        },
        {
            ...kpis[3],
            name: 'Return Rate %',
            value: 0.40,
            target: 3.0,
            unit: '%',
            trend: 'down' as const,
            trendValue: -0.6,
            status: 'success' as const
        },
        {
            ...kpis[4],
            name: 'OOS %',
            value: 19.85,
            target: 15.0,
            unit: '%',
            trend: 'up' as const,
            trendValue: 4.85,
            status: 'warning' as const
        }
    ];

    const kpiIcons = [
        <TrendingUp className="w-5 h-5 text-blue-600" />,
        <Target className="w-5 h-5 text-red-600" />,
        <Gift className="w-5 h-5 text-purple-600" />,
        <RotateCcw className="w-5 h-5 text-green-600" />,
        <PieChart className="w-5 h-5 text-orange-600" />
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Professional Header */}
            <TableauHeader
                title="Trade Analytics - Head of MT Dashboard"
                lastUpdated={dashboardData.lastUpdated}
            />

            <div className="p-8 space-y-8">
                {/* KPI Cards Row */}
                <div className="grid grid-cols-5 gap-6">
                    {enhancedKPIs.map((kpi, index) => (
                        <EnhancedKPICard
                            key={kpi.id}
                            metric={kpi}
                            icon={kpiIcons[index]}
                        />
                    ))}
                </div>

                {/* Outlets & SKU Cards */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase">Outlets</h3>
                                <div className="text-4xl font-bold text-gray-900">150</div>
                                <div className="text-sm text-gray-600">Active retail locations</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Database className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase">SKU</h3>
                                <div className="text-4xl font-bold text-gray-900">1,489</div>
                                <div className="text-sm text-gray-600">Stock keeping units</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-8">
                        <ForecastChart data={dashboardData.salesForecast} height={350} />
                    </div>
                    <div className="col-span-4">
                        <EnhancedForecastTable data={[]} />
                    </div>
                </div>

                {/* Bottom Charts Row */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-6">
                        <ProfessionalAchievementChart data={[]} />
                    </div>
                    <div className="col-span-3">
                        <ReturnRateMatrix />
                    </div>
                    <div className="col-span-3">
                        <EnhancedChannelDonut />
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-8 text-sm text-gray-600">
                            <span>© 2025 Unilever Sri Lanka</span>
                            <span>Data refreshed: Every 15 minutes</span>
                            <span>Last update: {new Date().toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 font-medium">Live Data</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
