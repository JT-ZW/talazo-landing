"use client";

import Image from "next/image";
import { CloudRain, Bug, BarChart3, AlertTriangle } from "lucide-react";

export default function Problem() {
  const problems = [
    {
      icon: CloudRain,
      title: "Unpredictable Weather",
      description:
        "Climate change brings irregular rainfall patterns, making it difficult to plan irrigation and protect crops.",
    },
    {
      icon: Bug,
      title: "Pest & Disease Detection",
      description:
        "By the time farmers notice pest infestations, significant crop damage has already occurred.",
    },
    {
      icon: BarChart3,
      title: "Limited Data Access",
      description:
        "Most farmers lack access to real-time crop health data for informed decision-making.",
    },
    {
      icon: AlertTriangle,
      title: "Late Problem Detection",
      description:
        "Traditional methods rely on visual inspection, discovering problems too late for effective intervention.",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/farming/farming-2.jpg"
          alt="Zimbabwean farming challenges"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-red-900/85" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-xl">
            The Challenge for Zimbabwe Farmers
          </h2>
          <p className="text-lg text-white/95 max-w-2xl mx-auto drop-shadow-lg">
            Traditional farming methods face increasing challenges in
            today&apos;s changing climate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-red-500/25 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Icon className="w-6 h-6 text-red-200" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 drop-shadow-md">
                  {problem.title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
