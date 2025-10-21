// src/components/ExecutionWatchlistTable.tsx
'use client';

import React from 'react';

// Define the shape of the watchlist data row from the API
interface WatchlistData {
    outlet: string;
    region: string;
    territory: string;
    oos_percent: number;
    growth_percent: number;
    return_percent: number;
}

interface ExecutionWatchlistTableProps {
    data: WatchlistData[];
}

// Helper to format percentages
const formatPercent = (value: number) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'N/A';
    return `${numValue.toFixed(1)}%`;
};

export function ExecutionWatchlistTable({ data }: ExecutionWatchlistTableProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">Watchlist is clear! No outlets meet the high-risk criteria.</p>
            </div>
        );
    }

    // Define thresholds for highlighting (updated to realistic FMCG standards)
    const oosThreshold = 10; // Updated from 15% to 10%
    const returnThreshold = 2.5; // Updated from 5% to 2.5%

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Watchlist</h3>
            <p className="text-sm text-gray-600 mb-4">
                Outlets with OOS &gt; {oosThreshold}% AND (Negative Growth OR Returns &gt; {returnThreshold}%)
            </p>
            {/* Scrollable container */}
            <div className="overflow-auto h-[400px]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        {/* Columns defined in the requirements */}
                        <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Outlet</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Region/Territory</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">OOS %</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Growth %</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Return %</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((outlet) => (
                        <tr key={outlet.outlet} className="hover:bg-yellow-50">
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{outlet.outlet}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{`${outlet.region} / ${outlet.territory}`}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-right font-semibold text-red-600">
                                {formatPercent(outlet.oos_percent)}
                            </td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm text-right font-semibold ${outlet.growth_percent < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                                {formatPercent(outlet.growth_percent)}
                            </td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm text-right font-semibold ${outlet.return_percent > returnThreshold ? 'text-red-600' : 'text-gray-700'}`}>
                                {formatPercent(outlet.return_percent)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}