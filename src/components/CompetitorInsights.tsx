// src/components/CompetitorInsights.tsx
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

interface CompetitorData {
    competitor: string;
    category: string;
    marketShare: number;
    marketShareChange: number;
    estimatedRevenue: number;
    revenueChange: number;
    keyProducts: string[];
    threat: 'high' | 'medium' | 'low';
}

const competitorData: CompetitorData[] = [
    {
        competitor: 'Hemas Consumer Brands',
        category: 'Personal Care & Home Care',
        marketShare: 22.8,
        marketShareChange: 1.5,
        estimatedRevenue: 5800000000,
        revenueChange: 9.2,
        keyProducts: ['Clogard', 'Kumarika', 'Baby Cheramy', 'Sera'],
        threat: 'high'
    },
    {
        competitor: 'Reckitt Benckiser (Sri Lanka)',
        category: 'Health, Hygiene & Home',
        marketShare: 16.3,
        marketShareChange: 0.8,
        estimatedRevenue: 4200000000,
        revenueChange: 6.5,
        keyProducts: ['Dettol', 'Harpic', 'Lysol', 'Strepsils'],
        threat: 'high'
    },
    {
        competitor: 'Nestlé Lanka',
        category: 'Food & Beverages',
        marketShare: 18.5,
        marketShareChange: -0.3,
        estimatedRevenue: 4700000000,
        revenueChange: 4.1,
        keyProducts: ['Maggi', 'Nescafe', 'Milo', 'Milkmaid'],
        threat: 'medium'
    },
    {
        competitor: 'Procter & Gamble (P&G)',
        category: 'Personal Care & Hygiene',
        marketShare: 12.1,
        marketShareChange: -0.5,
        estimatedRevenue: 3100000000,
        revenueChange: 2.8,
        keyProducts: ['Pampers', 'Pantene', 'Gillette', 'Oral-B'],
        threat: 'medium'
    },
    {
        competitor: 'Fonterra Brands Sri Lanka',
        category: 'Dairy & Nutrition',
        marketShare: 14.2,
        marketShareChange: 1.1,
        estimatedRevenue: 3600000000,
        revenueChange: 7.8,
        keyProducts: ['Anchor', 'Anlene', 'Anchor Newdale'],
        threat: 'low'
    },
    {
        competitor: 'Lion Brewery / Carson Cumberbatch',
        category: 'Beverages & Distribution',
        marketShare: 8.3,
        marketShareChange: 0.4,
        estimatedRevenue: 2100000000,
        revenueChange: 5.3,
        keyProducts: ['Lion Lager', 'Carlsberg', 'Distribution Network'],
        threat: 'low'
    }
];

const formatLKR = (value: number) => {
    if (value >= 1_000_000_000) {
        return `LKR ${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
        return `LKR ${(value / 1_000_000).toFixed(1)}M`;
    }
    return `LKR ${value.toLocaleString()}`;
};

const getThreatColor = (threat: string) => {
    switch (threat) {
        case 'high':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'medium':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'low':
            return 'bg-green-100 text-green-700 border-green-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getThreatLabel = (threat: string) => {
    switch (threat) {
        case 'high':
            return 'High Threat';
        case 'medium':
            return 'Medium Threat';
        case 'low':
            return 'Low Threat';
        default:
            return 'Unknown';
    }
};

export function CompetitorInsights() {
    const totalMarketShare = competitorData.reduce((sum, comp) => sum + comp.marketShare, 0);
    const unileverMarketShare = 100 - totalMarketShare;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Competitor Insights</h3>
                    <p className="text-sm text-gray-600 mt-1">Sri Lankan FMCG Market Intelligence</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                    <div className="text-xs text-blue-600 font-semibold">Unilever SL Market Share</div>
                    <div className="text-2xl font-bold text-blue-700">{unileverMarketShare.toFixed(1)}%</div>
                </div>
            </div>

            {/* Market Overview Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="text-xs font-semibold text-purple-700 uppercase mb-1">Top Competitor</div>
                    <div className="text-lg font-bold text-purple-900">Hemas Consumer Brands</div>
                    <div className="text-sm text-purple-700">22.8% Market Share</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                    <div className="text-xs font-semibold text-orange-700 uppercase mb-1">Fastest Growing</div>
                    <div className="text-lg font-bold text-orange-900">Hemas Consumer</div>
                    <div className="text-sm text-orange-700">+9.2% Revenue Growth</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <div className="text-xs font-semibold text-red-700 uppercase mb-1">High Threat Level</div>
                    <div className="text-lg font-bold text-red-900">2 Competitors</div>
                    <div className="text-sm text-red-700">Require monitoring</div>
                </div>
            </div>

            {/* Competitor Table */}
            <div className="overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Competitor
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Market Share
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Est. Revenue
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Revenue Growth
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Key Products
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Threat Level
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {competitorData.map((comp, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">{comp.competitor}</div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="text-sm text-gray-700">{comp.category}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                    <div className="text-sm font-bold text-gray-900">{comp.marketShare.toFixed(1)}%</div>
                                    <div className="flex items-center justify-end mt-1">
                                        {comp.marketShareChange > 0 ? (
                                            <>
                                                <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                                                <span className="text-xs text-red-600 font-semibold">
                                                    +{comp.marketShareChange.toFixed(1)}%
                                                </span>
                                            </>
                                        ) : comp.marketShareChange < 0 ? (
                                            <>
                                                <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                                                <span className="text-xs text-green-600 font-semibold">
                                                    {comp.marketShareChange.toFixed(1)}%
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Minus className="w-3 h-3 text-gray-400 mr-1" />
                                                <span className="text-xs text-gray-500">0%</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {formatLKR(comp.estimatedRevenue)}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end">
                                        {comp.revenueChange > 0 ? (
                                            <>
                                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                                <span className="text-sm font-semibold text-green-600">
                                                    +{comp.revenueChange.toFixed(1)}%
                                                </span>
                                            </>
                                        ) : comp.revenueChange < 0 ? (
                                            <>
                                                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                                <span className="text-sm font-semibold text-red-600">
                                                    {comp.revenueChange.toFixed(1)}%
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Minus className="w-4 h-4 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-500">0%</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {comp.keyProducts.slice(0, 3).map((product, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200"
                                            >
                                                {product}
                                            </span>
                                        ))}
                                        {comp.keyProducts.length > 3 && (
                                            <span className="inline-block text-xs text-gray-500 px-1 py-1">
                                                +{comp.keyProducts.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getThreatColor(
                                            comp.threat
                                        )}`}
                                    >
                                        {comp.threat === 'high' && <AlertCircle className="w-3 h-3 mr-1" />}
                                        {getThreatLabel(comp.threat)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Market Intelligence Notes */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Key Market Insights</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• <strong>Hemas Consumer Brands</strong> gaining significant share (+1.5%) with strong local brands (Clogard, Kumarika, Baby Cheramy) - direct competition in personal care</li>
                            <li>• <strong>Reckitt Benckiser</strong> showing steady growth (+0.8% share) with Dettol and Harpic - competitive pressure in hygiene segment</li>
                            <li>• <strong>Nestlé Lanka</strong> slight decline (-0.3%) presents opportunity for Unilever to expand in overlapping food/beverage categories</li>
                            <li>• <strong>P&G</strong> losing ground (-0.5%) - opportunity to capture market share in personal care and hygiene products</li>
                            <li>• <strong>Fonterra Brands</strong> growing (+1.1%) in dairy segment with Anchor brand - consider strategic partnerships or category expansion</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

