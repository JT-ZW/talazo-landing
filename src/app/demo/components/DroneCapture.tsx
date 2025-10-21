"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DroneCaptureProps {
  onNext: () => void;
  currentStep: number;
}

export default function DroneCapture({ onNext }: DroneCaptureProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setUploadComplete(true);
      setTimeout(() => {
        onNext();
      }, 1500);
    }, 2000);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          Drone Imagery Capture
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Our drones capture high-resolution aerial images of your farmland to
          analyze crop health and identify areas that need attention.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Drone Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative"
        >
          <div className="relative h-96 bg-gradient-to-b from-blue-100 to-green-100 rounded-2xl overflow-hidden">
            {/* Background Farm Field */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/40 to-green-300/40" />

              {/* Farm rows pattern */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-8 bg-green-400/30 rounded-full"
                  style={{
                    left: "10%",
                    right: "10%",
                    top: `${15 + i * 8}%`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                />
              ))}
            </div>

            {/* Animated Drone */}
            <motion.div
              className="absolute w-16 h-16 z-10"
              animate={{
                x: [50, 250, 250, 50, 50],
                y: [50, 50, 200, 200, 50],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Drone Body */}
              <div className="relative">
                {/* Main body */}
                <div className="w-8 h-12 bg-slate-700 rounded-lg mx-auto">
                  {/* Camera */}
                  <motion.div
                    className="w-4 h-4 bg-slate-900 rounded-full mx-auto mt-8"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                </div>

                {/* Propellers */}
                {[
                  { top: 0, left: -8 },
                  { top: 0, right: -8 },
                  { bottom: 0, left: -8 },
                  { bottom: 0, right: -8 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-slate-600 rounded-full"
                    style={pos}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Capture Points */}
            <AnimatePresence>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-green-500 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 0.7],
                  }}
                  transition={{
                    delay: 1 + i * 0.5,
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Coverage Grid */}
            <motion.div
              className="absolute inset-4 border-2 border-dashed border-green-500/50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <div className="grid grid-cols-3 grid-rows-3 h-full gap-1">
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="border border-green-400/30 bg-green-400/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 + i * 0.1, duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-6 grid grid-cols-3 gap-4 text-center"
          >
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">15.2</div>
              <div className="text-sm text-slate-600">Hectares</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">4K</div>
              <div className="text-sm text-slate-600">Resolution</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">120m</div>
              <div className="text-sm text-slate-600">Altitude</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Upload Interface */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">
              Upload Aerial Images
            </h3>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isUploading
                  ? "border-green-500 bg-green-50"
                  : uploadComplete
                    ? "border-green-600 bg-green-100"
                    : "border-slate-300 hover:border-green-400 hover:bg-green-50/50 cursor-pointer"
              }`}
              onClick={
                !isUploading && !uploadComplete ? handleFileSelect : undefined
              }
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                multiple
              />

              <AnimatePresence mode="wait">
                {uploadComplete ? (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-green-600"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8"
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
                    <p className="text-lg font-semibold">
                      Images Uploaded Successfully!
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      24 high-resolution images captured
                    </p>
                  </motion.div>
                ) : isUploading ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600"
                  >
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
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </motion.div>
                    <p className="text-lg font-semibold">Uploading Images...</p>
                    <p className="text-sm text-slate-600 mt-2">
                      Processing drone imagery
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-600"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">
                      Click to Upload Drone Images
                    </p>
                    <p className="text-sm mt-2">
                      Or drag and drop your aerial imagery files here
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Supports: JPG, PNG, TIFF • Max 50MB per file
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Features */}
            <div className="mt-8 space-y-4">
              <h4 className="font-semibold text-slate-800">
                Capture Features:
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "📸", text: "Multi-spectral imaging" },
                  { icon: "🎯", text: "GPS coordinates" },
                  { icon: "⚡", text: "Real-time processing" },
                  { icon: "🔒", text: "Secure upload" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-3 text-sm text-slate-700"
                  >
                    <span className="text-lg">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Manual Upload Button */}
          {!isUploading && !uploadComplete && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              onClick={handleUpload}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Simulate Drone Capture
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
