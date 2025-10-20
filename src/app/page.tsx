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
import { DashboardData } from '@/lib/types';
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
    // --- NEW STATE FOR FILTERS ---
    const [selectedRegion, setSelectedRegion] = useState('All Regions');
    const [selectedChannel, setSelectedChannel] = useState('All Channels');

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- UPDATED useEffect ---
    // This now re-runs whenever the 'selectedRegion' or 'selectedChannel' changes
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);

                // Build the API URL with filter parameters
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
    }, [selectedRegion, selectedChannel]); // <-- This array makes the hook re-run on change


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

    // --- ALL 5 KPIs ARE NOW LIVE ---
    const promoUpliftValue = Number(dashboardData?.kpis?.promoUplift) || 0;
    const returnRateValue = Number(dashboardData?.kpis?.returnRate) || 0;
    const oosRateValue = Number(dashboardData?.kpis?.oosRate) || 0;
    const growthPercentValue = Number(dashboardData?.kpis?.growthPercent) || 0;

    // Helper to ensure status is the correct type
    const getStatus = (condition: boolean, successStatus: 'success' | 'warning' | 'danger' | 'info', failStatus: 'success' | 'warning' | 'danger' | 'info'): 'success' | 'warning' | 'danger' | 'info' => {
        return condition ? successStatus : failStatus;
    };

    const enhancedKPIs = [
        {
            id: 'ytd-sales',
            name: 'YTD Sales (2024)',
            value: `LKR ${formatLargeNumber(dashboardData?.kpis?.ytdSales || 0)}`,
            target: 40000000,
            unit: '',
            trend: 'up' as const,
            trendValue: 5.2, // This could also be data-driven
            status: 'success' as const
        },
        {
            id: 'growth-rate',
            name: 'Growth % (vs 2023)',
            value: growthPercentValue.toFixed(1),
            target: 0,
            unit: '%',
            trend: (growthPercentValue >= 0 ? 'up' : 'down') as const,
            trendValue: growthPercentValue,
            status: getStatus(growthPercentValue >= 0, 'success', 'danger')
        },
        {
            id: 'promo-uplift',
            name: 'Promo Uplift %',
            value: promoUpliftValue.toFixed(1),
            target: 15,
            unit: '%',
            trend: (promoUpliftValue >= 15 ? 'up' : 'down') as const,
            trendValue: promoUpliftValue,
            status: promoUpliftValue >= 15 ? 'success' : (promoUpliftValue > 0 ? 'warning' : 'danger')
        },
        {
            id: 'return-rate',
            name: 'Return Rate %',
            value: returnRateValue.toFixed(1),
            target: 3.0,
            unit: '%',
            trend: (returnRateValue <= 3.0 ? 'down' : 'up') as const,
            trendValue: returnRateValue - 3.0,
            status: getStatus(returnRateValue <= 3.0, 'success', 'warning')
        },
        {
            id: 'oos-rate',
            name: 'OOS % (2024)',
            value: oosRateValue.toFixed(1),
            target: 15.0,
            unit: '%',
            trend: (oosRateValue <= 15.0 ? 'down' : 'up') as const,
            trendValue: oosRateValue - 15.0,
            status: getStatus(oosRateValue <= 15.0, 'success', 'warning')
        }
    ];


    const kpiIcons = [
        <TrendingUp key="icon-0" className="w-5 h-5 text-blue-600" />,
        <Target key="icon-1" className="w-5 h-5 text-red-600" />,
        <Gift key="icon-2" className="w-5 h-5 text-purple-600" />,
        <RotateCcw key="icon-3" className="w-5 h-5 text-green-600" />,
        <PieChart key="icon-4" className="w-5 h-5 text-orange-600" />
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with working filters */}
            <TableauHeader
                title="Trade Analytics - Head of MT Dashboard"
                regionList={dashboardData.regionList || []}
                channelList={dashboardData.channelList || []}
                selectedRegion={selectedRegion}
                selectedChannel={selectedChannel}
                onRegionChange={setSelectedRegion}
                onChannelChange={setSelectedChannel}
            />

            <div className="p-8 space-y-8">
                {/* KPI Cards Row - Now 100% Live */}
                <div className="grid grid-cols-5 gap-6">
                    {enhancedKPIs.map((kpi, index) => (
                        <EnhancedKPICard
                            key={kpi.id}
                            metric={kpi}
                            icon={kpiIcons[index]}
                        />
                    ))}
                </div>

                {/* Outlet & SKU Cards - Live */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase">Active Outlets</h3>
                                <div className="text-4xl font-bold text-gray-900">
                                    {dashboardData.outletCount}
                                </div>
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
                                <h3 className="text-sm font-semibold text-gray-700 uppercase">Active SKUs</h3>
                                <div className="text-4xl font-bold text-gray-900">
                                    {dashboardData.skuCount}
                                </div>
                                <div className="text-sm text-gray-600">Stock keeping units</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Charts Row - Live */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-8">
                        <ForecastChart data={dashboardData.salesForecast} height={350} />
                    </div>
                    <div className="col-span-4">
                        <EnhancedForecastTable data={dashboardData.forecastTable} />
                    </div>
                </div>

                {/* Bottom Charts Row - Live */}
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-6">
                        <ProfessionalAchievementChart data={dashboardData.achievementData} />
                    </div>
                    <div className="col-span-3">
                        {/* --- THIS IS THE FINAL CHANGE ---
                            We are now passing the live matrix data.
                        */}
                        <ReturnRateMatrix data={dashboardData.returnMatrixData} />
                    </div>
                    <div className="col-span-3">
                        <EnhancedChannelDonut data={dashboardData.channels} />
                    </div>
                </div>

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