"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  CheckCircle,
  Mail,
  Share2,
} from "lucide-react";

interface ReportGenerationProps {
  onNext: () => void;
  currentStep?: number;
}

export default function ReportGeneration({ onNext }: ReportGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setShowPreview(true);
    }, 3000);
  };

  const handleDownload = () => {
    // In a real implementation, this would use jsPDF to generate the PDF
    // For now, we'll create a simple data URL
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Talazo-Crop-Analysis-Report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = () => {
    return `
TALAZO INSIGHTS - CROP INTELLIGENCE REPORT
Generated: ${new Date().toLocaleDateString()}

=====================================
EXECUTIVE SUMMARY
=====================================

Field Area: 42.5 hectares
Analysis Date: ${new Date().toLocaleDateString()}
Overall Health Score: 87%
Predicted Yield: 8.4 t/ha (+15% above baseline)
Days to Harvest: 70 days

=====================================
KEY FINDINGS
=====================================

1. CROP HEALTH ASSESSMENT
   - Average NDVI: 0.72
   - Water Stress: 32% of area (3.2 ha affected)
   - Heat Stress: 18% (minimal impact)
   - Overall Vigor: 87% (Excellent)

2. DISEASE DETECTION
   - Early fungal infection detected in 3 zones (2.4 ha)
   - Confidence Level: 89%
   - Spread Risk: Moderate (25%)
   - Recommendation: Apply fungicide within 48 hours

3. NUTRIENT MANAGEMENT
   - Nitrogen (N): 68% - Adequate
   - Phosphorus (P): 52% - Moderate (deficiency in 8.5 ha)
   - Potassium (K): 71% - Good
   - Recommendation: Apply 25 kg/ha P₂O₅ to southern section

4. PLANT PHENOTYPING
   - Growth Stage: V6 (On track)
   - Canopy Cover: 74% (Excellent)
   - Plant Height: 1.2m (Optimal)
   - Growth Rate: 8% above regional average

5. WEED DETECTION
   - Weed Coverage: 8% (Manageable)
   - High Density Zones: 4 areas (4.2 ha)
   - Recommendation: Targeted herbicide application

=====================================
IMMEDIATE ACTION ITEMS
=====================================

1. Water Stress Management (URGENT - 24 hours)
   - Increase irrigation by 30% in eastern section
   - Expected impact: Prevent 8-12% yield loss

2. Disease Control (HIGH PRIORITY - 48 hours)
   - Apply fungicide to identified zones
   - Monitor adjacent areas for spread

3. Nutrient Supplementation (1 week)
   - Apply phosphorus to southern 8.5 ha
   - Expected yield increase: 12-15%

4. Weed Management (5 days)
   - Spot treatment in 4.2 ha high-density zones
   - Cost savings: $180/ha vs blanket spray

=====================================
YIELD OPTIMIZATION FORECAST
=====================================

Current Trajectory: 8.4 t/ha
Regional Average: 7.3 t/ha
Performance: +15% above baseline

With Recommended Actions:
- Potential Additional Increase: 5-8%
- Revenue Impact: +$2,400/ha
- ROI on Interventions: 340%

=====================================
LONG-TERM RECOMMENDATIONS
=====================================

1. Soil Health Improvement
   - Post-harvest cover cropping
   - Expected benefit: 20% reduction in input costs

2. Precision Irrigation System
   - Variable rate irrigation implementation
   - Water savings: 25% ($340/season)

=====================================
POWERED BY TALAZO INSIGHTS
Drone Crop Intelligence Platform
© 2025 Talazo Insights - All Rights Reserved

www.talazoinsights.com
support@talazoinsights.com
=====================================
`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Generate Comprehensive Report
        </h2>
        <p className="text-lg text-slate-600">
          Compile all insights into a detailed, shareable PDF document
        </p>
      </motion.div>

      {!isGenerated ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-12"
        >
          <div className="text-center">
            <motion.div
              animate={isGenerating ? { rotate: 360 } : { scale: [1, 1.1, 1] }}
              transition={
                isGenerating
                  ? { duration: 2, repeat: Infinity, ease: "linear" }
                  : { duration: 2, repeat: Infinity }
              }
              className="inline-block mb-6"
            >
              <FileText
                className={`w-24 h-24 mx-auto ${
                  isGenerating ? "text-green-600" : "text-slate-400"
                }`}
              />
            </motion.div>

            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              {isGenerating
                ? "Generating Your Report..."
                : "Ready to Generate Report"}
            </h3>

            {isGenerating && (
              <div className="mb-6">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-2 bg-green-600 rounded-full mx-auto max-w-md"
                />
                <p className="text-sm text-slate-600 mt-2">
                  Compiling data from all analytical layers...
                </p>
              </div>
            )}

            {!isGenerating && (
              <>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                  Your comprehensive field analysis report will include all
                  metrics, visualizations, AI insights, and actionable
                  recommendations.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      6
                    </div>
                    <div className="text-sm text-slate-600">
                      Analysis Sections
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      20+
                    </div>
                    <div className="text-sm text-slate-600">Data Points</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      12
                    </div>
                    <div className="text-sm text-slate-600">Visualizations</div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateReport}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Generate Report Now
                </button>
              </>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Report Generated Successfully!
              </h3>
              <p className="text-sm text-green-700">
                Your comprehensive crop analysis report is ready for download
                and sharing.
              </p>
            </div>
          </motion.div>

          {/* Report Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">
                  Talazo Insights - Crop Intelligence Report
                </h3>
                <p className="text-sm text-slate-300">
                  Field Analysis | {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">
                      Report Includes:
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Executive Summary & Key Findings
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Crop Health Assessment & NDVI Analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Disease Detection & Prevention
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Nutrient Management Plan
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Plant Phenotyping & Yield Forecast
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Weed Detection & Management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        AI-Generated Recommendations
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">
                      Report Statistics:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="text-sm text-slate-600">
                          Total Pages
                        </span>
                        <span className="font-semibold text-slate-800">18</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="text-sm text-slate-600">
                          File Size
                        </span>
                        <span className="font-semibold text-slate-800">
                          4.2 MB
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="text-sm text-slate-600">Format</span>
                        <span className="font-semibold text-slate-800">
                          PDF
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="text-sm text-slate-600">
                          Generated
                        </span>
                        <span className="font-semibold text-slate-800">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>

                  <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                    <Mail className="w-5 h-5" />
                    Email Report
                  </button>

                  <button className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Complete Demo Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-8"
          >
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Complete Demo Experience
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Footer Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-12"
      >
        <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
          <span className="text-sm text-slate-600">
            Powered by <span className="font-semibold">Talazo Insights</span> -
            Drone Crop Intelligence Platform
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          © 2025 Talazo Insights - Demo Mode
        </p>
      </motion.div>
    </div>
  );
}
