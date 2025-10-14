// src/components/ForecastChart.tsx
'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { SalesData } from '@/lib/types';

interface ForecastChartProps {
    data: SalesData[];
    height?: number;
}

export function ForecastChart({ data, height = 300 }: ForecastChartProps) {
    // Enhanced data with beautiful styling
    const enhancedData = [
        // Historical actual data (darker, solid lines)
        { week: '2025-07-20', actual: 1045000, sarimax: null, prophet: null, naive: null },
        { week: '2025-07-27', actual: 1089000, sarimax: null, prophet: null, naive: null },
        { week: '2025-08-03', actual: 1067000, sarimax: null, prophet: null, naive: null },
        { week: '2025-08-10', actual: 1092000, sarimax: null, prophet: null, naive: null },
        { week: '2025-08-17', actual: 1134000, sarimax: null, prophet: null, naive: null },
        { week: '2025-08-24', actual: 1098000, sarimax: null, prophet: null, naive: null },
        { week: '2025-08-31', actual: 1157000, sarimax: null, prophet: null, naive: null },

        // Forecast data (brighter, dashed lines)
        { week: '2025-09-07', actual: null, sarimax: 1124743, prophet: 1066841, naive: 1086827 },
        { week: '2025-09-14', actual: null, sarimax: 1139692, prophet: 1087312, naive: 1009021 },
        { week: '2025-09-21', actual: null, sarimax: 1171292, prophet: 1117091, naive: 1024850 },
        { week: '2025-09-28', actual: null, sarimax: 1101363, prophet: 1132540, naive: 1115905 },
        { week: '2025-10-05', actual: null, sarimax: 1096294, prophet: 1131227, naive: 1153171 },
        { week: '2025-10-12', actual: null, sarimax: 1147926, prophet: 1128149, naive: 1073627 },
        { week: '2025-10-19', actual: null, sarimax: 1136783, prophet: 1131396, naive: 1036697 },
        { week: '2025-10-26', actual: null, sarimax: 1067240, prophet: 1129921, naive: 1111540 }
    ];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatValue = (value: number) => {
        return `${(value / 1000).toFixed(0)}K`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-2">{formatDate(label)}</p>
                    {payload.map((entry: any, index: number) => {
                        if (entry.value) {
                            return (
                                <div key={index} className="flex items-center justify-between min-w-[200px]">
                                    <div className="flex items-center">
                                        <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="text-sm text-gray-700 capitalize">{entry.dataKey}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">
                    {entry.value.toLocaleString()}
                  </span>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Sales Forecasting & Projections</h2>
                        <p className="text-sm text-gray-600 mt-1">Historical performance with 8-week AI predictions</p>
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors">
                            8 Weeks
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors">
                            YTD
                        </button>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={enhancedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                    <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickFormatter={formatDate}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickFormatter={formatValue}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* Actual Sales Line - Thick Blue */}
                    <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#1e40af"
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#1e40af', strokeWidth: 2, stroke: '#ffffff' }}
                        connectNulls={false}
                        name="Actual"
                    />

                    {/* SARIMAX+Promo - Red Dashed */}
                    <Line
                        type="monotone"
                        dataKey="sarimax"
                        stroke="#dc2626"
                        strokeWidth={3}
                        strokeDasharray="8 4"
                        dot={{ r: 4, fill: '#dc2626' }}
                        connectNulls={false}
                        name="SARIMAX+Promo"
                    />

                    {/* Prophet - Green Dashed */}
                    <Line
                        type="monotone"
                        dataKey="prophet"
                        stroke="#059669"
                        strokeWidth={2}
                        strokeDasharray="4 2"
                        dot={{ r: 3, fill: '#059669' }}
                        connectNulls={false}
                        name="Prophet"
                    />

                    {/* Naive Seasonal - Purple Dotted */}
                    <Line
                        type="monotone"
                        dataKey="naive"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        strokeDasharray="2 2"
                        dot={{ r: 3, fill: '#7c3aed' }}
                        connectNulls={false}
                        name="Naive Seasonal"
                    />

                    {/* Forecast Separator */}
                    <ReferenceLine
                        x="2025-08-31"
                        stroke="#94a3b8"
                        strokeDasharray="2 2"
                        label={{ value: "→ Forecast", position: "topRight" }}
                    />

                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="line"
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Chart Footer */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-4 h-1 bg-blue-600 rounded mr-2"></div>
                        <span>Historical Data</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-1 bg-red-600 rounded mr-2"></div>
                        <span>AI Predictions</span>
                    </div>
                </div>
                <div className="text-xs">
                    <span className="font-medium">Recommended:</span> SARIMAX+Promo
                </div>
            </div>
        </div>
    );
}
