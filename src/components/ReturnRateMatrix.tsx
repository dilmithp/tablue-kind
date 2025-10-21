// src/components/ReturnRateMatrix.tsx
'use client';

import React from 'react';

// Define the shape of the data we expect from the API
interface ReturnMatrixRow {
    portfolio: string;
    reason: string;
    return_value: number;
}

interface ReturnRateMatrixProps {
    data: ReturnMatrixRow[];
}

// Helper to format as percentage
const formatPercentage = (value: number) => {
    if (!value || value === 0) return '-';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '-';
    // Format as percentage with 1 decimal place
    return `${numValue.toFixed(1)}%`;
};

export function ReturnRateMatrix({ data }: ReturnRateMatrixProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">No return data available.</p>
            </div>
        );
    }

    // --- Pivot the data ---
    // 1. Get all unique portfolios and reasons
    const portfolios = [...new Set(data.map((item) => item.portfolio))].sort();
    const reasons = [...new Set(data.map((item) => item.reason))].sort();

    // 2. Create a lookup map for easy access
    const dataMap = new Map<string, number>();
    data.forEach((item) => {
        dataMap.set(`${item.portfolio}-${item.reason}`, Number(item.return_value) || 0);
    });

    // 3. Find the max value for color scaling (heatmap)
    const maxValue = Math.max(...data.map((item) => Number(item.return_value) || 0));
    // --- End of data pivot ---

    // Function to get color based on value
    const getCellColor = (value: number) => {
        if (!value || value === 0) return 'bg-white';
        // Simple linear scale: 0 = white, maxValue = red-500
        const intensity = (value / maxValue) * 500;
        if (intensity < 100) return 'bg-red-50';
        if (intensity < 200) return 'bg-red-100';
        if (intensity < 300) return 'bg-red-200';
        if (intensity < 400) return 'bg-red-300';
        return 'bg-red-400';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Returns by Reason (2024)
            </h3>
            <div className="overflow-x-auto overflow-y-auto h-[350px]">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200"
                        >
                            Portfolio
                        </th>
                        {reasons.map((reason) => (
                            <th
                                key={reason}
                                scope="col"
                                className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                            >
                                {reason}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {portfolios.map((portfolio) => (
                        <tr key={portfolio} className="hover:bg-gray-50">
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-semibold text-gray-800 border-r border-gray-200">
                                {portfolio}
                            </td>
                            {reasons.map((reason) => {
                                const value = dataMap.get(`${portfolio}-${reason}`) || 0;
                                return (
                                    <td
                                        key={reason}
                                        className={`px-3 py-3 whitespace-nowrap text-sm text-center text-gray-700 ${getCellColor(value)}`}
                                    >
                                        {formatPercentage(value)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}