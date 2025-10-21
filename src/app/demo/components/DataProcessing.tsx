"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Brain, Leaf, Target, Zap } from "lucide-react";

interface DataProcessingProps {
  onNext: () => void;
  currentStep?: number;
}

const PROCESSING_STEPS = [
  {
    id: 1,
    icon: Activity,
    title: "Extracting NDVI",
    description: "Calculating vegetation indices from multispectral data",
    duration: 1500,
  },
  {
    id: 2,
    icon: Target,
    title: "Computing Stress Indices",
    description: "Analyzing water, heat, and salinity stress markers",
    duration: 2000,
  },
  {
    id: 3,
    icon: Brain,
    title: "AI Model Inference",
    description: "Running deep learning models for anomaly detection",
    duration: 2500,
  },
  {
    id: 4,
    icon: Leaf,
    title: "Crop Health Assessment",
    description: "Evaluating plant vigor and growth patterns",
    duration: 1800,
  },
  {
    id: 5,
    icon: Zap,
    title: "Generating Insights",
    description: "Compiling actionable recommendations",
    duration: 1200,
  },
];

export default function DataProcessing({ onNext }: DataProcessingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStepIndex < PROCESSING_STEPS.length) {
      const step = PROCESSING_STEPS[currentStepIndex];
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (currentStepIndex < PROCESSING_STEPS.length - 1) {
                setCurrentStepIndex(currentStepIndex + 1);
                setProgress(0);
              } else {
                setTimeout(onNext, 1000);
              }
            }, 500);
            return 100;
          }
          return prev + (100 / step.duration) * 50;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [currentStepIndex, onNext]);

  const overallProgress =
    ((currentStepIndex + progress / 100) / PROCESSING_STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Processing Aerial Imagery
        </h2>
        <p className="text-lg text-slate-600">
          Our AI models are analyzing your field data in real-time
        </p>
      </motion.div>

      {/* Main Processing Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-8"
      >
        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-green-600">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {PROCESSING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isComplete = index < currentStepIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isActive
                    ? "bg-green-50 border-2 border-green-500"
                    : isComplete
                      ? "bg-green-50/50"
                      : "bg-slate-50"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-green-600 text-white"
                      : isComplete
                        ? "bg-green-500 text-white"
                        : "bg-slate-300 text-slate-600"
                  }`}
                >
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      ✓
                    </motion.div>
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-600">{step.description}</p>
                  {isActive && (
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
                      <motion.div
                        className="bg-green-600 h-1.5 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-green-600 rounded-full"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Technical Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">2.3 GB</div>
          <div className="text-sm text-slate-600">Data Processed</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">15,840</div>
          <div className="text-sm text-slate-600">Pixels Analyzed</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">8</div>
          <div className="text-sm text-slate-600">AI Models Used</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(overallProgress)}%
          </div>
          <div className="text-sm text-slate-600">Complete</div>
        </div>
      </motion.div>
    </div>
  );
}
