// src/components/ProfessionalAchievementChart.tsx
'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

interface AchievementChartProps {
  data: any[];
}

export function ProfessionalAchievementChart({ data }: AchievementChartProps) {
  // Generate achievement data similar to reference image
  const achievementData = [
    { month: 'Jan', achievement: 48000, sales: 45000, target: 50000 },
    { month: 'Feb', achievement: 52000, sales: 48000, target: 50000 },
    { month: 'Mar', achievement: 45000, sales: 47000, target: 50000 },
    { month: 'Apr', achievement: 55000, sales: 52000, target: 50000 },
    { month: 'May', achievement: 48000, sales: 46000, target: 50000 },
    { month: 'Jun', achievement: 53000, sales: 51000, target: 50000 },
    { month: 'Jul', achievement: 46000, sales: 44000, target: 50000 },
    { month: 'Aug', achievement: 49000, sales: 47000, target: 50000 },
    { month: 'Sep', achievement: 52000, sales: 50000, target: 50000 },
    { month: 'Oct', achievement: 54000, sales: 53000, target: 50000 },
    { month: 'Nov', achievement: 51000, sales: 49000, target: 50000 },
    { month: 'Dec', achievement: 56000, sales: 55000, target: 50000 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Achievement%</h2>
          <p className="text-sm text-gray-600 mt-1">Sales vs Target Performance</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-gray-700">Achievement%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-400 rounded-full mr-2"></div>
            <span className="text-gray-700">Sales Quantity</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-200 rounded-full mr-2"></div>
            <span className="text-gray-700">Target Quantity</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={achievementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAchievement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#1e40af" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5eead4" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#5eead4" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(value) => `${value/1000}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="target" 
            stackId="1"
            stroke="#5eead4" 
            fillOpacity={1}
            fill="url(#colorTarget)" 
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stackId="1"
            stroke="#14b8a6" 
            fillOpacity={1}
            fill="url(#colorSales)" 
          />
          <Area 
            type="monotone" 
            dataKey="achievement" 
            stackId="2"
            stroke="#1e40af" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAchievement)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}