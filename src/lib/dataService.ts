// src/lib/dataService.ts
import { DashboardData, SalesData, KPIMetric, RegionalData, CategoryData, ChannelData, Achievement, Alert } from './types';

export class DataService {

    // Remove async and delays - return data immediately
    static getDashboardData(): DashboardData {
        return {
            kpis: {
                ytdSales: 37000000,
                returnRate: 2.8,
                growthPercent: 12.5,
                oosRate: 14.2,
                promoUplift: 24.5
            },
            salesForecast: this.generateForecastData(),
            channels: this.generateChannelData(),
            outletCount: 1250,
            skuCount: 342,
            regionList: ['All Regions', 'Western', 'Central', 'Southern', 'Northern', 'Eastern'],
            channelList: ['All Channels', 'Supermarket', 'Hypermarket', 'Convenience Store'],
            forecastTable: [],
            achievementData: this.generateAchievements(),
            returnMatrixData: [],
            lastUpdated: new Date().toISOString()
        };
    }

    static generateForecastData(): SalesData[] {
        return [
            { week: '2025-09-07', value: 1124742.55, model: 'SARIMAX+Promo', isForecast: true },
            { week: '2025-09-14', value: 1139692.21, model: 'SARIMAX+Promo', isForecast: true },
            { week: '2025-09-21', value: 1171291.75, model: 'SARIMAX+Promo', isForecast: true },
            { week: '2025-08-24', value: 1098234.56, model: 'Actual', isForecast: false },
            { week: '2025-08-31', value: 1156789.12, model: 'Actual', isForecast: false },
        ];
    }

    static generateKPIs(): KPIMetric[] {
        return [
            { id: 'total-sales', name: 'Total Sales', value: 1134567, target: 1100000, unit: 'LKR', trend: 'up', trendValue: 5.2, status: 'success' },
            { id: 'growth-rate', name: 'Growth Rate', value: 12.8, target: 10.0, unit: '%', trend: 'up', trendValue: 2.3, status: 'success' },
            { id: 'promo-uplift', name: 'Promo Uplift', value: 24.5, target: 20.0, unit: '%', trend: 'up', trendValue: 4.1, status: 'success' },
            { id: 'return-rate', name: 'Return Rate', value: 2.8, target: 3.5, unit: '%', trend: 'down', trendValue: -0.3, status: 'success' },
            { id: 'market-share', name: 'Market Share', value: 31.2, target: 30.0, unit: '%', trend: 'up', trendValue: 0.8, status: 'success' }
        ];
    }

    static generateRegionalData(): RegionalData[] {
        return [
            { province: 'Western', sales: 397000, growth: 15.2, marketShare: 35.0, status: 'strong' },
            { province: 'Central', sales: 170000, growth: 11.8, marketShare: 15.0, status: 'good' },
            { province: 'Southern', sales: 136000, growth: 13.5, marketShare: 12.0, status: 'good' },
        ];
    }

    static generateCategoryData(): CategoryData[] {
        return [
            { category: 'Personal Care', percentage: 55.0, sales: 623412, growth: 14.2, color: '#3498DB' },
            { category: 'Home Care', percentage: 30.0, sales: 340370, growth: 11.5, color: '#2ECC71' },
            { category: 'Foods & Refreshment', percentage: 15.0, sales: 170185, growth: 9.8, color: '#F1C40F' }
        ];
    }

    static generateChannelData(): ChannelData[] {
        return [
            { channel: 'Wholesale', percentage: 40.0, sales: 453827, returnRate: 2.1, color: '#5778a4' },
            { channel: 'Supermarkets', percentage: 25.0, sales: 283642, returnRate: 1.8, color: '#e49444' },
        ];
    }

    static generateAchievements(): Achievement[] {
        return [
            { name: 'Western', totalSales: 15000000, totalTarget: 13000000, achievement: 115.2, type: 'success', trend: 'up' },
            { name: 'Central', totalSales: 8000000, totalTarget: 9000000, achievement: 88.9, type: 'warning', trend: 'down' },
            { name: 'Southern', totalSales: 7000000, totalTarget: 7500000, achievement: 93.3, type: 'info', trend: 'up' },
        ];
    }

    static generateAlerts(): Alert[] {
        return [
            { id: '1', type: 'info', message: 'Dashboard loaded successfully!', timestamp: '1 min ago' },
        ];
    }
}
