"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import AfricanPattern from "@/components/ui/AfricanPattern";
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
        
        {/* African Pattern Overlay */}
        <div className="absolute inset-0 text-orange-400">
          <AfricanPattern variant="geometric" opacity={0.08} />
        </div>
      </div>

      {/* Animated African-inspired Elements */}
      <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-orange-400/20 rotate-45 animate-spin-slow" />
      <div className="absolute top-1/3 right-1/5 w-12 h-12 border-2 border-yellow-500/20 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border-2 border-green-400/20 rotate-45 animate-bounce-slow" />
      <div className="absolute bottom-1/4 left-1/5 w-8 h-8">
        <svg viewBox="0 0 100 100" className="animate-spin-slow">
          <polygon points="50,15 90,85 10,85" fill="none" stroke="rgba(251, 146, 60, 0.2)" strokeWidth="2" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Clean Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 text-white text-sm font-medium mb-8 shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm" />
            Empowering African Communities for Food Security
          </div>

          {/* Cleaner Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-xl">
            Smart Farming Solutions
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 drop-shadow-2xl">
              Built for Africa
            </span>
          </h1>

          {/* Simplified Subheading */}
          <p
            className="text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-bold"
            style={{
              color: "#000000",
              textShadow:
                "2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)",
            }}
          >
            Turn aerial imagery into farmer-friendly insights. Identify pests,
            diseases, and water stress early to protect yields, increase
            productivity, and build climate resilience.
          </p>

          {/* Clean CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              href="/booking"
              className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-50 px-8 py-4 font-bold rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group border-2 border-green-500 text-lg"
            >
              <span className="mr-2">Join Waitlist</span>
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
