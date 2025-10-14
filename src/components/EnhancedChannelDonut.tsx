// src/components/EnhancedChannelDonut.tsx
'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function EnhancedChannelDonut() {
  const channelData = [
    { name: 'Wholesale', value: 32.12, color: '#1e40af' },
    { name: 'Pharmacy', value: 23.51, color: '#06b6d4' },
    { name: 'Supermarket', value: 23.81, color: '#10b981' },
    { name: 'Retail Shop', value: 20.56, color: '#8b5cf6' }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-blue-600 font-medium">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Channel Sales</h2>
        <p className="text-sm text-gray-600 mt-1">Distribution by sales channel</p>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {channelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {channelData.map((channel, index) => (
          <div key={channel.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3" 
                style={{ backgroundColor: channel.color }}
              />
              <span className="text-sm font-medium text-gray-700">{channel.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{channel.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}