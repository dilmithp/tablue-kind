// src/components/EnhancedCategoryBar.tsx
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export function EnhancedCategoryBar() {
    const categoryData = [
        { name: 'Air Freshener', value: 8.2, color: '#0ea5e9' },
        { name: 'Oral Care', value: 7.8, color: '#06b6d4' },
        { name: 'Baby Care', value: 7.2, color: '#14b8a6' },
        { name: 'Body Soap', value: 6.8, color: '#10b981' },
        { name: 'Baby Wipes', value: 6.5, color: '#22c55e' },
        { name: 'Baby Powder', value: 6.2, color: '#65a30d' },
        { name: 'Soap Bar', value: 6.0, color: '#84cc16' },
        { name: 'Detergent', value: 5.8, color: '#a3e635' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Category Sales</h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: any) => [`${value}M`, 'Sales']} />
                    <Bar dataKey="value">
                        {categoryData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
