"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { COMPANY_INFO, NAVIGATION_LINKS } from "@/lib/constants";
import { Menu, X, ArrowRight, Leaf } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMenuOpen) {
      const handleClickOutside = () => setIsMenuOpen(false);
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50"
          : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Premium Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Logo Background with Gradient */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-200 transition-all duration-300 group-hover:scale-105">
                <Leaf className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 -z-10" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-green-600 transition-colors duration-200">
                {COMPANY_INFO.name}
              </span>
              <span className="text-xs lg:text-sm text-green-600 -mt-1 opacity-80">
                {COMPANY_INFO.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <nav className="flex items-center space-x-1 mr-4">
              {NAVIGATION_LINKS.slice(0, -1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-slate-700 hover:text-green-600 font-medium transition-all duration-200 rounded-lg hover:bg-green-50/50 group"
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Hover Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                </Link>
              ))}
            </nav>

            {/* Join Waitlist CTA Button */}
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-white hover:bg-green-50 text-green-700 hover:text-green-800 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group whitespace-nowrap border-2 border-green-600 hover:border-green-700"
            >
              <span className="font-medium">Join Waitlist</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
          >
            <div className="relative w-6 h-6">
              {isMenuOpen ? (
                <X className="w-6 h-6 absolute inset-0 transition-all duration-200" />
              ) : (
                <Menu className="w-6 h-6 absolute inset-0 transition-all duration-200" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-out overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <div className="border-t border-slate-200/50 pt-4">
            <nav className="flex flex-col space-y-1 mb-4">
              {NAVIGATION_LINKS.slice(0, -1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-700 hover:text-green-600 font-medium px-4 py-3 rounded-xl hover:bg-green-50/50 transition-all duration-200 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="flex items-center justify-between">
                    {link.label}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </span>
                </Link>
              ))}

              {/* Mobile Waitlist CTA */}
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-green-700 hover:text-green-800 font-semibold px-4 py-3 rounded-xl shadow-lg mt-2 group whitespace-nowrap border-2 border-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              >
                <span className="font-medium">Join Waitlist</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
