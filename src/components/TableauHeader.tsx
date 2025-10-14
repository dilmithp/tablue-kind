// src/components/TableauHeader.tsx
'use client';

import React from 'react';
import { Calendar, Filter, Download, RefreshCw, Settings } from 'lucide-react';

interface TableauHeaderProps {
  title: string;
  lastUpdated: string;
}

export function TableauHeader({ title, lastUpdated }: TableauHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-blue-200 text-sm">
                Trade Analytics Dashboard • Executive Overview
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-4">
            {/* Month Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-blue-200 text-sm">Month</span>
              <select className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                <option className="text-gray-900">All</option>
                <option className="text-gray-900">January</option>
                <option className="text-gray-900">February</option>
                <option className="text-gray-900">March</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-blue-200 text-sm">Date</span>
              <select className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                <option className="text-gray-900">All</option>
                <option className="text-gray-900">Last 7 Days</option>
                <option className="text-gray-900">Last 30 Days</option>
                <option className="text-gray-900">YTD</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center">
                <Download className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}