// src/components/SriLankaMap.tsx
'use client';

import React, { useState } from 'react';

// Define the shape of the regional data from the API
interface RegionalAchievementData {
    name: string;
    totalSales: number;
    totalTarget: number;
    achievement: number;
}

interface SriLankaMapProps {
    data: RegionalAchievementData[];
}

// Helper to format LKR currency
const formatLKR = (value: number) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'N/A';
    return numValue.toLocaleString('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 0,
    });
};

// Helper to format percentages
const formatPercent = (value: number) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'N/A';
    return `${numValue.toFixed(1)}%`;
};

// Get color based on achievement percentage
const getColorByAchievement = (achievement: number): string => {
    if (achievement >= 100) return 'bg-green-500';
    if (achievement >= 80) return 'bg-lime-400';
    if (achievement >= 60) return 'bg-yellow-400';
    if (achievement >= 40) return 'bg-orange-400';
    return 'bg-red-500';
};

// Get text color based on achievement percentage
const getTextColorByAchievement = (achievement: number): string => {
    if (achievement >= 100) return 'text-green-600';
    if (achievement >= 80) return 'text-lime-600';
    if (achievement >= 60) return 'text-yellow-600';
    if (achievement >= 40) return 'text-orange-600';
    return 'text-red-600';
};

export function SriLankaMap({ data }: SriLankaMapProps) {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">No regional achievement data available.</p>
            </div>
        );
    }

    const selectedData = selectedRegion ? data.find(d => d.name === selectedRegion) : null;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🇱🇰 Regional Sales Heatmap - Sri Lanka
            </h3>

            {/* Legend */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-gray-700">Achievement %:</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-600">&lt;40%</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-orange-400 rounded"></div>
                    <span className="text-gray-600">40-60%</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span className="text-gray-600">60-80%</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-lime-400 rounded"></div>
                    <span className="text-gray-600">80-100%</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-600">≥100%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regional Tiles - Interactive Heatmap */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Click a Region for Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {data.map((region) => {
                            const achievement = typeof region.achievement === 'string' ? parseFloat(region.achievement) : region.achievement;
                            return (
                                <button
                                    key={region.name}
                                    onClick={() => setSelectedRegion(region.name)}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        selectedRegion === region.name
                                            ? 'border-blue-600 shadow-lg scale-105'
                                            : 'border-transparent hover:border-gray-300'
                                    } ${getColorByAchievement(achievement)}`}
                                >
                                    <div className="text-white">
                                        <div className="text-xs font-semibold mb-1">{region.name}</div>
                                        <div className="text-lg font-bold">{formatPercent(achievement)}</div>
                                        <div className="text-xs opacity-90">Achievement</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Region Details */}
                <div>
                    {selectedData ? (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-4 text-lg">
                                📍 {selectedData.name}
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Achievement %</span>
                                    <span className={`text-xl font-bold ${getTextColorByAchievement(selectedData.achievement)}`}>
                                        {formatPercent(selectedData.achievement)}
                                    </span>
                                </div>
                                <div className="h-px bg-blue-200"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">💰 Total Sales</span>
                                    <span className="text-base font-semibold text-gray-900">
                                        {formatLKR(selectedData.totalSales)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">🎯 Total Target</span>
                                    <span className="text-base font-semibold text-gray-900">
                                        {formatLKR(selectedData.totalTarget)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">📊 Gap</span>
                                    <span className={`text-base font-semibold ${
                                        (selectedData.totalSales - selectedData.totalTarget) >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                        {formatLKR(selectedData.totalSales - selectedData.totalTarget)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg h-full flex items-center justify-center">
                            <p className="text-gray-500 text-sm text-center">
                                👈 Select a region to view detailed performance metrics
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Regional Rankings */}
            <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">🏆 Regional Rankings by Sales</h4>
                <div className="space-y-2">
                    {data
                        .sort((a, b) => {
                            const salesA = typeof a.totalSales === 'string' ? parseFloat(a.totalSales) : a.totalSales;
                            const salesB = typeof b.totalSales === 'string' ? parseFloat(b.totalSales) : b.totalSales;
                            return salesB - salesA;
                        })
                        .map((region, index) => {
                            const achievement = typeof region.achievement === 'string' ? parseFloat(region.achievement) : region.achievement;
                            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                            return (
                                <div
                                    key={region.name}
                                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedRegion(region.name)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg w-8">{medal}</span>
                                        <span className="text-sm font-medium text-gray-800">{region.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-900">{formatLKR(region.totalSales)}</div>
                                        <div className={`text-xs font-semibold ${getTextColorByAchievement(achievement)}`}>
                                            {formatPercent(achievement)} Ach
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
