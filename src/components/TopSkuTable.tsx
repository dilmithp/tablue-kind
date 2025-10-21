// src/components/TopSkuTable.tsx
'use client';

import React from 'react';

// Define the shape of the SKU data row from the API
interface SkuData {
    sku: string;
    sales: number;
    promo_uplift_percent: number;
    return_percent: number;
    oos_percent: number;
}

interface TopSkuTableProps {
    data: SkuData[];
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

export function TopSkuTable({ data }: TopSkuTableProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">No SKU performance data available for the selected filters.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top SKUs (by Sales)</h3>
            {/* Scrollable container for potentially long tables */}
            <div className="overflow-auto h-[400px]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        {/* Columns defined in the requirements */}
                        <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Sales</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Promo Uplift %</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Return %</th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">OOS %</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((sku, index) => (
                        <tr key={`${sku.sku}-${index}`} className="hover:bg-gray-50">
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{sku.sku}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-700">{formatLKR(sku.sales)}</td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm text-right font-semibold ${sku.promo_uplift_percent >= 12 ? 'text-green-600' : (sku.promo_uplift_percent > 0 ? 'text-orange-500' : 'text-red-600')}`}>
                                {formatPercent(sku.promo_uplift_percent)}
                            </td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm text-right ${sku.return_percent > 2.5 ? 'text-red-600' : 'text-gray-700'}`}>
                                {formatPercent(sku.return_percent)}
                            </td>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm text-right ${sku.oos_percent > 10 ? 'text-red-600' : 'text-gray-700'}`}>
                                {formatPercent(sku.oos_percent)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}