// src/components/ReturnRateMatrix.tsx
'use client';

import React from 'react';

export function ReturnRateMatrix() {
  const returnRateData = [
    { channel: 'Pharmacy', damage: 0.15, expired: 0.17, wrongSupply: 0.16 },
    { channel: 'Retail Shop', damage: 0.13, expired: 0.15, wrongSupply: 0.14 },
    { channel: 'Supermarket', damage: 0.16, expired: 0.16, wrongSupply: 0.16 },
    { channel: 'Wholesale', damage: 0.16, expired: 0.14, wrongSupply: 0.15 }
  ];

  const getIntensityColor = (value: number) => {
    if (value >= 0.16) return 'bg-blue-700 text-white';
    if (value >= 0.15) return 'bg-blue-500 text-white';
    if (value >= 0.14) return 'bg-blue-300 text-white';
    return 'bg-blue-100 text-blue-900';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Return Rate by Channel</h2>
        <p className="text-sm text-gray-600 mt-1">Breakdown by return reason</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Channel</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Damage</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Expired</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Wrong Supply</th>
            </tr>
          </thead>
          <tbody>
            {returnRateData.map((row, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {row.channel}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getIntensityColor(row.damage)}`}>
                    {row.damage.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getIntensityColor(row.expired)}`}>
                    {row.expired.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getIntensityColor(row.wrongSupply)}`}>
                    {row.wrongSupply.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color Scale Legend */}
      <div className="flex items-center justify-center mt-4 space-x-4 text-xs">
        <span className="text-gray-600">OOS%</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-3 bg-blue-100 border border-gray-200"></div>
          <span className="text-gray-600">19.51%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-3 bg-blue-700 border border-gray-200"></div>
          <span className="text-gray-600">26.13%</span>
        </div>
      </div>
    </div>
  );
}