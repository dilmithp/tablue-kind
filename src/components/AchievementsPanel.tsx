// src/components/AchievementsPanel.tsx
'use client';

import React from 'react';
import { Achievement } from '@/lib/types';

interface AchievementsPanelProps {
    achievements: Achievement[];
}

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top 5 Achievements
            </h3>

            <div className="space-y-3">
                {achievements.map((achievement, index) => (
                    <div key={achievement.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold mr-3">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{achievement.title}</h4>
                            <p className="text-xs text-gray-600">{achievement.description}</p>
                        </div>
                        <span className="text-lg font-bold text-green-600">{achievement.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
