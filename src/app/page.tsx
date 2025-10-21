// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { TableauHeader } from '@/components/TableauHeader';
import { EnhancedKPICard } from '@/components/EnhancedKPICard';
import { ForecastChart } from '@/components/ForecastChart';
import { EnhancedForecastTable } from '@/components/EnhancedForecastTable';
import { ProfessionalAchievementChart } from '@/components/ProfessionalAchievementChart';
import { ReturnRateMatrix } from '@/components/ReturnRateMatrix';
import { EnhancedChannelDonut } from '@/components/EnhancedChannelDonut';
import { SriLankaMap } from '@/components/SriLankaMap';
// --- NEW IMPORTS ---
import { TopBottomOutletTable } from '@/components/TopBottomOutletTable';
import { TopSkuTable } from '@/components/TopSkuTable';
import { ExecutionWatchlistTable } from '@/components/ExecutionWatchlistTable';
// --- END NEW IMPORTS ---
import {
    TrendingUp,
    Target,
    Gift,
    RotateCcw,
    PieChart,
    Calendar,
    Database
} from 'lucide-react';

// Helper function to format large numbers (e.g., 37M)
const formatLargeNumber = (value: number) => {
    if (!value) return '0';
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1) + 'M';
    }
    if (value >= 1_000) {
        return (value / 1_000).toFixed(1) + 'K';
    }
    return value.toString();
};

export default function Dashboard() {
    // Filter State
    const [selectedRegion, setSelectedRegion] = useState('All Regions');
    const [selectedChannel, setSelectedChannel] = useState('All Channels');

    const [dashboardData, setDashboardData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data on initial load and when filters change
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const params = new URLSearchParams();
                params.append('region', selectedRegion);
                params.append('channel', selectedChannel);
                const response = await fetch(`/api/dashboard-data?${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`API failed with status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Data fetched from API:", data);
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [selectedRegion, selectedChannel]);


    // Loading State
    if (isLoading || !dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Trade Analytics Dashboard...</p>
                </div>
            </div>
        );
    }

    // Prepare KPI data
    const promoUpliftValue = Number(dashboardData?.kpis?.promoUplift) || 0;
    const returnRateValue = Number(dashboardData?.kpis?.returnRate) || 0;
    const oosRateValue = Number(dashboardData?.kpis?.oosRate) || 0;
    const growthPercentValue = Number(dashboardData?.kpis?.growthPercent) || 0;

    const enhancedKPIs = [
        {
            id: 'ytd-sales',
            name: 'YTD Sales (2024)',
            value: `LKR ${formatLargeNumber(dashboardData?.kpis?.ytdSales || 0)}`,
            target: 50000000, // 50M LKR realistic annual target
            unit: '',
            trend: 'up' as const,
            trendValue: 5.2,
            status: 'success' as const
        },
        {
            id: 'growth-rate',
            name: 'Growth % (vs 2023)',
            value: growthPercentValue.toFixed(1),
            target: 8.5, // Realistic 8.5% YoY growth target for FMCG
            unit: '%',
            trend: growthPercentValue >= 8.5 ? 'up' as const : 'down' as const,
            trendValue: growthPercentValue,
            status: growthPercentValue >= 8.5 ? 'success' as const : (growthPercentValue >= 5 ? 'warning' as const : 'danger' as const)
        },
        {
            id: 'promo-uplift',
            name: 'Promo Uplift %',
            value: promoUpliftValue.toFixed(1),
            target: 12, // Industry standard 10-15% uplift target
            unit: '%',
            trend: promoUpliftValue >= 12 ? 'up' as const : 'down' as const,
            trendValue: promoUpliftValue,
            status: promoUpliftValue >= 12 ? 'success' as const : (promoUpliftValue >= 8 ? 'warning' as const : 'danger' as const)
        },
        {
            id: 'return-rate',
            name: 'Return Rate %',
            value: returnRateValue.toFixed(1),
            target: 2.5, // Keep return rate below 2.5%
            unit: '%',
            trend: returnRateValue <= 2.5 ? 'down' as const : 'up' as const,
            trendValue: returnRateValue - 2.5,
            status: returnRateValue <= 2.5 ? 'success' as const : (returnRateValue <= 4 ? 'warning' as const : 'danger' as const)
        },
        {
            id: 'oos-rate',
            name: 'OOS % (2024)',
            value: oosRateValue.toFixed(1),
            target: 10.0, // Industry best practice: <10% OOS
            unit: '%',
            trend: oosRateValue <= 10.0 ? 'down' as const : 'up' as const,
            trendValue: oosRateValue - 10.0,
            status: oosRateValue <= 10.0 ? 'success' as const : (oosRateValue <= 15 ? 'warning' as const : 'danger' as const)
        }
    ];

    const kpiIcons = [ <TrendingUp className="w-5 h-5 text-blue-600" />, <Target className="w-5 h-5 text-red-600" />, <Gift className="w-5 h-5 text-purple-600" />, <RotateCcw className="w-5 h-5 text-green-600" />, <PieChart className="w-5 h-5 text-orange-600" /> ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <TableauHeader
                title="Trade Analytics - Head of MT Dashboard"
                regionList={dashboardData.regionList || []}
                channelList={dashboardData.channelList || []}
                selectedRegion={selectedRegion}
                selectedChannel={selectedChannel}
                onRegionChange={setSelectedRegion}
                onChannelChange={setSelectedChannel}
            />

            {/* Main Content Area */}
            <div className="p-8 space-y-8">
                {/* KPI Row */}
                <div className="grid grid-cols-5 gap-6">
                    {enhancedKPIs.map((kpi, index) => (
                        <EnhancedKPICard key={kpi.id} metric={kpi} icon={kpiIcons[index]} />
                    ))}
                </div>

                {/* Outlet/SKU Summary Row */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"> <div className="flex items-center space-x-4"> <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg"> <Calendar className="w-8 h-8 text-white" /> </div> <div> <h3 className="text-sm font-semibold text-gray-700 uppercase">Active Outlets</h3> <div className="text-4xl font-bold text-gray-900">{dashboardData.outletCount}</div> <div className="text-sm text-gray-600">Active retail locations</div> </div> </div> </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"> <div className="flex items-center space-x-4"> <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"> <Database className="w-8 h-8 text-white" /> </div> <div> <h3 className="text-sm font-semibold text-gray-700 uppercase">Active SKUs</h3> <div className="text-4xl font-bold text-gray-900">{dashboardData.skuCount}</div> <div className="text-sm text-gray-600">Stock keeping units</div> </div> </div> </div>
                </div>

                {/* Forecast & Table Row */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-8"> <ForecastChart data={dashboardData.salesForecast} height={350} /> </div>
                    <div className="col-span-4"> <EnhancedForecastTable data={dashboardData.forecastTable} /> </div>
                </div>

                {/* Achievement, Returns, Channel Row */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-6"> <ProfessionalAchievementChart data={dashboardData.achievementData} /> </div>
                    <div className="col-span-3"> <ReturnRateMatrix data={dashboardData.returnMatrixData} /> </div>
                    <div className="col-span-3"> <EnhancedChannelDonut data={dashboardData.channels} /> </div>
                </div>

                {/* Regional Sales Heatmap - Sri Lanka Map */}
                <SriLankaMap data={dashboardData.achievementData || []} />

                {/* --- NEW TABLES SECTION --- */}
                <div className="space-y-8">
                    {/* Top/Bottom Outlets */}
                    <TopBottomOutletTable
                        topData={dashboardData.topOutlets || []}
                        bottomData={dashboardData.bottomOutlets || []}
                    />

                    {/* Top SKUs */}
                    <TopSkuTable data={dashboardData.topSkus || []} />

                    {/* Execution Watchlist */}
                    <ExecutionWatchlistTable data={dashboardData.watchlistOutlets || []} />
                </div>
                {/* --- END NEW TABLES SECTION --- */}

                {/* Footer */}
                <footer className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-8 text-sm text-gray-600">
                            <span>© 2025 Unilever Sri Lanka</span>
                            <span>Data refreshed: Every 15 minutes</span>
                            <span>Last update: {new Date(dashboardData.lastUpdated).toLocaleString()}</span>
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