// src/components/ForecastChart.tsx
'use client';

import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { SalesData } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';

interface ForecastChartProps {
    data: SalesData[];
    height?: number;
}

export function ForecastChart({ data, height = 400 }: ForecastChartProps) {
    const [selectedModels, setSelectedModels] = useState<string[]>([
        'Actual', 'SARIMAX+Promo', 'Prophet'
    ]);

    const chartData = React.useMemo(() => {
        const grouped = data.reduce((acc, item) => {
            const key = item.week;
            if (!acc[key]) {
                acc[key] = { week: key };
            }
            acc[key][item.model] = item.value;
            return acc;
        }, {} as Record<string, any>);

        return Object.values(grouped);
    }, [data]);

    const models = [
        { key: 'Actual', color: '#0078D4', strokeWidth: 3 },
        { key: 'SARIMAX+Promo', color: '#FF6B35', strokeWidth: 2 },
        { key: 'Prophet', color: '#7F8C8D', strokeWidth: 2 },
        { key: 'SARIMA', color: '#BDC3C7', strokeWidth: 1 }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                8-Week Sales Forecast vs Actual
            </h2>

            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {models
                        .filter(model => selectedModels.includes(model.key))
                        .map(model => (
                            <Line
                                key={model.key}
                                type="monotone"
                                dataKey={model.key}
                                stroke={model.color}
                                strokeWidth={model.strokeWidth}
                                dot={false}
                            />
                        ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
