"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/homepage.jpg"
          alt="Zimbabwean farming landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/70 to-green-900/75" />
      </div>

      {/* Minimal Floating Elements */}
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-green-400/30 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Clean Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 text-white text-sm font-medium mb-8 shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm" />
            Precision Agriculture for Zimbabwe
          </div>

          {/* Cleaner Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-xl">
            Smart Farming Solutions
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 drop-shadow-2xl">
              Built for Zimbabwe
            </span>
          </h1>

          {/* Simplified Subheading */}
          <p className="text-lg sm:text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
            Get actionable insights for your farm with drone technology and
            AI-powered crop monitoring. Increase yields while reducing costs.
          </p>

          {/* Clean CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              <span className="mr-2">Book Your Assessment</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {/* Simplified Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: "5+", label: "Farmers Served" },
              { value: "3+", label: "Hectares Monitored" },
              { value: "30%", label: "Average Expected Yield Increase" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
                  {stat.value}
                </div>
                <div className="text-sm text-white/90 drop-shadow-md">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Background Accent */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-green-400/5 to-blue-400/5 rounded-full blur-3xl" />
    </section>
  );
}
