"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Bug,
  Droplets,
  Sprout,
  Flower2,
  Activity,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface AnalyticalLayersProps {
  onNext: () => void;
  currentStep?: number;
}

const ANALYTICAL_LAYERS = [
  {
    id: "health",
    title: "Crop Health Assessment",
    icon: Leaf,
    color: "green",
    metrics: [
      { label: "Water Stress", value: 32, unit: "%", status: "low" },
      { label: "Heat Stress", value: 18, unit: "%", status: "low" },
      { label: "Salinity Stress", value: 12, unit: "%", status: "minimal" },
      { label: "Overall Vigor", value: 87, unit: "%", status: "excellent" },
    ],
    insights: [
      "Northwest quadrant showing optimal health",
      "Minor water stress detected in eastern section (3.2 ha)",
      "Recommend irrigation adjustment in stressed zones",
    ],
  },
  {
    id: "disease",
    title: "Disease Detection",
    icon: Bug,
    color: "red",
    metrics: [
      {
        label: "Pre-symptomatic Detection",
        value: 3,
        unit: "zones",
        status: "detected",
      },
      { label: "Disease Confidence", value: 89, unit: "%", status: "high" },
      { label: "Affected Area", value: 2.4, unit: "ha", status: "contained" },
      { label: "Spread Risk", value: 25, unit: "%", status: "moderate" },
    ],
    insights: [
      "Early fungal infection detected in 3 zones",
      "Recommend fungicide application within 48 hours",
      "Monitor adjacent areas for spread patterns",
    ],
  },
  {
    id: "nutrient",
    title: "Nutrient Management",
    icon: Droplets,
    color: "blue",
    metrics: [
      { label: "Nitrogen (N)", value: 68, unit: "%", status: "adequate" },
      { label: "Phosphorus (P)", value: 52, unit: "%", status: "moderate" },
      { label: "Potassium (K)", value: 71, unit: "%", status: "good" },
      { label: "Micronutrients", value: 78, unit: "%", status: "optimal" },
    ],
    insights: [
      "Phosphorus deficiency in southern 8.5 ha",
      "Recommended: 25 kg/ha P₂O₅ application",
      "Expected yield increase: 12-15% with treatment",
    ],
  },
  {
    id: "phenotyping",
    title: "Plant Phenotyping",
    icon: Sprout,
    color: "emerald",
    metrics: [
      { label: "Growth Stage", value: "V6", unit: "stage", status: "on-track" },
      { label: "Canopy Cover", value: 74, unit: "%", status: "excellent" },
      { label: "Plant Height", value: 1.2, unit: "m", status: "optimal" },
      {
        label: "Yield Prediction",
        value: 8.4,
        unit: "t/ha",
        status: "above-avg",
      },
    ],
    insights: [
      "Growth rate 8% above regional average",
      "Predicted harvest in 68-72 days",
      "Optimal conditions for maximum yield potential",
    ],
  },
  {
    id: "weed",
    title: "Weed Detection",
    icon: Flower2,
    color: "amber",
    metrics: [
      { label: "Weed Coverage", value: 8, unit: "%", status: "manageable" },
      {
        label: "High Density Zones",
        value: 4,
        unit: "areas",
        status: "identified",
      },
      {
        label: "Dominant Species",
        value: 2,
        unit: "types",
        status: "detected",
      },
      { label: "Treatment Priority", value: 4.2, unit: "ha", status: "urgent" },
    ],
    insights: [
      "Broadleaf weeds concentrated in northeast (4.2 ha)",
      "Recommend selective herbicide application",
      "Spot treatment more cost-effective than blanket spray",
    ],
  },
];

export default function AnalyticalLayers({ onNext }: AnalyticalLayersProps) {
  const [activeLayer, setActiveLayer] = useState(ANALYTICAL_LAYERS[0].id);

  const currentLayer = ANALYTICAL_LAYERS.find((l) => l.id === activeLayer);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Analytical Intelligence Layers
        </h2>
        <p className="text-lg text-slate-600">
          Deep-dive into specific aspects of your crop performance
        </p>
      </motion.div>

      {/* Layer Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-2 mb-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {ANALYTICAL_LAYERS.map((layer, index) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;

            return (
              <motion.button
                key={layer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => setActiveLayer(layer.id)}
                className={`relative p-4 rounded-lg transition-all ${
                  isActive
                    ? `bg-${layer.color}-50 border-2 border-${layer.color}-500`
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-6 h-6 mx-auto mb-2 ${
                    isActive ? `text-${layer.color}-600` : "text-slate-600"
                  }`}
                />
                <div
                  className={`text-xs font-medium ${
                    isActive ? `text-${layer.color}-700` : "text-slate-700"
                  }`}
                >
                  {layer.title.split(" ")[0]}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-${layer.color}-100 rounded-lg -z-10`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Layer Content */}
      <AnimatePresence mode="wait">
        {currentLayer && (
          <motion.div
            key={activeLayer}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {currentLayer.metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Activity
                      className={`w-5 h-5 text-${currentLayer.color}-600`}
                    />
                    <span
                      className={`text-xs px-2 py-1 rounded-full bg-${currentLayer.color}-100 text-${currentLayer.color}-700 font-medium`}
                    >
                      {metric.status}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">
                    {metric.value}
                    <span className="text-lg text-slate-600 ml-1">
                      {metric.unit}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Visualization Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-8"
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {currentLayer.title} Map
              </h3>
              <div className="relative w-full h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
                {/* Simulated heat map based on layer */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    currentLayer.id === "health"
                      ? "from-green-300/40 via-yellow-300/40 to-green-300/40"
                      : currentLayer.id === "disease"
                        ? "from-green-300/40 via-orange-300/40 to-red-300/40"
                        : currentLayer.id === "nutrient"
                          ? "from-blue-300/40 via-cyan-300/40 to-blue-300/40"
                          : currentLayer.id === "phenotyping"
                            ? "from-emerald-300/40 via-lime-300/40 to-emerald-300/40"
                            : "from-green-300/40 via-amber-300/40 to-green-300/40"
                  }`}
                ></div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-md">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Legend
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 bg-${currentLayer.color}-600 rounded`}
                      ></div>
                      <span className="text-xs text-slate-700">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 bg-${currentLayer.color}-400 rounded`}
                      ></div>
                      <span className="text-xs text-slate-700">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 bg-${currentLayer.color}-200 rounded`}
                      ></div>
                      <span className="text-xs text-slate-700">Low</span>
                    </div>
                  </div>
                </div>

                {/* Data Points */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`absolute w-8 h-8 bg-${currentLayer.color}-500 rounded-full border-2 border-white shadow-lg`}
                    style={{
                      left: `${15 + i * 11}%`,
                      top: `${25 + Math.sin(i) * 40}%`,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`bg-${currentLayer.color}-50 border border-${currentLayer.color}-200 rounded-xl p-6 mb-8`}
            >
              <div className="flex items-start gap-3 mb-4">
                <TrendingUp
                  className={`w-6 h-6 text-${currentLayer.color}-600 mt-1`}
                />
                <div>
                  <h4
                    className={`font-semibold text-${currentLayer.color}-900 mb-2`}
                  >
                    AI-Generated Insights
                  </h4>
                  <ul className="space-y-2">
                    {currentLayer.insights.map((insight, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-2 text-slate-700"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 text-${currentLayer.color}-600 mt-0.5 flex-shrink-0`}
                        />
                        <span className="text-sm">{insight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <button
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          View Comprehensive AI Insights
        </button>
      </motion.div>
    </div>
  );
}
