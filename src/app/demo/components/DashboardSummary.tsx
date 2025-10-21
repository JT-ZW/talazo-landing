"use client";

import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Droplets,
  ThermometerSun,
} from "lucide-react";

interface DashboardSummaryProps {
  onNext: () => void;
  currentStep?: number;
}

const METRICS = [
  {
    id: 1,
    title: "Average NDVI",
    value: "0.72",
    change: "+5.2%",
    trend: "up",
    icon: Activity,
    color: "green",
    description: "Healthy vegetation index",
  },
  {
    id: 2,
    title: "Field Area",
    value: "42.5 ha",
    change: "Surveyed",
    trend: "neutral",
    icon: MapPin,
    color: "blue",
    description: "Total coverage",
  },
  {
    id: 3,
    title: "Health Status",
    value: "87%",
    change: "+3.1%",
    trend: "up",
    icon: CheckCircle,
    color: "emerald",
    description: "Overall crop health",
  },
  {
    id: 4,
    title: "Stress Events",
    value: "3",
    change: "-2 from last",
    trend: "down",
    icon: AlertTriangle,
    color: "amber",
    description: "Active stress zones",
  },
];

const DETAILED_STATS = [
  {
    label: "Water Stress Index",
    value: 0.68,
    status: "moderate",
    icon: Droplets,
  },
  {
    label: "Heat Stress",
    value: 0.42,
    status: "low",
    icon: ThermometerSun,
  },
  {
    label: "Crop Vigor",
    value: 0.85,
    status: "high",
    icon: TrendingUp,
  },
];

export default function DashboardSummary({ onNext }: DashboardSummaryProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Field Analysis Dashboard
        </h2>
        <p className="text-lg text-slate-600">
          Comprehensive overview of your crop health metrics
        </p>
      </motion.div>

      {/* Main Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {METRICS.map((metric, index) => {
          const Icon = metric.icon;
          const colorClasses = {
            green: "bg-green-500 text-white",
            blue: "bg-blue-500 text-white",
            emerald: "bg-emerald-500 text-white",
            amber: "bg-amber-500 text-white",
          }[metric.color];

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {metric.trend !== "neutral" && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {metric.change}
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                {metric.title}
              </h3>
              <div className="text-3xl font-bold text-slate-800 mb-2">
                {metric.value}
              </div>
              <p className="text-sm text-slate-500">{metric.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-6">
          Detailed Health Indicators
        </h3>
        <div className="space-y-6">
          {DETAILED_STATS.map((stat, index) => {
            const Icon = stat.icon;
            const percentage = stat.value * 100;
            const statusColor =
              stat.status === "high"
                ? "green"
                : stat.status === "moderate"
                  ? "amber"
                  : "blue";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 text-${statusColor}-600`} />
                    <span className="font-medium text-slate-700">
                      {stat.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {percentage.toFixed(0)}%
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-700 capitalize`}
                    >
                      {stat.status}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <motion.div
                    className={`bg-gradient-to-r from-${statusColor}-400 to-${statusColor}-600 h-3 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Field Visualization Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Field Heat Map Preview
        </h3>
        <div className="relative w-full h-64 bg-gradient-to-br from-green-200 via-yellow-200 to-red-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(34,197,94,0.4),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(234,179,8,0.4),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.3),transparent_40%)]"></div>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-xs text-slate-700">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-xs text-slate-700">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-xs text-slate-700">Stressed</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-center"
      >
        <button
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Explore Analytical Layers
        </button>
      </motion.div>
    </div>
  );
}
