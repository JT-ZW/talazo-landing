"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NDVIMapProps {
  onNext: () => void;
  currentStep: number;
}

const NDVI_ZONES = [
  {
    id: 1,
    name: "High Vigor",
    color: "#22c55e",
    percentage: 45,
    description: "Excellent vegetation health",
  },
  {
    id: 2,
    name: "Moderate Vigor",
    color: "#84cc16",
    percentage: 37,
    description: "Good vegetation health",
  },
  {
    id: 3,
    name: "Low Vigor",
    color: "#eab308",
    percentage: 13,
    description: "Stressed vegetation",
  },
  {
    id: 4,
    name: "Very Low Vigor",
    color: "#ef4444",
    percentage: 5,
    description: "Severely stressed vegetation",
  },
];

const FIELD_DATA = {
  totalArea: 15.2,
  averageNDVI: 0.72,
  healthyVegetation: 82,
  stressedAreas: 18,
  coordinates: [-17.8252, 31.0335], // Harare, Zimbabwe
};

export default function NDVIMap({ onNext }: NDVIMapProps) {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

  useEffect(() => {
    // Simulate analysis completion
    const timer = setTimeout(() => {
      setIsAnalysisComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          NDVI Vegetation Analysis
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          The Normalized Difference Vegetation Index (NDVI) map reveals the
          health and vigor of your crops, helping identify areas that need
          attention.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Map Visualization */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Map Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Field Map - NDVI Analysis
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Coordinates: {FIELD_DATA.coordinates[0]},{" "}
                    {FIELD_DATA.coordinates[1]}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {FIELD_DATA.totalArea}
                  </div>
                  <div className="text-sm text-slate-300">Hectares</div>
                </div>
              </div>
            </div>

            {/* NDVI Map Simulation */}
            <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100">
              {/* Field Boundary */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 300"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
              >
                {/* Field outline */}
                <polygon
                  points="50,50 350,80 320,250 80,220"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />

                {/* NDVI Zones */}
                {/* High Vigor Zone */}
                <motion.polygon
                  points="50,50 200,60 180,150 70,140"
                  fill={NDVI_ZONES[0].color}
                  opacity={0.8}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  onClick={() => setSelectedZone(1)}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                />

                {/* Moderate Vigor Zone */}
                <motion.polygon
                  points="200,60 350,80 300,180 180,150"
                  fill={NDVI_ZONES[1].color}
                  opacity={0.8}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  onClick={() => setSelectedZone(2)}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                />

                {/* Low Vigor Zone */}
                <motion.polygon
                  points="70,140 180,150 160,210 90,200"
                  fill={NDVI_ZONES[2].color}
                  opacity={0.8}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  onClick={() => setSelectedZone(3)}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                />

                {/* Very Low Vigor Zone */}
                <motion.polygon
                  points="300,180 320,250 200,240 180,200"
                  fill={NDVI_ZONES[3].color}
                  opacity={0.8}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  onClick={() => setSelectedZone(4)}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                />

                {/* Analysis Points */}
                {[...Array(12)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={80 + (i % 4) * 60}
                    cy={80 + Math.floor(i / 4) * 50}
                    r="3"
                    fill="#1f2937"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2 + i * 0.1, duration: 0.3 }}
                  />
                ))}
              </svg>

              {/* Loading Overlay */}
              <AnimatePresence>
                {!isAnalysisComplete && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/90 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </motion.div>
                      <p className="text-lg font-semibold text-slate-800">
                        Generating NDVI Map...
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Analyzing vegetation health
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Map Controls */}
            <div className="p-6 bg-slate-50 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-slate-700">
                    NDVI Scale:
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-600">0.0</span>
                    <div className="w-20 h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
                    <span className="text-xs text-slate-600">1.0</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {FIELD_DATA.averageNDVI}
                  </div>
                  <div className="text-xs text-slate-600">Avg NDVI</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Legend and Stats */}
        <div className="space-y-6">
          {/* NDVI Legend */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Vegetation Health Zones
            </h3>
            <div className="space-y-3">
              {NDVI_ZONES.map((zone) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + zone.id * 0.1, duration: 0.5 }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedZone === zone.id
                      ? "border-slate-400 bg-slate-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() =>
                    setSelectedZone(selectedZone === zone.id ? null : zone.id)
                  }
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: zone.color }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-800 text-sm">
                        {zone.name}
                      </div>
                      <div className="text-xs text-slate-600">
                        {zone.description}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-700">
                      {zone.percentage}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Field Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Field Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Area</span>
                <span className="font-bold text-slate-800">
                  {FIELD_DATA.totalArea} ha
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Healthy Vegetation</span>
                <span className="font-bold text-green-600">
                  {FIELD_DATA.healthyVegetation}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Stress Areas</span>
                <span className="font-bold text-orange-600">
                  {FIELD_DATA.stressedAreas}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Average NDVI</span>
                <span className="font-bold text-blue-600">
                  {FIELD_DATA.averageNDVI}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Key Findings */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Key Findings
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <p className="text-sm text-slate-700">
                  Northeast section shows excellent vegetation health
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <p className="text-sm text-slate-700">
                  Southwest corner requires immediate attention
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <p className="text-sm text-slate-700">
                  Overall field health is above average
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-center"
      >
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          View AI Insights & Recommendations
        </button>
      </motion.div>
    </div>
  );
}
