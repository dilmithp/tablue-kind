// src/components/EnhancedForecastTable.tsx
'use client';

import React from 'react';
import { TrendingUp, BarChart, Brain } from 'lucide-react';
import { format } from 'date-fns';

// Define the shape of the data we expect from the API
interface ForecastRow {
    week: string;
    prophet: number;
    naive_seasonal: number;
    sarima: number;
    sarimax_promo: number;
}

interface EnhancedForecastTableProps {
    data: ForecastRow[];
}

// Helper to format the large LKR numbers
const formatLKR = (value: number) => {
    if (!value) return 'N/A';
    // Format to LKR 1.12M
    return `LKR ${(value / 1_000_000).toFixed(2)}M`;
};

// Helper to format the week
const formatWeek = (weekString: string) => {
    try {
        // --- THIS IS THE FIX ---
        // The weekString is already a full ISO timestamp (e.g., "2025-09-06T18:30:00.000Z")
        // We can pass it directly to new Date() without adding "T00:00:00".
        return format(new Date(weekString), 'dd-MMM-yyyy');
    } catch (error) {
        console.error("Error formatting date:", weekString, error);
        return weekString;
    }
};

export function EnhancedForecastTable({ data }: EnhancedForecastTableProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">No forecast data available.</p>
            </div>
        );
    }

    // Find the best model (SARIMAX+Promo) to highlight
    const bestModelKey = 'sarimax_promo';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Next 8 Week Sales Forecast
            </h3>
            {/* We set a fixed height and allow vertical scroll */}
            <div className="overflow-y-auto h-[350px]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th
                            scope="col"
                            className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                            Week
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                            Forecast (SARIMAX)
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row) => (
                        <tr key={row.week} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                                {formatWeek(row.week)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-blue-700 text-center">
                                {formatLKR(row[bestModelKey as keyof ForecastRow] as number)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}