"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Image, CheckCircle } from "lucide-react";

interface UploadSimulationProps {
  onNext: () => void;
  currentStep?: number;
}

const SAMPLE_IMAGES = [
  {
    id: 1,
    name: "Wheat Field A - Multispectral",
    size: "24.5 MB",
    resolution: "4000 x 3000",
    type: "RGB + NIR",
  },
  {
    id: 2,
    name: "Corn Field B - Thermal",
    size: "18.2 MB",
    resolution: "3840 x 2160",
    type: "Thermal + RGB",
  },
  {
    id: 3,
    name: "Rice Paddy C - NDVI",
    size: "31.8 MB",
    resolution: "5120 x 3840",
    type: "5-band Multispectral",
  },
];

export default function UploadSimulation({ onNext }: UploadSimulationProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleImageSelect = (id: number) => {
    setSelectedImage(id);
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      setTimeout(() => {
        onNext();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Upload Multispectral Imagery
        </h2>
        <p className="text-lg text-slate-600">
          Select a sample image or upload your own drone-captured imagery for
          analysis
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-8"
      >
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-green-500 transition-colors cursor-pointer">
          <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            Drop your images here
          </h3>
          <p className="text-slate-500 mb-4">
            or click to browse (JPG, PNG, TIFF - Max 50MB)
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
            Browse Files
          </button>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-1 border-t border-slate-300"></div>
        <span className="px-4 text-slate-500 font-medium">OR</span>
        <div className="flex-1 border-t border-slate-300"></div>
      </div>

      {/* Sample Images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">
          Choose from Sample Images
        </h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {SAMPLE_IMAGES.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => handleImageSelect(image.id)}
              className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-xl ${
                selectedImage === image.id
                  ? "ring-2 ring-green-500 scale-105"
                  : ""
              }`}
            >
              <div className="relative mb-4">
                <div className="w-full h-40 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image className="w-16 h-16 text-green-600" />
                </div>
                {selectedImage === image.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">
                {image.name}
              </h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>Size: {image.size}</p>
                <p>Resolution: {image.resolution}</p>
                <p className="text-green-600 font-medium">{image.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        {uploadComplete ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-lg"
          >
            <CheckCircle className="w-5 h-5" />
            Upload Complete! Processing...
          </motion.div>
        ) : (
          <button
            onClick={handleUpload}
            disabled={!selectedImage || isUploading}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              selectedImage && !isUploading
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Uploading...
              </span>
            ) : (
              "Start Analysis"
            )}
          </button>
        )}
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid md:grid-cols-3 gap-4 mt-12"
      >
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">5-Band</div>
          <div className="text-sm text-slate-600">Multispectral Support</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">10cm</div>
          <div className="text-sm text-slate-600">Ground Resolution</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">30 sec</div>
          <div className="text-sm text-slate-600">Processing Time</div>
        </div>
      </motion.div>
    </div>
  );
}
