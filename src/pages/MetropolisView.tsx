import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react'; // Import the Plus icon
import { useStore } from '../store/store';
import { Building as BuildingType } from '../types';

// --- CONFIGURATION ---
const skylineConfig = {
  layers: {
    back: { fill: '#2c2a4a' },
    mid: { fill: '#4f4a7e' },
    front: { fill: '#7a6f9b' },
  },
  viewBox: { width: 800, height: 400 },
  groundLevel: 380,
};

// --- BUILDING COMPONENT ---
interface SkylineBuildingProps {
  building: BuildingType;
}

const SkylineBuilding: React.FC<SkylineBuildingProps> = ({ building }) => {
  const { x, width, height, layer, name } = building;
  const { groundLevel } = skylineConfig;
  const layerStyle = skylineConfig.layers[layer];

  const [showName, setShowName] = useState(false);

  const toggleNameVisibility = () => {
    setShowName(!showName);
  };

  return (
    <g
      onMouseEnter={() => setShowName(true)}
      onMouseLeave={() => setShowName(false)}
      onClick={toggleNameVisibility} // Added for mobile/touch
    >
      <motion.rect
        x={x}
        width={width}
        fill={layerStyle.fill}
        initial={{ y: groundLevel, height: 0 }}
        animate={{ y: groundLevel - height, height: height }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      rx="2"
      />
      {showName && name && ( // Add name check here
        <> {/* Use a fragment to group rect and text */}
          <rect
            x={x + width / 2 - (name.length * 3)} // Adjust x based on text length for centering
            y={groundLevel - height - 25} // Position above the building, slightly higher for padding
            width={name.length * 6} // Adjust width based on text length
            height="20" // Height of the background rect
            fill="rgba(0, 0, 0, 0.7)" // Semi-transparent black background
            rx="3" // Rounded corners
            ry="3"
            pointerEvents="none"
          />
          <text
            x={x + width / 2} // Center the text horizontally
            y={groundLevel - height - 10} // Position above the building
            textAnchor="middle" // Center the text
            fill="white"
            fontSize="12" // Slightly larger font size
            fontWeight="bold"
            pointerEvents="none"
          >
            {name}
          </text>
        </>
      )}
    </g>
  );
};


interface MetropolisViewProps {
  cityData: BuildingType[];
}

// --- METROPOLIS VIEW COMPONENT (REIMAGINED) ---
const MetropolisView: React.FC<MetropolisViewProps> = ({ cityData }) => {
    const buildings = cityData;
    

    const renderLayer = (layerName: BuildingType['layer']) => {
        return buildings
            .filter(b => b && b.layer === layerName)
            .map(building => <SkylineBuilding key={building.id} building={building} />);
    };

    return (
        <motion.div 
            className="relative w-full h-full flex flex-col justify-between overflow-hidden" // Full-bleed container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* SVG Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <svg 
                    viewBox={`0 0 ${skylineConfig.viewBox.width} ${skylineConfig.viewBox.height}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    preserveAspectRatio="xMidYMid slice" // Changed to slice for full bleed
                    className="w-full h-full"
                >
                    <defs>
                        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="60%" stopColor="#3a3d8a" />
                            <stop offset="100%" stopColor="#7a5c9a" />
                        </linearGradient>
                        <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#7a6f9b" stopOpacity="0" />
                            <stop offset="100%" stopColor="#1e293b" stopOpacity="1" />
                        </linearGradient>
                        <filter id="subtleShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.2" />
                        </filter>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#skyGradient)" />
                    <g id="clouds" fillOpacity="0.6">
                         <motion.path initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 2, delay: 1 }} d="M 100 120 C 80 120, 80 90, 110 90 C 110 70, 140 70, 150 90 C 180 90, 180 120, 160 120 Z" fill="#f0e4d7" />
                         <motion.path initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 2, delay: 1.5 }} d="M 250 80 C 230 80, 230 50, 260 50 C 260 30, 290 30, 300 50 C 330 50, 330 80, 310 80 Z" fill="#f5f0ed" />
                         <motion.path initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 2, delay: 2 }} d="M 550 110 C 530 110, 530 80, 560 80 C 560 60, 590 60, 600 80 C 630 80, 630 110, 610 110 Z" fill="#f0e4d7" />
                    </g>
                    <g id="back-buildings" filter="url(#subtleShadow)">{renderLayer('back')}</g>
                    <g id="mid-buildings" filter="url(#subtleShadow)">{renderLayer('mid')}</g>
                    <g id="front-buildings" filter="url(#subtleShadow)">{renderLayer('front')}</g>
                    <rect y={skylineConfig.groundLevel - 20} width="100%" height="40" fill="url(#groundGradient)" />
                </svg>
            </div>

            {/* Floating UI Elements */}
            <div className="relative z-10 p-4 md:p-8">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Tu Horizonte</h1>
                    <p className="text-gray-200 mt-1" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>Observa cómo tu ciudad crece con cada sesión de foco.</p>
                </motion.div>
            </div>

            
        </motion.div>
    );
};

export default MetropolisView;
