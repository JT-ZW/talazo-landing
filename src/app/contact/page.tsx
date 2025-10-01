"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { COMPANY_INFO } from "@/lib/constants";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      details: COMPANY_INFO.phone,
      description: "Call us during business hours",
      action: `tel:${COMPANY_INFO.phone}`,
    },
    {
      icon: Mail,
      title: "Email",
      details: COMPANY_INFO.email,
      description: "We'll respond within 24 hours",
      action: `mailto:${COMPANY_INFO.email}`,
    },
    {
      icon: MapPin,
      title: "Office",
      details: COMPANY_INFO.address.full,
      description: "Visit our headquarters",
      action: "#",
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon - Fri: 8AM - 5PM",
      description: "Saturday: 9AM - 1PM",
      action: "#",
    },
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 5:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 1:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Get in
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  {" "}
                  Touch
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ready to transform your farming operations? Our team is here to
                help you get started with drone-powered crop monitoring and
                precision agriculture solutions.
              </p>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-900 font-medium mb-1">
                    {method.details}
                  </p>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      type="text"
                      required
                      placeholder="Your first name"
                    />
                    <Input
                      label="Last Name"
                      type="text"
                      required
                      placeholder="Your last name"
                    />
                  </div>
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+263 77 123 4567"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Farm Location
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select your province</option>
                      <option value="harare">Harare</option>
                      <option value="mashonaland-east">Mashonaland East</option>
                      <option value="mashonaland-west">Mashonaland West</option>
                      <option value="mashonaland-central">
                        Mashonaland Central
                      </option>
                      <option value="manicaland">Manicaland</option>
                      <option value="masvingo">Masvingo</option>
                      <option value="matabeleland-north">
                        Matabeleland North
                      </option>
                      <option value="matabeleland-south">
                        Matabeleland South
                      </option>
                      <option value="midlands">Midlands</option>
                      <option value="bulawayo">Bulawayo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">What can we help you with?</option>
                      <option value="general">General Inquiry</option>
                      <option value="services">Service Information</option>
                      <option value="pricing">Pricing Questions</option>
                      <option value="technical">Technical Support</option>
                      <option value="partnership">
                        Partnership Opportunities
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Tell us about your farm and how we can help..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                  <Button className="w-full h-11 px-8">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Get in Touch
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    Have questions about our services or need help getting
                    started? Our team of agricultural experts is ready to help
                    you optimize your farming operations with cutting-edge
                    technology.
                  </p>
                </div>

                {/* Office Hours */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Office Hours
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {officeHours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2"
                      >
                        <span className="text-gray-700">{schedule.day}</span>
                        <span className="text-gray-900 font-medium">
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-4">
                    Need Immediate Help?
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="/booking"
                      className="flex items-center justify-between p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-3" />
                        <span>Book a Consultation</span>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="flex items-center justify-between p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-3" />
                        <span>Call Now</span>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="flex items-center justify-between p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 mr-3" />
                        <span>Email Us</span>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* FAQ Quick Links */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Common Questions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MessageCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          How much area can you monitor?
                        </p>
                        <p className="text-gray-600 text-sm">
                          We monitor farms from 1 hectare to 1000+ hectares.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MessageCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          What crops do you monitor?
                        </p>
                        <p className="text-gray-600 text-sm">
                          Maize, tobacco, cotton, vegetables, and more.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MessageCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          How often do you visit?
                        </p>
                        <p className="text-gray-600 text-sm">
                          Depending on your plan: weekly, bi-weekly, or monthly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
