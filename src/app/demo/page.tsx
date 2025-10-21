"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DemoHero,
  UploadSimulation,
  DataProcessing,
  DashboardSummary,
  AnalyticalLayers,
  AIInsightsPanel,
  ReportGeneration,
} from "./components";

const DEMO_STEPS = [
  { id: 1, title: "Upload Image", component: UploadSimulation },
  { id: 2, title: "Data Processing", component: DataProcessing },
  { id: 3, title: "Dashboard Overview", component: DashboardSummary },
  { id: 4, title: "Analytical Layers", component: AnalyticalLayers },
  { id: 5, title: "AI Insights", component: AIInsightsPanel },
  { id: 6, title: "Generate Report", component: ReportGeneration },
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = hero, 1-5 = demo steps
  const [isStarted, setIsStarted] = useState(false);

  const handleStartDemo = () => {
    setIsStarted(true);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < DEMO_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsStarted(false);
  };

  const CurrentStepComponent =
    currentStep > 0 ? DEMO_STEPS[currentStep - 1]?.component : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      {/* Progress Bar */}
      <AnimatePresence>
        {isStarted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-800">
                  Talazo Insights Demo
                </h2>
                <button
                  onClick={handleRestart}
                  className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Restart Demo
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center space-x-2 mb-4">
                {DEMO_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentStep > index
                          ? "bg-green-600 text-white"
                          : currentStep === index + 1
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {currentStep > index ? "✓" : index + 1}
                    </div>
                    {index < DEMO_STEPS.length - 1 && (
                      <div
                        className={`w-8 h-1 mx-2 transition-colors ${
                          currentStep > index + 1
                            ? "bg-green-600"
                            : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(currentStep / DEMO_STEPS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Current Step Info */}
              {currentStep > 0 && currentStep <= DEMO_STEPS.length && (
                <div className="mt-3 text-sm text-slate-600">
                  Step {currentStep} of {DEMO_STEPS.length}:{" "}
                  {DEMO_STEPS[currentStep - 1]?.title}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={isStarted ? "pt-24" : ""}>
        <AnimatePresence mode="wait">
          {!isStarted ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DemoHero onStartDemo={handleStartDemo} />
            </motion.div>
          ) : CurrentStepComponent ? (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="container mx-auto px-4 py-8"
            >
              <CurrentStepComponent
                onNext={handleNextStep}
                currentStep={currentStep}
              />
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-4 py-16 text-center"
            >
              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    className="w-10 h-10 text-green-600"
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
                </motion.div>

                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Demo Complete! 🎉
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  You&apos;ve experienced the full power of Talazo Insights.
                  From drone capture to actionable insights, our AI-driven
                  platform transforms agricultural monitoring.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleRestart}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors"
                  >
                    Run Demo Again
                  </button>
                  <a
                    href="/contact"
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-8 py-3 rounded-lg transition-colors"
                  >
                    Get Started Today
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
