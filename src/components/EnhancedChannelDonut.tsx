// src/components/EnhancedChannelDonut.tsx
'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the shape of the data we expect from the API
interface ChannelData {
    channel: string;
    sales: number;
}

// Define the props for our component
interface EnhancedChannelDonutProps {
    data: ChannelData[];
}

// Pre-defined color palette
const COLORS = [
    '#0088FE', // Blue
    '#00C49F', // Green
    '#FFBB28', // Yellow
    '#FF8042', // Orange
    '#AF19FF', // Purple
    '#FF1975', // Pink
];

// Helper to format numbers to LKR
const formatLKR = (value: number) => {
    return `LKR ${new Intl.NumberFormat('en-LK').format(value)}`;
};

export function EnhancedChannelDonut({ data }: EnhancedChannelDonutProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center justify-center h-full">
                <p className="text-gray-500">No channel data available.</p>
            </div>
        );
    }

    // Calculate total sales to get percentages
    const totalSales = data.reduce((acc, entry) => acc + (Number(entry.sales) || 0), 0);

    // Format data for the chart, adding percentages and colors
    const chartData = data.map((entry, index) => {
        const salesValue = Number(entry.sales) || 0;
        return {
            name: entry.channel,
            value: salesValue,
            percentage: ((salesValue / totalSales) * 100).toFixed(1),
            color: COLORS[index % COLORS.length],
        };
    });

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; percentage: string } }> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-bold text-gray-800">{data.name}</p>
                    <p className="text-sm text-blue-600">{`${formatLKR(data.value)}`}</p>
                    <p className="text-sm text-gray-600">{`(${data.percentage}%)`}</p>
                </div>
            );
        }
        return null;
    };

    // Custom label to show percentage outside the pie
    const renderCustomLabel = (entry: { percentage: string }) => {
        return `${entry.percentage}%`;
    };

    return (
        // Using the same styling as the cards in page.tsx
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Channel (2024)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            label={renderCustomLabel}
                            labelLine={true}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            iconType="circle"
                            formatter={(value) => {
                                const data = chartData.find(d => d.name === value);
                                return (
                                    <span className="text-gray-700 font-medium">
                                        {value} ({data?.percentage}%)
                                    </span>
                                );
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Default export in case it's needed
export default EnhancedChannelDonut;