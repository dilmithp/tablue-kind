// src/components/ProfessionalAchievementChart.tsx
'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from 'recharts';
import { Target } from 'lucide-react';

// Define the shape of the data we expect from the API
interface AchievementData {
    name: string;
    totalSales: number;
    totalTarget: number;
    achievement: number;
}

interface ChartProps {
    data: AchievementData[];
}

// Helper to format the percentage
const formatPercent = (value: number) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'N/A';
    return `${numValue.toFixed(1)}%`;
};

// Custom Tooltip for more details
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const sales = (data.totalSales || 0).toLocaleString('en-LK', {
            style: 'currency',
            currency: 'LKR',
            maximumFractionDigits: 0,
        });
        const target = (data.totalTarget || 0).toLocaleString('en-LK', {
            style: 'currency',
            currency: 'LKR',
            maximumFractionDigits: 0,
        });

        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-bold text-gray-800">{label}</p>
                <p className="text-sm text-blue-600 font-semibold">{`Ach: ${formatPercent(
                    data.achievement
                )}`}</p>
                <p className="text-sm text-gray-600">{`Sales: ${sales}`}</p>
                <p className="text-sm text-gray-600">{`Target: ${target}`}</p>
            </div>
        );
    }
    return null;
};

export function ProfessionalAchievementChart({ data }: ChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">No achievement data available.</p>
            </div>
        );
    }

    // Add a 'fill' color based on performance
    const processedData = data.map((item) => ({
        ...item,
        achievement: Number(item.achievement) || 0,
        fill: (Number(item.achievement) || 0) >= 100 ? '#22c55e' : '#3b82f6', // Green if >= 100%, else Blue
    }));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Achievement % by Region (2024)
            </h3>
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={processedData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" unit="%" domain={[0, 'dataMax + 20']} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#6b7280"
                            fontSize={12}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="achievement" fill="#8884d8" barSize={30}>
                            <LabelList
                                dataKey="achievement"
                                position="right"
                                formatter={formatPercent}
                                fontSize={12}
                                fontWeight="bold"
                            />
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Add a 'Cell' import from recharts
import { Cell } from 'recharts';