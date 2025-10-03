"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SERVICE_PRICING } from "@/lib/constants";
import {
  User,
  MapPin,
  Calendar,
  Leaf,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Database Schema for Supabase (bookings table):
 *
 * CREATE TABLE bookings (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   full_name VARCHAR NOT NULL,
 *   email VARCHAR NOT NULL,
 *   phone VARCHAR NOT NULL,
 *   farm_location VARCHAR NOT NULL,
 *   farm_size VARCHAR NOT NULL,
 *   crop_names TEXT[] NOT NULL,
 *   experience VARCHAR,
 *   has_smartphone BOOLEAN DEFAULT true,
 *   preferred_language VARCHAR,
 *   hear_about_us VARCHAR,
 *   selected_plan VARCHAR,
 *   preferred_date DATE,
 *   additional_info TEXT,
 *   status VARCHAR DEFAULT 'pending',
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   updated_at TIMESTAMP DEFAULT NOW()
 * );
 */

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  farmLocation: string;
  farmSize: string;
  cropNames: string;
  experience: string;
  hasSmartphone: boolean;
  preferredLanguage: string;
  hearAboutUs: string;
  selectedPlan: string;
  preferredDate: string;
  additionalInfo: string;
}

export default function BookingPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    farmLocation: "",
    farmSize: "",
    cropNames: "",
    experience: "",
    hasSmartphone: true,
    preferredLanguage: "",
    hearAboutUs: "",
    selectedPlan: "",
    preferredDate: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const required = [
      "fullName",
      "email",
      "phone",
      "farmLocation",
      "farmSize",
      "cropNames",
    ];
    const missing = required.filter(
      (field) => !formData[field as keyof FormData]
    );

    if (missing.length > 0) {
      setSubmitStatus("error");
      setSubmitMessage(
        `Please fill in all required fields: ${missing.join(", ")}`
      );
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus("error");
      setSubmitMessage("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare data for API
      const bookingData = {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        farmSize: formData.farmSize,
        farmLocation: formData.farmLocation,
        cropTypes: formData.cropNames,
        farmingExperience: formData.experience,
        currentChallenges: formData.additionalInfo || "Not specified",
        preferredDate: formData.preferredDate,
        additionalNotes: formData.additionalInfo,
      };

      console.log("Submitting booking data:", bookingData);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit booking");
      }

      setSubmitStatus("success");
      setSubmitMessage(
        `Thank you ${firstName}! You've successfully joined our waitlist. We've sent a confirmation email to ${formData.email}. Our team will contact you within 24-48 hours with your custom pricing quote and to discuss next steps. Waitlist ID: ${result.bookingId}`
      );
      setShowModal(true);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        farmLocation: "",
        farmSize: "",
        cropNames: "",
        experience: "",
        hasSmartphone: true,
        preferredLanguage: "",
        hearAboutUs: "",
        selectedPlan: "",
        preferredDate: "",
        additionalInfo: "",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        error instanceof Error
          ? `Failed to submit booking: ${error.message}`
          : "An unexpected error occurred. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Success Modal */}
      {showModal && submitStatus === "success" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 relative animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to the Waitlist! 🎉
              </h3>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {submitMessage}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    setShowModal(false);
                    setSubmitStatus("idle");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1"
                >
                  Continue Browsing
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    setSubmitStatus("idle");
                    // Reset form for new booking
                    setFormData({
                      fullName: "",
                      email: "",
                      phone: "",
                      farmLocation: "",
                      farmSize: "",
                      cropNames: "",
                      experience: "",
                      hasSmartphone: true,
                      preferredLanguage: "",
                      hearAboutUs: "",
                      selectedPlan: "",
                      preferredDate: "",
                      additionalInfo: "",
                    });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  New Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Join the Waitlist for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  {" "}
                  Talazo Services
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Be among the first to experience precision agriculture in
                Zimbabwe. Complete the form below to join our waitlist and
                we&apos;ll notify you when we launch in your area.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Status Messages */}
              {submitStatus !== "idle" && (
                <div
                  className={`mb-8 p-4 rounded-lg flex items-center ${
                    submitStatus === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  )}
                  <p>{submitMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-6">
                    <User className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+263 77 123 4567"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Language{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="preferredLanguage"
                        value={formData.preferredLanguage}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select language</option>
                        <option value="english">English</option>
                        <option value="shona">Shona</option>
                        <option value="ndebele">Ndebele</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Farm Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-6">
                    <MapPin className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Farm Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input
                      label="Farm Location"
                      name="farmLocation"
                      value={formData.farmLocation}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Mazowe, Mashonaland Central"
                    />
                    <Input
                      label="Farm Size (hectares)"
                      name="farmSize"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 15.5"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Farming Experience{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select experience level</option>
                        <option value="beginner">Beginner (0-2 years)</option>
                        <option value="intermediate">
                          Intermediate (3-10 years)
                        </option>
                        <option value="experienced">
                          Experienced (10+ years)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How did you hear about us?{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="hearAboutUs"
                        value={formData.hearAboutUs}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select option</option>
                        <option value="social_media">Social Media</option>
                        <option value="word_of_mouth">Word of Mouth</option>
                        <option value="agricultural_extension">
                          Agricultural Extension Officer
                        </option>
                        <option value="online_search">Online Search</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Crop Names */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crop Names <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="cropNames"
                      value={formData.cropNames}
                      onChange={handleInputChange}
                      placeholder="e.g., Maize, Tobacco, Wheat, Soybeans"
                      className="w-full"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Please list the crops you are growing (separated by
                      commas)
                    </p>
                  </div>

                  {/* Smartphone */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hasSmartphone"
                      checked={formData.hasSmartphone}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label className="text-sm text-gray-700">
                      I have a smartphone and can use mobile apps
                    </label>
                  </div>
                </div>

                {/* Service Selection */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-6">
                    <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Service Plans
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries(SERVICE_PRICING).map(([key, plan]) => (
                      <label key={key} className="cursor-pointer">
                        <input
                          type="radio"
                          name="selectedPlan"
                          value={key}
                          checked={formData.selectedPlan === key}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div
                          className={`p-4 border-2 rounded-lg transition-colors ${
                            formData.selectedPlan === key
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-white hover:border-green-300"
                          }`}
                        >
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {plan.name}
                            </h3>
                            <p className="text-lg font-bold text-green-600 mb-1">
                              Custom Pricing
                            </p>
                            <p className="text-sm text-gray-600">
                              Contact for quote
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Custom Pricing:</strong> Our pricing is tailored
                      to your specific needs, farm size, and service
                      requirements. After you join the waitlist, we&apos;ll
                      contact you with a personalized quote based on your farm
                      details.
                    </p>
                  </div>

                  <Input
                    label="Preferred Contact Date"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-6">
                    <Leaf className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Additional Information
                    </h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tell us more about your farm and specific needs
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Any specific challenges, goals, or questions you'd like to discuss..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="px-12 py-4 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5 mr-2" />
                        Join Waitlist
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* What Happens Next */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                What Happens Next?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Confirmation & Quote
                  </h3>
                  <p className="text-gray-600">
                    We&apos;ll contact you within 24-48 hours with a custom
                    pricing quote based on your farm details.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Launch Notification
                  </h3>
                  <p className="text-gray-600">
                    You&apos;ll be among the first to know when we launch
                    services in your area.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Priority Access
                  </h3>
                  <p className="text-gray-600">
                    As a waitlist member, you&apos;ll get priority booking when
                    we start serving your region.
                  </p>
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
