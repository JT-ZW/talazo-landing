"use client";

import Link from "next/link";
import { COMPANY_INFO, NAVIGATION_LINKS } from "@/lib/constants";
import {
  MapPin,
  Phone,
  Mail,
  Leaf,
  ArrowUp,
  Send,
  Drone,
  BarChart3,
  Users,
  Award,
  Clock,
  Shield,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = [
    { name: "Crop Monitoring", icon: BarChart3 },
    { name: "Drone Surveys", icon: Drone },
    { name: "Yield Analysis", icon: Award },
    { name: "Pest Detection", icon: Shield },
  ];

  const serviceAreas = ["Manicaland"];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur-3xl" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0V0zm30 0h1v1h-1V0zm30 0h1v1h-1V0z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-slate-700/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                Stay Updated
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Get the Latest in
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  {" "}
                  AgriTech
                </span>
              </h3>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Subscribe to receive insights on precision farming, crop
                monitoring tips, and the latest technology updates for
                Zimbabwean farmers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-xl font-semibold transition-all duration-200 group">
                <span>Subscribe</span>
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Company Section - Spans 4 columns */}
            <div className="lg:col-span-4">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur opacity-20 -z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">
                    {COMPANY_INFO.name}
                  </span>
                  <span className="text-green-400 text-sm">
                    {COMPANY_INFO.tagline}
                  </span>
                </div>
              </div>

              <p className="text-slate-300 mb-8 max-w-sm leading-relaxed">
                Revolutionizing Zimbabwean agriculture through cutting-edge
                drone technology and AI-powered crop monitoring. Helping farmers
                maximize yields while minimizing costs.
              </p>

              {/* Trust Badges */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-300">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">5+ Satisfied Farmers</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Award className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="w-4 h-4 text-green-400" />
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-3">
                <a
                  href={COMPANY_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-slate-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-green-600 transition-all duration-300 group border border-slate-700/50"
                >
                  <svg
                    className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                <a
                  href={COMPANY_INFO.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-slate-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-green-600 transition-all duration-300 group border border-slate-700/50"
                >
                  <svg
                    className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>

                <a
                  href={COMPANY_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-slate-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-green-600 transition-all duration-300 group border border-slate-700/50"
                >
                  <svg
                    className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>

                <a
                  href={COMPANY_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-slate-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-green-600 transition-all duration-300 group border border-slate-700/50"
                >
                  <svg
                    className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.317C4.198 14.81 3.72 13.61 3.72 12.017s.479-2.794 1.407-3.671c.875-.827 2.026-1.316 3.323-1.316 1.297 0 2.448.49 3.323 1.316.928.877 1.407 2.078 1.407 3.671s-.479 2.793-1.407 3.671c-.875.827-2.026 1.317-3.323 1.317zm7.83-9.456c-.384 0-.7-.315-.7-.7 0-.384.316-.699.7-.699.385 0 .7.315.7.699 0 .385-.315.7-.7.7z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Services Section - Spans 2 columns */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6">
                Our Services
              </h3>
              <ul className="space-y-4">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <li key={service.name}>
                      <Link
                        href="#"
                        className="flex items-center gap-3 text-slate-300 hover:text-green-400 transition-colors duration-200 group"
                      >
                        <Icon className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform duration-200" />
                        <span>{service.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Navigation Section - Spans 2 columns */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-green-400 transition-colors duration-200 group flex items-center"
                    >
                      <span>{link.label}</span>
                      <ArrowUp className="w-3 h-3 ml-1 rotate-45 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-300 hover:text-green-400 transition-colors duration-200 group flex items-center"
                  >
                    <span>Privacy Policy</span>
                    <ArrowUp className="w-3 h-3 ml-1 rotate-45 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-300 hover:text-green-400 transition-colors duration-200 group flex items-center"
                  >
                    <span>Terms of Service</span>
                    <ArrowUp className="w-3 h-3 ml-1 rotate-45 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service Areas Section - Spans 2 columns */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6">
                Service Areas
              </h3>
              <ul className="space-y-3">
                {serviceAreas.map((area) => (
                  <li key={area} className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section - Spans 2 columns */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/20 transition-colors duration-200 border border-slate-700/50">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      <a
                        href={`tel:${COMPANY_INFO.phone}`}
                        className="hover:text-green-400 transition-colors duration-200"
                      >
                        {COMPANY_INFO.phone}
                      </a>
                    </p>
                    <p className="text-slate-400 text-xs font-medium">
                      24/7 Support Available
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/20 transition-colors duration-200 border border-slate-700/50">
                    <Mail className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      <a
                        href={`mailto:${COMPANY_INFO.email}`}
                        className="hover:text-green-400 transition-colors duration-200"
                      >
                        {COMPANY_INFO.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/20 transition-colors duration-200 border border-slate-700/50">
                    <MapPin className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {COMPANY_INFO.address.full}
                    </p>
                    <p className="text-slate-400 text-xs font-medium">Visit Our Office</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-slate-400">
              <p>© 2025 {COMPANY_INFO.name}. All rights reserved.</p>
              <div className="flex items-center gap-1"></div>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-slate-300 hover:text-white hover:bg-green-600/20 hover:border-green-500/30 transition-all duration-300 group"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
