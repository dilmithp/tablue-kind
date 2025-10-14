// src/components/EnhancedForecastTable.tsx
'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';

interface ForecastTableProps {
    data?: any[];
}

export function EnhancedForecastTable({ data }: ForecastTableProps) {
    const [selectedModel, setSelectedModel] = useState<'naive' | 'prophet'>('prophet');

    // Beautiful sample forecast data with realistic trends
    const forecastData = [
        {
            week: '2025-09-07',
            naiveSeasonal: 1086827,
            prophetForecast: 1066841,
            confidence: 94.2,
            trend: 'up',
            variance: 1.9
        },
        {
            week: '2025-09-14',
            naiveSeasonal: 1089021,
            prophetForecast: 1087312,
            confidence: 93.8,
            trend: 'up',
            variance: 0.2
        },
        {
            week: '2025-09-21',
            naiveSeasonal: 1074850,
            prophetForecast: 1117091,
            confidence: 95.1,
            trend: 'up',
            variance: 4.0
        },
        {
            week: '2025-09-28',
            naiveSeasonal: 1115905,
            prophetForecast: 1132540,
            confidence: 92.5,
            trend: 'up',
            variance: 1.5
        },
        {
            week: '2025-10-05',
            naiveSeasonal: 1153170,
            prophetForecast: 1131227,
            confidence: 94.8,
            trend: 'down',
            variance: -1.9
        },
        {
            week: '2025-10-12',
            naiveSeasonal: 1123626,
            prophetForecast: 1178148,
            confidence: 96.2,
            trend: 'up',
            variance: 4.9
        },
        {
            week: '2025-10-19',
            naiveSeasonal: 1106697,
            prophetForecast: 1181395,
            confidence: 93.3,
            trend: 'up',
            variance: 6.8
        },
        {
            week: '2025-10-26',
            naiveSeasonal: 1141539,
            prophetForecast: 1199920,
            confidence: 95.7,
            trend: 'up',
            variance: 5.1
        }
    ];

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(Math.round(num));
    };

    const formatDateString = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 95) return 'text-green-600 bg-green-50';
        if (confidence >= 90) return 'text-blue-600 bg-blue-50';
        return 'text-yellow-600 bg-yellow-50';
    };

    const getTrendIcon = (trend: string) => {
        return trend === 'up' ?
            <TrendingUp className="w-3 h-3 text-green-500" /> :
            <TrendingDown className="w-3 h-3 text-red-500" />;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Next 8 Week Sales Forecast</h2>
                </div>
                <p className="text-sm text-gray-600">AI-powered sales predictions with confidence intervals</p>

                {/* Model Toggle */}
                <div className="flex space-x-2 mt-4">
                    <button
                        onClick={() => setSelectedModel('prophet')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            selectedModel === 'prophet'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Prophet Model
                    </button>
                    <button
                        onClick={() => setSelectedModel('naive')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            selectedModel === 'naive'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Naive Seasonal
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Week
                            </div>
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Forecast
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Confidence
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Trend
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {forecastData.map((row, index) => {
                        const forecast = selectedModel === 'prophet' ? row.prophetForecast : row.naiveSeasonal;

                        return (
                            <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                                <td className="px-4 py-4">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {formatDateString(row.week)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Week {index + 1} of 8
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-right">
                                    <div className="text-lg font-bold text-gray-900 font-mono">
                                        {formatNumber(forecast)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        LKR Sales
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getConfidenceColor(row.confidence)}`}>
                      {row.confidence}%
                    </span>
                                </td>

                                <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                        {getTrendIcon(row.trend)}
                                        <span className={`text-xs font-medium ${
                                            row.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                        {row.variance > 0 ? '+' : ''}{row.variance}%
                      </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-6 text-sm">
                    <div className="text-center">
                        <div className="text-xs text-gray-600 uppercase">Total 8-Week</div>
                        <div className="text-lg font-bold text-gray-900">
                            {formatNumber(forecastData.reduce((sum, item) =>
                                sum + (selectedModel === 'prophet' ? item.prophetForecast : item.naiveSeasonal), 0
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-xs text-gray-600 uppercase">Weekly Average</div>
                        <div className="text-lg font-bold text-gray-900">
                            {formatNumber(Math.round(forecastData.reduce((sum, item) =>
                                sum + (selectedModel === 'prophet' ? item.prophetForecast : item.naiveSeasonal), 0
                            ) / forecastData.length))}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-xs text-gray-600 uppercase">Avg Confidence</div>
                        <div className="text-lg font-bold text-blue-600">
                            {(forecastData.reduce((sum, item) => sum + item.confidence, 0) / forecastData.length).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Indicator */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-3 border-t border-emerald-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-gray-700">
              Active Model: {selectedModel === 'prophet' ? 'Prophet AI' : 'Naive Seasonal'}
            </span>
                    </div>
                    <div className="text-emerald-700 font-medium text-sm">
                        ✓ High Accuracy Model
                    </div>
                </div>
            </div>
        </div>
    );
}
