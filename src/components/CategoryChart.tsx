// src/components/CategoryChart.tsx
'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryData } from '@/lib/types';
import { formatPercentage } from '@/lib/utils';

interface CategoryChartProps {
    data: CategoryData[];
}

export function CategoryChart({ data }: CategoryChartProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Category Performance
            </h3>

            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={35}
                        paddingAngle={2}
                        dataKey="percentage"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 mt-4">
                {data.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className="text-sm font-semibold">{formatPercentage(category.percentage)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
