// src/lib/types.ts
export interface SalesData {
  week: string;
  value: number;
  model: 'Actual' | 'SARIMAX+Promo' | 'Prophet' | 'SARIMA';
  isForecast: boolean;
  confidence?: {
    lower: number;
    upper: number;
  };
}

export interface KPIMetric {
  id: string;
  name: string;
  value: number | string;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'success' | 'warning' | 'danger' | 'info';
  description?: string;
}

export interface RegionalData {
  province: string;
  sales: number;
  growth: number;
  marketShare: number;
  status: 'strong' | 'good' | 'monitor' | 'opportunity';
}

export interface CategoryData {
  category: string;
  percentage: number;
  sales: number;
  growth: number;
  color: string;
}

export interface ChannelData {
  channel: string;
  percentage: number;
  sales: number;
  returnRate: number;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  value: string;
  description: string;
  type: 'success' | 'warning' | 'info';
  trend?: 'up' | 'down';
}

export interface Alert {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  message: string;
  timestamp: string;
  action?: string;
}

export interface DashboardData {
  kpis: KPIMetric[];
  salesForecast: SalesData[];
  regional: RegionalData[];
  categories: CategoryData[];
  channels: ChannelData[];
  achievements: Achievement[];
  alerts: Alert[];
  lastUpdated: string;
}