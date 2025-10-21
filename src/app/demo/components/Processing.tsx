"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessingProps {
  onNext: () => void;
  currentStep: number;
}

const PROCESSING_STEPS = [
  {
    id: 1,
    name: "Image Preprocessing",
    description: "Enhancing image quality and alignment",
  },
  {
    id: 2,
    name: "Feature Extraction",
    description: "Identifying vegetation patterns",
  },
  {
    id: 3,
    name: "NDVI Calculation",
    description: "Computing vegetation health index",
  },
  {
    id: 4,
    name: "AI Analysis",
    description: "Applying machine learning models",
  },
  {
    id: 5,
    name: "Report Generation",
    description: "Compiling insights and recommendations",
  },
];

export default function Processing({ onNext }: ProcessingProps) {
  const [progress, setProgress] = useState(0);
  const [currentProcessStep, setCurrentProcessStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;

        // Update current processing step based on progress
        const stepIndex = Math.floor(
          (newProgress / 100) * PROCESSING_STEPS.length
        );
        setCurrentProcessStep(Math.min(stepIndex, PROCESSING_STEPS.length - 1));

        if (newProgress >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          setTimeout(() => {
            onNext();
          }, 2000);
          return 100;
        }

        return newProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onNext]);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          AI Processing Pipeline
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Our advanced AI models are analyzing your drone imagery to extract
          valuable insights about crop health and field conditions.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Processing Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Processing Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Processing Status</h3>
                <div className="text-3xl font-mono">
                  {Math.round(progress)}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700 rounded-full h-3 mb-6">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>

              {/* Current Step */}
              <AnimatePresence mode="wait">
                {!isComplete ? (
                  <motion.div
                    key={currentProcessStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-4"
                  >
                    <motion.div
                      className="w-3 h-3 bg-green-400 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    />
                    <div>
                      <div className="font-semibold">
                        {PROCESSING_STEPS[currentProcessStep]?.name}
                      </div>
                      <div className="text-slate-300 text-sm">
                        {PROCESSING_STEPS[currentProcessStep]?.description}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-4 text-green-400"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        Processing Complete!
                      </div>
                      <div className="text-slate-300 text-sm">
                        Ready to view NDVI analysis
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Processing Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-2">24</div>
              <div className="text-sm text-slate-600">Images Processed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-2xl font-bold text-green-600 mb-2">15.2</div>
              <div className="text-sm text-slate-600">Hectares Analyzed</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Processing Steps */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-semibold text-slate-800 mb-8">
            Processing Pipeline
          </h3>

          <div className="space-y-4">
            {PROCESSING_STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className={`relative bg-white rounded-xl p-6 shadow-sm border-l-4 transition-all duration-500 ${
                  index <= currentProcessStep
                    ? "border-green-500 bg-green-50/50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                      index < currentProcessStep
                        ? "bg-green-500 text-white"
                        : index === currentProcessStep
                          ? "bg-green-500 text-white"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {index < currentProcessStep ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-1">
                      {step.name}
                    </h4>
                    <p className="text-sm text-slate-600">{step.description}</p>

                    {/* Processing indicator */}
                    {index === currentProcessStep && !isComplete && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 flex items-center space-x-2 text-green-600"
                      >
                        <motion.div
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                          }}
                        />
                        <span className="text-sm font-medium">
                          Processing...
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Models Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mt-8"
          >
            <h4 className="font-semibold text-slate-800 mb-4">
              AI Models Used:
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-slate-700">Computer Vision CNN</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-slate-700">NDVI Calculator</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-slate-700">Crop Health Classifier</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-slate-700">Yield Predictor</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
