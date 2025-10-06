import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AfricanPattern from "@/components/ui/AfricanPattern";
import {
  TrendingUp,
  Globe,
  Heart,
  Zap,
  Shield,
  ArrowRight,
  Plane,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Inclusivity",
      description:
        "Accessible solutions for all farmers, from smallholders to large-scale operations, ensuring everyone can benefit from precision agriculture.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Smart, data-driven agritech that leverages cutting-edge drone technology and AI to deliver timely, actionable insights.",
    },
    {
      icon: Shield,
      title: "Sustainability",
      description:
        "Climate-smart and eco-friendly solutions that help farmers optimize resources, reduce waste, and build resilient farming practices.",
    },
    {
      icon: Globe,
      title: "Impact",
      description:
        "Real results in yields and livelihoods, empowering farmers with technology that makes a tangible difference in their productivity and income.",
    },
  ];

  const team = [
    {
      name: "Jeffrey-Takunda Murungweni",
      role: "Chief Executive Officer",
      bio: "Computer Scientist with a passion for leveraging technology to solve real-world agricultural challenges.",
      image: "/images/team/ceo.jpg",
    },
    {
      name: "Alexandra Mwondoka",
      role: "Head of Technology",
      bio: "Software engineer specializing in AI and machine learning for agricultural applications.",
      image: "/images/team/cto.jpg",
    },
    {
      name: "Berthia Mugwagwa",
      role: "Agronomy Expert",
      bio: "Rising crop science expert with deep understanding of Zimbabwean farming challenges.",
      image: "/images/team/coo.jpg",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/farming/farming-3.jpg"
              alt="Zimbabwean agriculture and technology"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/85 via-blue-900/75 to-slate-900/70" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-xl">
                Transforming Agriculture with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 drop-shadow-2xl">
                  {" "}
                  Technology
                </span>
              </h1>
              <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg mb-8">
                Empowering African communities to achieve lasting food security
                through digital transformation in agriculture.
              </p>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/20 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Vision */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-green-500">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Globe className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Vision
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed font-medium">
                    Empowering African communities to achieve lasting food
                    security.
                  </p>
                </div>

                {/* Mission */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-blue-500">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <TrendingUp className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Mission
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed font-medium">
                    To drive digital transformation in Africa&apos;s
                    agriculture, boosting productivity sustainably through
                    inclusive technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed font-medium">
                  <p>
                    The story of Talazo Agritech begins in Sadziwa Village,
                    Manicaland, where a devastating pest outbreak in 2023
                    threatened to destroy the season&apos;s harvest. Local
                    farmers watched helplessly as their crops succumbed to
                    infestations that could have been caught earlier—if only
                    they had the right tools to monitor their fields.
                  </p>
                  <p>
                    Alex Mwondoka and Jeffrey Murungweni, two computer science
                    students visiting family in the area, witnessed this crisis
                    firsthand. They saw how traditional farming methods, while
                    valuable, couldn&apos;t compete with the precision needed to
                    detect problems before they spiraled out of control. In
                    those conversations with frustrated farmers, a vision was
                    born.
                  </p>
                  <p>
                    &quot;We realized we had the technical skills to change
                    this,&quot; recalls Alex. &quot;We weren&apos;t going to
                    accept the status quo when technology could make such a
                    difference.&quot; They set out to build a solution that
                    would put cutting-edge agricultural intelligence into the
                    hands of every Zimbabwean farmer—regardless of farm size or
                    resources.
                  </p>
                  <p>
                    But their ambition extended far beyond one village. They
                    envisioned a software-first approach that could scale across
                    borders, integrate with various hardware platforms, and
                    serve the entire Pan-African agricultural community. What
                    started as a response to a local crisis evolved into a
                    mission to democratize precision agriculture across the
                    continent.
                  </p>
                  <p>
                    Today, Talazo Agritech combines drone technology, AI-powered
                    analytics, and deep agricultural expertise to help farmers
                    make data-driven decisions. From small-scale vegetable
                    growers to large commercial operations, we&apos;re proving
                    that smart technology isn&apos;t just for wealthy
                    nations—it&apos;s for every farmer who wants to maximize
                    yields, reduce costs, and build resilient, sustainable
                    farming practices.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center p-8">
                  <div className="text-center">
                    <TrendingUp className="w-24 h-24 text-green-600 mx-auto mb-4" />
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      From Crisis
                    </p>
                    <p className="text-2xl font-bold text-green-600 mb-4">
                      To Innovation
                    </p>
                    <p className="text-gray-700 font-medium text-lg">
                      Building Pan-African Agricultural Intelligence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
                These core principles guide everything we do and shape how we
                serve the farming community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
                A passionate group of agricultural experts, engineers, and
                innovators dedicated to transforming farming in Zimbabwe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners & Ecosystem Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our Ecosystem
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
                We collaborate with trusted partners to deliver comprehensive
                solutions that empower farmers at every step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Testing Labs
                </h3>
                <p className="text-gray-600 text-sm">
                  Soil and crop analysis for precise recommendations
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Agro-Dealers
                </h3>
                <p className="text-gray-600 text-sm">
                  Input suppliers aligned with our insights
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Drone Services
                </h3>
                <p className="text-gray-600 text-sm">
                  Hardware partners for scalable operations
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Extension Services
                </h3>
                <p className="text-gray-600 text-sm">
                  NGOs and agencies expanding our reach
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 relative overflow-hidden">
          {/* African Pattern Overlay */}
          <div className="absolute inset-0 text-yellow-300">
            <AfricanPattern variant="tribal" opacity={0.12} />
          </div>
          
          {/* Animated Decorative Elements */}
          <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white/20 rotate-45 animate-spin-slow" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-2 border-white/20 rounded-full animate-african-pulse" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6"
              style={{
                color: "#000000",
                textShadow:
                  "0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7), 2px 2px 4px rgba(255,255,255,0.8)",
              }}
            >
              Ready to Transform Your Farm?
            </h2>
            <p
              className="text-xl mb-8 max-w-2xl mx-auto font-bold"
              style={{
                color: "#000000",
                textShadow:
                  "0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7), 2px 2px 4px rgba(255,255,255,0.8)",
              }}
            >
              Join hundreds of farmers who are already using our technology to
              increase yields and reduce costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/booking"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Book a Consultation
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
