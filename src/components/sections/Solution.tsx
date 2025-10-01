"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { Drone, Brain, Smartphone, ArrowRight } from "lucide-react";

export default function Solution() {
  const solutions = [
    {
      icon: Drone,
      title: "Drone Technology",
      description:
        "High-resolution cameras capture detailed crop imagery, providing insights invisible to the naked eye.",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description:
        "Machine learning algorithms identify crop stress, diseases, and nutrient deficiencies early.",
    },
    {
      icon: Smartphone,
      title: "Mobile Platform",
      description:
        "Easy-to-use mobile app delivers actionable insights in English, Shona, and Ndebele.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Solution Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Our Solution
            </h2>
            <p className="text-lg text-slate-700 mb-8 leading-relaxed font-medium">
              Advanced technology made simple for Zimbabwean farmers. Our
              integrated platform combines drone technology, AI analysis, and
              mobile accessibility to transform how you manage your farm.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700 font-medium">Real-time monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700 font-medium">Early detection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700 font-medium">Local language support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700 font-medium">Affordable pricing</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/technology/drone-1.jpg"
                alt="Agricultural drone technology in Zimbabwe"
                width={600}
                height={400}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-500 rounded-full opacity-20"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-blue-500 rounded-full opacity-20"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {solution.title}
                </h3>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Simple CTA */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to Transform Your Farm?
          </h3>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of Zimbabwean farmers already using our technology to
            increase yields and reduce costs.
          </p>
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-white font-semibold rounded-lg group">
            <span className="mr-2">Start Your Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </section>
  );
}
