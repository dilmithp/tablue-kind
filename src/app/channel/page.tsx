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
import { TopBottomOutletTable } from '@/components/TopBottomOutletTable';
import { TopSkuTable } from '@/components/TopSkuTable';
import { ExecutionWatchlistTable } from '@/components/ExecutionWatchlistTable';
import { CompetitorInsights } from '@/components/CompetitorInsights';
import { BrandVisibilityKPIs } from '@/components/BrandVisibilityKPIs';
import {
    TrendingUp,
    Target,
    Gift,
    RotateCcw,
    PieChart,
    Calendar,
    Database,
    Store
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

export default function ChannelManagerDashboard() {
    // Channel Manager specific state - only allow channel selection
    const [selectedChannel, setSelectedChannel] = useState('Supermarket'); // Default to Supermarket

    const [dashboardData, setDashboardData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data on initial load and when channel changes
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const params = new URLSearchParams();
                params.append('region', 'All Regions'); // Channel manager sees all regions
                params.append('channel', selectedChannel);
                const response = await fetch(`/api/dashboard-data?${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`API failed with status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Channel Dashboard Data fetched:", data);
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to fetch channel dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [selectedChannel]);

    // Loading State
    if (isLoading || !dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Channel Manager Dashboard...</p>
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
            target: 50000000,
            unit: '',
            trend: 'up' as const,
            trendValue: 5.2,
            status: 'success' as const
        },
        {
            id: 'growth-rate',
            name: 'Growth % (vs 2023)',
            value: growthPercentValue.toFixed(1),
            target: 8.5,
            unit: '%',
            trend: growthPercentValue >= 8.5 ? 'up' as const : 'down' as const,
            trendValue: growthPercentValue,
            status: growthPercentValue >= 8.5 ? 'success' as const : (growthPercentValue >= 5 ? 'warning' as const : 'danger' as const)
        },
        {
            id: 'promo-uplift',
            name: 'Promo Uplift %',
            value: promoUpliftValue.toFixed(1),
            target: 12,
            unit: '%',
            trend: promoUpliftValue >= 12 ? 'up' as const : 'down' as const,
            trendValue: promoUpliftValue,
            status: promoUpliftValue >= 12 ? 'success' as const : (promoUpliftValue >= 8 ? 'warning' as const : 'danger' as const)
        },
        {
            id: 'return-rate',
            name: 'Return Rate %',
            value: returnRateValue.toFixed(1),
            target: 2.5,
            unit: '%',
            trend: returnRateValue <= 2.5 ? 'down' as const : 'up' as const,
            trendValue: returnRateValue - 2.5,
            status: returnRateValue <= 2.5 ? 'success' as const : (returnRateValue <= 4 ? 'warning' as const : 'danger' as const)
        },
        {
            id: 'oos-rate',
            name: 'OOS % (2024)',
            value: oosRateValue.toFixed(1),
            target: 10.0,
            unit: '%',
            trend: oosRateValue <= 10.0 ? 'down' as const : 'up' as const,
            trendValue: oosRateValue - 10.0,
            status: oosRateValue <= 10.0 ? 'success' as const : (oosRateValue <= 15 ? 'warning' as const : 'danger' as const)
        }
    ];

    const kpiIcons = [
        <TrendingUp key="icon-1" className="w-5 h-5 text-blue-600" />,
        <Target key="icon-2" className="w-5 h-5 text-red-600" />,
        <Gift key="icon-3" className="w-5 h-5 text-purple-600" />,
        <RotateCcw key="icon-4" className="w-5 h-5 text-green-600" />,
        <PieChart key="icon-5" className="w-5 h-5 text-orange-600" />
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Channel Manager Header with Channel Selector */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                                <Store className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Channel Manager Dashboard</h1>
                            </div>
                        </div>

                        {/* Channel Selector */}
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-semibold text-gray-700">Select Channel:</label>
                            <select
                                value={selectedChannel}
                                onChange={(e) => setSelectedChannel(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="Supermarket">Supermarket</option>
                                <option value="Retail Shop">Retail Shop</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-8 space-y-8">
                {/* Channel Info Banner */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{selectedChannel} Performance Overview</h2>
                            <p className="text-blue-100">Real-time insights for {selectedChannel} channel across all regions</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-blue-100 mb-1">Total Outlets</div>
                            <div className="text-3xl font-bold">{dashboardData.outletCount || 0}</div>
                        </div>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-5 gap-6">
                    {enhancedKPIs.map((kpi, index) => (
                        <EnhancedKPICard key={kpi.id} metric={kpi} icon={kpiIcons[index]} />
                    ))}
                </div>

                {/* Brand Visibility & Shelf Share KPIs */}
                <BrandVisibilityKPIs
                    data={{
                        totalOutletsAudited: dashboardData.brandVisibility?.totalOutletsAudited || 432,
                        overallCompliancePercent: dashboardData.brandVisibility?.overallCompliancePercent || 87,
                        brandShelfSharePercent: dashboardData.brandVisibility?.brandShelfSharePercent || 61,
                        competitorShelfSharePercent: dashboardData.brandVisibility?.competitorShelfSharePercent || 39,
                        changeVsLastCycle: dashboardData.brandVisibility?.changeVsLastCycle || 4
                    }}
                />

                {/* Outlet/SKU Summary Row */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase">Active Outlets</h3>
                                <div className="text-4xl font-bold text-gray-900">{dashboardData.outletCount}</div>
                                <div className="text-sm text-gray-600">Active {selectedChannel} outlets</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Database className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase">Active SKUs</h3>
                                <div className="text-4xl font-bold text-gray-900">{dashboardData.skuCount}</div>
                                <div className="text-sm text-gray-600">Stock keeping units</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Forecast & Table Row */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-8">
                        <ForecastChart data={dashboardData.salesForecast} height={350} />
                    </div>
                    <div className="col-span-4">
                        <EnhancedForecastTable data={dashboardData.forecastTable} />
                    </div>
                </div>

                {/* Achievement, Returns Row */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-9">
                        <ProfessionalAchievementChart data={dashboardData.achievementData} />
                    </div>
                    <div className="col-span-3">
                        <ReturnRateMatrix data={dashboardData.returnMatrixData} />
                    </div>
                </div>

                {/* Regional Sales Heatmap - Sri Lanka Map */}
                <SriLankaMap data={dashboardData.achievementData || []} />

                {/* Tables Section */}
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

                    {/* Competitor Insights */}
                    {/*<CompetitorInsights />*/}
                </div>

                {/* Footer */}
                <footer className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-8 text-sm text-gray-600">
                            <span>© 2025 Unilever Sri Lanka</span>
                            <span>Channel: {selectedChannel}</span>
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

