// src/components/TopBottomOutletTable.tsx
'use client';

import React from 'react';
import { format } from 'date-fns';

// Define the shape of the outlet data row from the API
interface OutletData {
    outlet: string;
    region: string;
    territory: string; // Added territory
    sales: number;
    target: number;
    achievement: number;
    oos_percent: number;
    return_percent: number;
    last_visit_date: string | null;
}

interface TopBottomOutletTableProps {
    topData: OutletData[];
    bottomData: OutletData[];
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

// Helper to format dates
const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
        // Assuming the date is in 'YYYY-MM-DD' format from DB
        return format(new Date(dateString), 'dd-MMM-yyyy');
    } catch (error) {
        console.error("Error formatting outlet visit date:", dateString, error);
        return dateString; // Return original string if formatting fails
    }
};

// Reusable Table component
const OutletTable = ({ title, data }: { title: string; data: OutletData[] }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">{`No ${title.toLowerCase()} outlets found for the selected filters.`}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title} Outlets (by Achievement %)</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {/* Columns defined in the requirements */}
                        <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Outlet</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Region/Territory</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Sales</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Target</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Ach %</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">OOS %</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Return %</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Visit</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((outlet) => (
                        <tr key={outlet.outlet} className="hover:bg-gray-50">
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{outlet.outlet}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{`${outlet.region} / ${outlet.territory}`}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-700">{formatLKR(outlet.sales)}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-700">{formatLKR(outlet.target)}</td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm text-right font-semibold ${outlet.achievement >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercent(outlet.achievement)}
                            </td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm text-right ${outlet.oos_percent > 15 ? 'text-red-600' : 'text-gray-700'}`}>
                                {formatPercent(outlet.oos_percent)}
                            </td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm text-right ${outlet.return_percent > 5 ? 'text-red-600' : 'text-gray-700'}`}>
                                {formatPercent(outlet.return_percent)}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(outlet.last_visit_date)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main component that renders both tables
export function TopBottomOutletTable({ topData, bottomData }: TopBottomOutletTableProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <OutletTable title="Top 5" data={topData} />
            <OutletTable title="Bottom 5" data={bottomData} />
        </div>
    );
}