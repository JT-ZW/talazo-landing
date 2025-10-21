'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

interface ReportSectionProps {
  onNext: () => void;
  currentStep: number;
}

const REPORT_SECTIONS = [
  { id: 1, title: 'Executive Summary', icon: '📋', status: 'complete' },
  { id: 2, title: 'Field Overview', icon: '🌾', status: 'complete' },
  { id: 3, title: 'NDVI Analysis', icon: '📊', status: 'complete' },
  { id: 4, title: 'Health Assessment', icon: '🌱', status: 'complete' },
  { id: 5, title: 'Recommendations', icon: '🎯', status: 'complete' },
  { id: 6, title: 'Economic Impact', icon: '💰', status: 'complete' },
];

export default function ReportSection({ onNext }: ReportSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 3000);
  };

  const downloadPDF = () => {
    setDownloadStarted(true);
    
    // Create PDF with jsPDF
    const doc = new jsPDF();
    
    // Set font
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    
    // Title
    doc.text('Talazo Insights Field Report', 20, 30);
    
    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Field Information
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Field Overview', 20, 65);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Area: 15.2 hectares', 20, 80);
    doc.text('Location: Harare, Zimbabwe', 20, 90);
    doc.text('Crop Type: Maize', 20, 100);
    doc.text('Analysis Date: ' + new Date().toLocaleDateString(), 20, 110);
    
    // Health Summary
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Health Summary', 20, 130);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Overall Health Score: 8.2/10', 20, 145);
    doc.text('Healthy Vegetation: 82%', 20, 155);
    doc.text('Stressed Areas: 18%', 20, 165);
    doc.text('Average NDVI: 0.72', 20, 175);
    
    // Key Recommendations
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Recommendations', 20, 195);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('1. Apply nitrogen fertilizer to southwest corner (2.3 ha)', 20, 210);
    doc.text('2. Inspect irrigation systems in stressed zones', 20, 220);
    doc.text('3. Monitor pest activity in boundary areas', 20, 230);
    doc.text('4. Expected yield improvement: 15% with actions', 20, 240);
    
    // Economic Impact
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Economic Impact', 20, 260);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Expected yield: 3.2 t/ha', 20, 275);
    doc.text('Potential revenue increase: $2,340', 20, 285);
    doc.text('Implementation cost: $180', 20, 295);
    doc.text('ROI: 1,300%', 20, 305);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Powered by Talazo Insights - Smart Agriculture Solutions', 20, 320);
    
    // Save the PDF
    doc.save('talazo-field-report.pdf');
    
    setTimeout(() => {
      setDownloadStarted(false);
      onNext();
    }, 1500);
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
          Generate Field Report
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Get a comprehensive PDF report with all insights, recommendations, and analysis 
          results ready to share with your team or stakeholders.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column - Report Preview */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-6"
        >
          {/* Report Preview Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Talazo Field Report</h3>
                  <p className="text-green-100">Comprehensive Analysis & Recommendations</p>
                </div>
              </div>
            </div>

            {/* Report Content Preview */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {REPORT_SECTIONS.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{section.icon}</span>
                      <span className="font-medium text-slate-800">{section.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {section.status}
                      </span>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Report Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">8</div>
                  <div className="text-sm text-slate-600">Pages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">12</div>
                  <div className="text-sm text-slate-600">Insights</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">4</div>
                  <div className="text-sm text-slate-600">Charts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">6</div>
                  <div className="text-sm text-slate-600">Actions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6"
          >
            <h4 className="font-semibold text-slate-800 mb-4">Report Features</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { icon: '📊', text: 'Interactive charts' },
                { icon: '🗺️', text: 'NDVI maps' },
                { icon: '💡', text: 'AI insights' },
                { icon: '📱', text: 'Mobile-friendly' },
                { icon: '🔒', text: 'Secure sharing' },
                { icon: '📤', text: 'Export options' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-slate-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Generation Interface */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-8"
        >
          {/* Generation Status */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <AnimatePresence mode="wait">
              {!isGenerating && !reportGenerated ? (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Ready to Generate Report
                  </h3>
                  <p className="text-slate-600 mb-8">
                    All analysis is complete. Click below to generate your comprehensive field report.
                  </p>
                  <button
                    onClick={generateReport}
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Generate PDF Report
                  </button>
                </motion.div>
              ) : isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Generating Report...
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Compiling analysis results and formatting your report.
                  </p>
                  
                  {/* Progress Steps */}
                  <div className="space-y-3">
                    {[
                      'Organizing data...',
                      'Creating visualizations...',
                      'Formatting document...',
                      'Finalizing report...'
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.5, duration: 0.5 }}
                        className="flex items-center justify-center space-x-2 text-sm text-slate-600"
                      >
                        <motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                        />
                        <span>{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Report Generated Successfully!
                  </h3>
                  <p className="text-slate-600 mb-8">
                    Your comprehensive field analysis report is ready for download.
                  </p>
                  <button
                    onClick={downloadPDF}
                    disabled={downloadStarted}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    {downloadStarted ? 'Downloading...' : 'Download PDF Report'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Report Options */}
          {reportGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h4 className="font-semibold text-slate-800 mb-4">Share Options</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📧</span>
                    <span className="text-slate-700">Email Report</span>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🔗</span>
                    <span className="text-slate-700">Share Link</span>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">☁️</span>
                    <span className="text-slate-700">Save to Cloud</span>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* Powered By */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-center text-sm text-slate-500"
          >
            <p>Powered by Talazo Insights</p>
            <p>Smart Agriculture Solutions for Zimbabwe</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}