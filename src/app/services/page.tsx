import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SERVICE_PRICING } from "@/lib/constants";
import {
  Drone,
  BarChart3,
  Shield,
  MapPin,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: Drone,
      title: "Drone-Powered Crop Monitoring",
      description:
        "Advanced multispectral drone surveys provide detailed insights into crop health, growth patterns, and potential issues.",
      features: [
        "High-resolution aerial imagery",
        "Multispectral analysis",
        "NDVI vegetation mapping",
        "Growth stage monitoring",
        "Yield prediction models",
      ],
    },
    {
      icon: Shield,
      title: "Pest & Disease Detection",
      description:
        "Early identification of pests, diseases, and plant stress using AI-powered image analysis and thermal imaging.",
      features: [
        "Early pest detection",
        "Disease identification",
        "Stress pattern analysis",
        "Treatment recommendations",
        "Prevention strategies",
      ],
    },
    {
      icon: BarChart3,
      title: "Yield Analytics & Forecasting",
      description:
        "Data-driven insights help you predict yields, plan harvests, and optimize your farming operations.",
      features: [
        "Yield prediction models",
        "Harvest planning tools",
        "Market timing advice",
        "Historical trend analysis",
        "ROI optimization",
      ],
    },
    {
      icon: MapPin,
      title: "Precision Field Mapping",
      description:
        "Detailed field boundaries, topography, and soil variation mapping for precision agriculture applications.",
      features: [
        "Field boundary mapping",
        "Topographic analysis",
        "Soil variation detection",
        "Drainage assessment",
        "Irrigation planning",
      ],
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Consultation & Planning",
      description:
        "We start with understanding your farm's unique needs and creating a customized monitoring plan.",
    },
    {
      number: "02",
      title: "Drone Survey Deployment",
      description:
        "Our certified pilots conduct thorough aerial surveys using state-of-the-art multispectral drones.",
    },
    {
      number: "03",
      title: "Data Analysis & Processing",
      description:
        "Advanced AI algorithms analyze the collected data to generate actionable insights and recommendations.",
    },
    {
      number: "04",
      title: "Report Delivery & Support",
      description:
        "You receive detailed reports via our mobile app, plus ongoing support from our agricultural experts.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Our
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                  {" "}
                  Services
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive drone-powered agricultural monitoring services
                designed to maximize your farm&apos;s productivity, reduce
                costs, and optimize resource usage.
              </p>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-gray-700"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our streamlined process ensures you get the insights you need
                quickly and efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                    {index < processSteps.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-400 absolute top-6 -right-8 hidden lg:block" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Service Plans
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the plan that best fits your farm&apos;s size and
                monitoring needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(SERVICE_PRICING).map(([key, plan], index) => (
                <div
                  key={key}
                  className={`rounded-2xl p-8 ${
                    index === 1
                      ? "bg-gradient-to-br from-blue-500 to-green-500 text-white scale-105"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="text-center mb-8">
                    <h3
                      className={`text-2xl font-bold mb-2 ${
                        index === 1 ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <div className="flex items-center justify-center mb-4">
                      <span
                        className={`text-4xl font-bold ${
                          index === 1 ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${plan.price}
                      </span>
                      <span
                        className={`text-sm ml-2 ${
                          index === 1 ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        /{plan.frequency}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle
                          className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                            index === 1 ? "text-green-200" : "text-green-500"
                          }`}
                        />
                        <span
                          className={
                            index === 1 ? "text-blue-100" : "text-gray-600"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/booking"
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                      index === 1
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600"
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Optimize Your Farm?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of farmers who are already benefiting from our
              advanced monitoring services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/booking"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center justify-center"
              >
                Book a Service
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Ask Questions
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
