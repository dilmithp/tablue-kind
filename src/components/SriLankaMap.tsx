// src/components/SriLankaMap.tsx
'use client';

import React, { useState } from 'react';
import { RegionalData } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface SriLankaMapProps {
    data: RegionalData[];
}

export function SriLankaMap({ data }: SriLankaMapProps) {
    const [selectedProvince, setSelectedProvince] = useState<string>('Western');

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🇱🇰 Sri Lanka Regional Performance
            </h2>

            {/* Map Placeholder */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="text-center text-gray-700">
                    <div className="text-6xl mb-2">🗺️</div>
                    <div className="text-sm">Interactive Sri Lankan Provinces</div>
                    <div className="text-xs text-gray-500">Click provinces below for details</div>
                </div>
            </div>

            {/* Province Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {data.map((province) => (
                    <button
                        key={province.province}
                        onClick={() => setSelectedProvince(province.province)}
                        className={`p-2 rounded text-xs font-medium transition-colors ${
                            selectedProvince === province.province
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {province.province}
                    </button>
                ))}
            </div>

            {/* Selected Province Details */}
            {selectedProvince && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-blue-900 mb-3">
                        📍 {selectedProvince} Province
                    </h3>

                    {(() => {
                        const province = data.find(d => d.province === selectedProvince);
                        if (!province) return <div>No data available</div>;

                        return (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-700">💰 Sales</div>
                                    <div className="text-lg font-bold text-blue-900">
                                        {formatCurrency(province.sales)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-700">📈 Growth</div>
                                    <div className="text-lg font-bold text-green-600">
                                        +{formatPercentage(province.growth)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-700">🎯 Market Share</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {formatPercentage(province.marketShare)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-700">🚦 Status</div>
                                    <div className="text-lg font-bold text-blue-600 capitalize">
                                        {province.status}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Province Rankings */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3">🏆 Province Rankings</h4>
                <div className="space-y-2">
                    {data
                        .sort((a, b) => b.sales - a.sales)
                        .map((province, index) => {
                            const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-orange-500', 'bg-blue-500', 'bg-green-500'];
                            return (
                                <div key={province.province} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${colors[index] || 'bg-gray-500'}`}>
                                            {index + 1}
                                        </div>
                                        <span className="text-sm font-medium">{province.province}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold">{formatCurrency(province.sales)}</div>
                                        <div className="text-xs text-green-600">+{formatPercentage(province.growth)}</div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
