import React from 'react';
import type { Building } from '../types';

const MetropolisView = ({ cityData }: { cityData: Building[] }) => {
    const BuildingComponent = ({ building }: { building: Building }) => {
        return (
            <div className={`w-full ${building.heightClass} ${building.colorClass} flex items-end`}>
                <div className="w-full h-full p-1 flex flex-wrap gap-1 items-center justify-center opacity-50">
                    {[...Array(building.windowCount)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-yellow-200/50 rounded-full"></div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#E0E3E8] mb-6">Tu Metrópolis</h2>
            <div className="bg-[#101116] rounded-2xl p-4 relative">
                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {[...Array(50)].map((_, index) => (
                        <div key={index} className="aspect-square bg-transparent rounded-md flex items-end justify-center border border-white/5">
                            {cityData[index] && <BuildingComponent building={cityData[index]} />}
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-yellow-900/20"></div>
            </div>
        </div>
    );
};

export default MetropolisView;
