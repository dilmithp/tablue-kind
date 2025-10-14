// src/components/AlertsPanel.tsx
'use client';

import React from 'react';
import { Alert } from '@/lib/types';

interface AlertsPanelProps {
    alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Alerts
            </h3>

            <div className="space-y-3">
                {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.timestamp}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
