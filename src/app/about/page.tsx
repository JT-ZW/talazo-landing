import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TrendingUp, Globe, Heart, Zap, Shield } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Farmer-Centric",
      description:
        "Every solution we build puts farmers first, addressing real challenges faced in Zimbabwean agriculture.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We leverage cutting-edge drone technology and AI to bring precision agriculture to every farm.",
    },
    {
      icon: Shield,
      title: "Reliability",
      description:
        "Farmers depend on us for critical insights. We deliver accurate, timely data you can trust.",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description:
        "Our technology helps farmers optimize resources, reduce waste, and build sustainable farming practices.",
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
              <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                At Talazo Agritech, we&apos;re passionate about empowering
                Zimbabwean farmers with cutting-edge drone technology and
                AI-driven insights to maximize yields, reduce costs, and build
                sustainable farming practices.
              </p>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/20 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded in 2023, Talazo Agritech emerged from a simple
                    observation: Zimbabwean farmers needed better tools to
                    monitor their crops and make informed decisions. Traditional
                    farming methods, while time-tested, often lack the precision
                    needed to optimize yields in today&apos;s challenging
                    climate.
                  </p>
                  <p>
                    Our founders, combining expertise in agricultural
                    engineering, software development, and local farming
                    knowledge, set out to create affordable, accessible
                    technology solutions that could make a real difference in
                    farmers&apos; lives.
                  </p>
                  <p>
                    Today, we serve farmers across Zimbabwe, from small-scale
                    vegetable growers to large commercial operations, helping
                    them increase yields by up to 30% while reducing input costs
                    by 25%.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-24 h-24 text-green-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-gray-900">500+</p>
                    <p className="text-gray-600">Farms Monitored</p>
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
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                  <p className="text-gray-600 leading-relaxed">
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
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
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
