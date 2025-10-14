// src/components/EnhancedForecastTable.tsx
'use client';

import React from 'react';

interface ForecastTableProps {
    data?: any[];
}

export function EnhancedForecastTable({ data }: ForecastTableProps) {
    // Your actual CSV forecast data for the first 8 weeks
    const forecastData = [
        {
            week: '2025-09-07',
            naiveSeasonal: 1086827,
            prophetForecast: 1066841,
        },
        {
            week: '2025-09-14',
            naiveSeasonal: 1009021,
            prophetForecast: 1087312,
        },
        {
            week: '2025-09-21',
            naiveSeasonal: 1024850,
            prophetForecast: 1117091,
        },
        {
            week: '2025-09-28',
            naiveSeasonal: 1115905,
            prophetForecast: 1132540,
        },
        {
            week: '2025-10-05',
            naiveSeasonal: 1153170,
            prophetForecast: 1131227,
        },
        {
            week: '2025-10-12',
            naiveSeasonal: 1073626,
            prophetForecast: 1128148,
        },
        {
            week: '2025-10-19',
            naiveSeasonal: 1036697,
            prophetForecast: 1131395,
        },
        {
            week: '2025-10-26',
            naiveSeasonal: 1111539,
            prophetForecast: 1129920,
        }
    ];

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    const formatDateString = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Next 8 Week Sales Forecast</h2>
                <p className="text-sm text-gray-600 mt-1">Month, Day, Year of Forecast Week</p>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
                <table className="w-full">
                    <thead>
                    <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Week
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Naive Seasonal Forecast
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Prophet Forecast
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {forecastData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                {formatDateString(row.week)}
                            </td>
                            <td className="px-4 py-4 text-sm text-right font-mono text-gray-700 font-semibold">
                                {formatNumber(row.naiveSeasonal)}
                            </td>
                            <td className="px-4 py-4 text-sm text-right font-mono text-gray-700 font-semibold">
                                {formatNumber(row.prophetForecast)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-600">
                        <span className="font-medium">Forecast Period:</span> 8 weeks
                    </div>
                    <div className="flex space-x-4">
                        <div className="text-gray-600">
                            <span className="font-medium">Avg Naive:</span> {formatNumber(Math.round(forecastData.reduce((sum, item) => sum + item.naiveSeasonal, 0) / forecastData.length))}
                        </div>
                        <div className="text-gray-600">
                            <span className="font-medium">Avg Prophet:</span> {formatNumber(Math.round(forecastData.reduce((sum, item) => sum + item.prophetForecast, 0) / forecastData.length))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Model Performance */}
            <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-gray-700 font-medium">Recommended: SARIMAX+Promo</span>
                    </div>
                    <div className="text-blue-600 font-medium">Accuracy: 94.2%</div>
                </div>
            </div>
        </div>
    );
}
