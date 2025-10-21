"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Sprout,
  DollarSign,
  Calendar,
  Target,
} from "lucide-react";

interface AIInsightsPanelProps {
  onNext: () => void;
  currentStep?: number;
}

const INSIGHTS = [
  {
    id: 1,
    category: "Immediate Actions",
    icon: AlertTriangle,
    color: "red",
    priority: "high",
    items: [
      {
        title: "Address Water Stress in Eastern Section",
        description:
          "3.2 hectares showing elevated water stress indices. Increase irrigation frequency by 30% in this zone.",
        impact: "Prevent 8-12% yield loss",
        timeline: "Within 24 hours",
      },
      {
        title: "Apply Fungicide to Detected Disease Zones",
        description:
          "Early-stage fungal infection detected in 3 zones (2.4 ha). Apply recommended fungicide to prevent spread.",
        impact: "Protect 95% of affected area",
        timeline: "Within 48 hours",
      },
    ],
  },
  {
    id: 2,
    category: "Nutrient Optimization",
    icon: Droplets,
    color: "blue",
    priority: "medium",
    items: [
      {
        title: "Phosphorus Supplementation Required",
        description:
          "Southern 8.5 ha showing P deficiency. Apply 25 kg/ha P₂O₅ for optimal growth.",
        impact: "12-15% yield increase expected",
        timeline: "Within 1 week",
      },
      {
        title: "Nitrogen Management Strategy",
        description:
          "Current N levels adequate but monitor closely. Consider split application for late-season boost.",
        impact: "Maintain optimal growth rate",
        timeline: "Plan for mid-season",
      },
    ],
  },
  {
    id: 3,
    category: "Yield Optimization",
    icon: TrendingUp,
    color: "green",
    priority: "medium",
    items: [
      {
        title: "Above-Average Yield Trajectory",
        description:
          "Current growth rate 8% above regional average. Predicted yield: 8.4 t/ha (15% above baseline).",
        impact: "Additional $2,400/ha revenue",
        timeline: "Harvest in 68-72 days",
      },
      {
        title: "Canopy Management Optimal",
        description:
          "74% canopy cover indicates excellent plant density and growth uniformity.",
        impact: "Maximized photosynthetic efficiency",
        timeline: "Ongoing monitoring",
      },
    ],
  },
  {
    id: 4,
    category: "Weed Management",
    icon: Sprout,
    color: "amber",
    priority: "medium",
    items: [
      {
        title: "Targeted Herbicide Application",
        description:
          "4.2 ha of high-density weed zones identified. Spot treatment more cost-effective than blanket spray.",
        impact: "Save $180/ha on herbicide costs",
        timeline: "Within 5 days",
      },
    ],
  },
  {
    id: 5,
    category: "Long-Term Recommendations",
    icon: Lightbulb,
    color: "purple",
    priority: "low",
    items: [
      {
        title: "Soil Health Improvement Plan",
        description:
          "Consider cover cropping in affected areas post-harvest to improve soil structure and nutrient retention.",
        impact: "20% reduction in input costs next season",
        timeline: "Post-harvest planning",
      },
      {
        title: "Precision Irrigation System",
        description:
          "Variable rate irrigation could optimize water use by 25% based on detected stress patterns.",
        impact: "Reduce water costs by $340/season",
        timeline: "Long-term investment",
      },
    ],
  },
];

export default function AIInsightsPanel({ onNext }: AIInsightsPanelProps) {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const summaryText =
    "Based on comprehensive analysis of your 42.5-hectare field, our AI models have identified critical action items and optimization opportunities. Your crop is performing above regional averages with an 87% overall health score. However, immediate attention to water-stressed zones and early disease detection will be crucial for maximizing yield potential.";

  useEffect(() => {
    if (typedText.length < summaryText.length) {
      const timeout = setTimeout(() => {
        setTypedText(summaryText.slice(0, typedText.length + 1));
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [typedText, summaryText]);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">
            AI-Powered Analysis
          </span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Agronomic Intelligence Summary
        </h2>
        <p className="text-lg text-slate-600">
          Actionable insights generated from multi-layer crop analysis
        </p>
      </motion.div>

      {/* AI Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl p-8 mb-8 border border-slate-200"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Executive Summary
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {typedText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-slate-700 ml-1"
                />
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">8.4 t/ha</div>
          <div className="text-sm text-slate-600">Predicted Yield</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">+15%</div>
          <div className="text-sm text-slate-600">Above Baseline</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">70 days</div>
          <div className="text-sm text-slate-600">To Harvest</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">5</div>
          <div className="text-sm text-slate-600">Action Items</div>
        </div>
      </motion.div>

      {/* Detailed Insights by Category */}
      <div className="space-y-6 mb-8">
        {INSIGHTS.map((category, catIndex) => {
          const Icon = category.icon;
          const colorClasses = {
            red: "bg-red-50 border-red-200 text-red-700",
            blue: "bg-blue-50 border-blue-200 text-blue-700",
            green: "bg-green-50 border-green-200 text-green-700",
            amber: "bg-amber-50 border-amber-200 text-amber-700",
            purple: "bg-purple-50 border-purple-200 text-purple-700",
          }[category.color];

          const priorityBadge = {
            high: "bg-red-100 text-red-700",
            medium: "bg-amber-100 text-amber-700",
            low: "bg-slate-100 text-slate-700",
          }[category.priority];

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + catIndex * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div
                className={`${colorClasses} border-l-4 p-4 flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">{category.category}</h3>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${priorityBadge}`}
                >
                  {category.priority.toUpperCase()} PRIORITY
                </span>
              </div>

              <div className="p-6 space-y-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.6 + catIndex * 0.1 + itemIndex * 0.05,
                    }}
                    className="border-l-2 border-slate-200 pl-4 hover:border-green-500 transition-colors"
                  >
                    <h4 className="font-semibold text-slate-800 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-medium">
                          {item.impact}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-slate-600">{item.timeline}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Generate Comprehensive Report
        </button>
      </motion.div>
    </div>
  );
}
