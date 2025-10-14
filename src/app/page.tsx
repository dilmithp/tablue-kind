// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DashboardData } from '@/lib/types';
import { DataService } from '@/lib/dataService';
import { KPICard } from '@/components/KPICard';
import { ForecastChart } from '@/components/ForecastChart';
import { SriLankaMap } from '@/components/SriLankaMap';
import { CategoryChart } from '@/components/CategoryChart';
import { ChannelChart } from '@/components/ChannelChart';
import { AchievementsPanel } from '@/components/AchievementsPanel';
import { AlertsPanel } from '@/components/AlertsPanel';
import { RefreshCw, Download, Settings } from 'lucide-react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await DataService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tableau-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-tableau-blue mx-auto mb-4" />
          <p className="text-tableau-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-tableau-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-tableau-gray-600">Error loading dashboard data</p>
        </div>
      </div>
    );
  }

  const { kpis, salesForecast, regional, categories, channels, achievements, alerts } = dashboardData;

  return (
    <div className="min-h-screen bg-tableau-gray-50">
      {/* Header */}
      <header className="tableau-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-tableau-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-tableau-navy">
                Unilever Sri Lanka - Sales Performance Dashboard
              </h1>
              <p className="text-sm text-tableau-gray-600">
                AI-powered sales forecasting and performance analytics
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-tableau-gray-600">
              Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
            </div>
            <button className="tableau-button">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="tableau-filter">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="tableau-filter">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-6 p-6">
        {kpis.map((kpi) => (
          <KPICard key={kpi.id} metric={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6 px-6 pb-6">
        {/* Forecast Chart - Takes 2/3 width */}
        <div className="col-span-2">
          <ForecastChart data={salesForecast} height={400} />
        </div>

        {/* Regional Map - Takes 1/3 width */}
        <div>
          <SriLankaMap data={regional} />
        </div>
      </div>

      {/* Secondary Analysis Row */}
      <div className="grid grid-cols-4 gap-6 px-6 pb-6">
        <CategoryChart data={categories} />
        <ChannelChart data={channels} />
        <AchievementsPanel achievements={achievements} />
        <AlertsPanel alerts={alerts} />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-tableau-gray-200 px-6 py-4">
        <div className="flex justify-between items-center text-sm text-tableau-gray-600">
          <div>
            © 2025 Unilever Sri Lanka. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <span>Data sources: ERP, CRM, Market Research</span>
            <span>•</span>
            <span>Refresh frequency: Every 15 minutes</span>
          </div>
        </div>
      </footer>
    </div>
  );
}