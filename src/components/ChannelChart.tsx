// src/components/ChannelChart.tsx
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { ChannelData } from '@/lib/types';
import { formatPercentage } from '@/lib/utils';

interface ChannelChartProps {
    data: ChannelData[];
}

export function ChannelChart({ data }: ChannelChartProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Channel Analysis
            </h3>

            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-4 mt-4">
                {data.map((channel) => (
                    <div key={channel.channel} className="text-center">
                        <div className="text-sm font-medium">{channel.channel}</div>
                        <div className="text-lg font-bold text-gray-900">{formatPercentage(channel.percentage)}</div>
                        <div className="text-xs text-gray-600">
                            {formatPercentage(channel.returnRate)} returns
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
