"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface InsightsProps {
  onNext: () => void;
  currentStep: number;
}

const INSIGHTS = [
  {
    id: 1,
    category: "Field Overview",
    icon: "🌾",
    title: "Field Performance Summary",
    metrics: [
      { label: "Total Area Analyzed", value: "15.2 ha", color: "blue" },
      { label: "Health Score", value: "8.2/10", color: "green" },
      { label: "Growth Stage", value: "Flowering", color: "purple" },
    ],
    insights: [
      "Field is performing above regional average",
      "Crop development is on schedule",
      "Overall vegetation health is excellent",
    ],
  },
  {
    id: 2,
    category: "Health Analysis",
    icon: "🌱",
    title: "Vegetation Health Assessment",
    metrics: [
      { label: "Healthy Vegetation", value: "82%", color: "green" },
      { label: "Stressed Areas", value: "18%", color: "orange" },
      { label: "Critical Zones", value: "3%", color: "red" },
    ],
    insights: [
      "Northeast section shows exceptional vigor",
      "Southwest corner requires immediate attention",
      "Water stress detected in 2 specific zones",
    ],
  },
  {
    id: 3,
    category: "AI Recommendations",
    icon: "🎯",
    title: "Actionable Recommendations",
    metrics: [
      { label: "Priority Actions", value: "4", color: "red" },
      { label: "Medium Actions", value: "2", color: "yellow" },
      { label: "Monitoring", value: "3", color: "blue" },
    ],
    insights: [
      "Apply nitrogen fertilizer to stressed zones",
      "Inspect irrigation systems in SW corner",
      "Monitor pest activity in boundary areas",
    ],
  },
  {
    id: 4,
    category: "Yield Prediction",
    icon: "📊",
    title: "Harvest Forecast",
    metrics: [
      { label: "Expected Yield", value: "3.2 t/ha", color: "green" },
      { label: "Confidence Level", value: "89%", color: "blue" },
      { label: "Est. Harvest Date", value: "Mar 15", color: "purple" },
    ],
    insights: [
      "Yield prediction based on current health trends",
      "Weather conditions favorable for growth",
      "Potential 15% increase with recommended actions",
    ],
  },
];

const RECOMMENDATIONS = [
  {
    id: 1,
    priority: "High",
    action: "Apply Nitrogen Fertilizer",
    location: "Southwest corner (2.3 ha)",
    timeline: "Within 7 days",
    impact: "Improve yield by 12-15%",
    cost: "$45 - $60",
    color: "red",
  },
  {
    id: 2,
    priority: "High",
    action: "Irrigation System Check",
    location: "Zone 3 & 4",
    timeline: "This week",
    impact: "Prevent further stress",
    cost: "$20 - $30",
    color: "red",
  },
  {
    id: 3,
    priority: "Medium",
    action: "Pest Monitoring",
    location: "Field perimeter",
    timeline: "Next 2 weeks",
    impact: "Early detection",
    cost: "$15 - $25",
    color: "yellow",
  },
  {
    id: 4,
    priority: "Low",
    action: "Soil pH Testing",
    location: "Northeast section",
    timeline: "Next month",
    impact: "Optimize nutrition",
    cost: "$10 - $15",
    color: "blue",
  },
];

export default function Insights({ onNext }: InsightsProps) {
  const [activeInsight, setActiveInsight] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % INSIGHTS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-600 bg-blue-50 border-blue-200",
      green: "text-green-600 bg-green-50 border-green-200",
      orange: "text-orange-600 bg-orange-50 border-orange-200",
      red: "text-red-600 bg-red-50 border-red-200",
      purple: "text-purple-600 bg-purple-50 border-purple-200",
      yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      High: "bg-red-100 text-red-800 border-red-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Low: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[priority as keyof typeof colors] || colors.Low;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          AI-Powered Insights & Recommendations
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Our advanced AI analyzes your field data to provide actionable
          insights that help optimize crop performance and maximize yields.
        </p>
      </motion.div>

      {/* Insights Cards */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {INSIGHTS.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
              activeInsight === index
                ? "ring-2 ring-green-500 scale-105"
                : "hover:shadow-xl"
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{insight.icon}</div>
                  <div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide">
                      {insight.category}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {insight.title}
                    </h3>
                  </div>
                </div>
                {activeInsight === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {insight.metrics.map((metric, metricIndex) => (
                  <motion.div
                    key={metricIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.2 + metricIndex * 0.1,
                      duration: 0.4,
                    }}
                    className={`text-center p-3 rounded-lg border ${getColorClasses(metric.color)}`}
                  >
                    <div className="text-lg font-bold">{metric.value}</div>
                    <div className="text-xs">{metric.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Insights */}
              <div className="space-y-2">
                {insight.insights.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.2 + itemIndex * 0.1,
                      duration: 0.4,
                    }}
                    className="flex items-start space-x-2 text-sm text-slate-700"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="bg-gradient-to-br from-slate-50 to-green-50/50 rounded-2xl p-8 mb-12"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Priority Action Items
            </h3>
            <p className="text-slate-600">
              Recommended actions based on AI analysis, prioritized by impact
              and urgency.
            </p>
          </div>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg border border-slate-300 transition-colors"
          >
            {showRecommendations ? "Hide Details" : "Show Details"}
          </button>
        </div>

        <div className="grid gap-4">
          {RECOMMENDATIONS.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(rec.priority)}`}
                    >
                      {rec.priority} Priority
                    </span>
                    <h4 className="font-semibold text-slate-800">
                      {rec.action}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Location:</span>
                      <div className="font-medium text-slate-800">
                        {rec.location}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Timeline:</span>
                      <div className="font-medium text-slate-800">
                        {rec.timeline}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Expected Impact:</span>
                      <div className="font-medium text-green-600">
                        {rec.impact}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Est. Cost:</span>
                      <div className="font-medium text-slate-800">
                        {rec.cost}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <button className="text-green-600 hover:text-green-700 transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Economic Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-12"
      >
        <h3 className="text-2xl font-bold text-slate-800 mb-6">
          Economic Impact Analysis
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              +$2,340
            </div>
            <div className="text-sm text-slate-600">
              Potential Revenue Increase
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">$180</div>
            <div className="text-sm text-slate-600">
              Total Implementation Cost
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              1,300%
            </div>
            <div className="text-sm text-slate-600">Return on Investment</div>
          </div>
        </div>
      </motion.div>

      {/* Generate Report Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="text-center"
      >
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Generate Detailed Report
        </button>
      </motion.div>
    </div>
  );
}
