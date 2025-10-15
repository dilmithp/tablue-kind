// src/components/EnhancedCategoryBar.tsx
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export function EnhancedCategoryBar() {
    const categoryData = [
        { category: 'Air Freshener', sales: 8.2, color: '#0ea5e9' },
        { category: 'Oral Care', sales: 7.8, color: '#06b6d4' },
        { category: 'Baby Care', sales: 7.2, color: '#14b8a6' },
        { category: 'Body Soap', sales: 6.8, color: '#10b981' },
        { category: 'Baby Wipes', sales: 6.5, color: '#22c55e' },
        { category: 'Baby Powder', sales: 6.2, color: '#65a30d' },
        { category: 'Soap Bar', sales: 6.0, color: '#84cc16' },
        { category: 'Detergent', sales: 5.8, color: '#a3e635' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Category Sales</h2>
                <p className="text-sm text-gray-600 mt-1">Performance by product category</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={categoryData}
                    margin={{ top: 5, right: 30, left: 40, bottom: 60 }}
                >
                    <XAxis
                        dataKey="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#64748b', angle: -45, textAnchor: 'end' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: any) => [`${value}M`, 'Net Sales']}
                    />
                    <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
