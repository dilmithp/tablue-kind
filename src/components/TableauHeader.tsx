// src/components/TableauHeader.tsx
'use client';

import React from 'react';
import { Filter, Calendar } from 'lucide-react';

// Define the new props our header will accept
interface TableauHeaderProps {
    title: string;
    regionList: string[];
    channelList: string[];
    selectedRegion: string;
    selectedChannel: string;
    onRegionChange: (value: string) => void;
    onChannelChange: (value: string) => void;
}

export function TableauHeader({
                                  title,
                                  regionList,
                                  channelList,
                                  selectedRegion,
                                  selectedChannel,
                                  onRegionChange,
                                  onChannelChange,
                              }: TableauHeaderProps) {

    // Base style for the dropdowns
    const selectStyle = "bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-full mx-auto px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Left Side: Title */}
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                        {/*<p className="text-sm text-gray-500">*/}
                        {/*    Unilever Sri Lanka - Head of Trade Analytics*/}
                        {/*</p>*/}
                    </div>

                    {/* Right Side: Filters */}
                    <div className="flex items-center space-x-4">

                        {/* Region Filter Dropdown */}
                        <div>
                            <label htmlFor="region" className="block text-xs font-semibold text-gray-600 mb-1">
                                Region
                            </label>
                            <select
                                id="region"
                                name="region"
                                className={selectStyle}
                                value={selectedRegion}
                                onChange={(e) => onRegionChange(e.target.value)}
                            >
                                {regionList.map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Channel Filter Dropdown */}
                        <div>
                            <label htmlFor="channel" className="block text-xs font-semibold text-gray-600 mb-1">
                                Channel
                            </label>
                            <select
                                id="channel"
                                name="channel"
                                className={selectStyle}
                                value={selectedChannel}
                                onChange={(e) => onChannelChange(e.target.value)}
                            >
                                {channelList.map((channel) => (
                                    <option key={channel} value={channel}>
                                        {channel}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}