// Site configuration
export const SITE_CONFIG = {
  name: "Talazo Agritech",
  description: "Revolutionary drone-powered crop monitoring services for Zimbabwean farmers. Increase your yields, reduce costs, and farm smarter with our advanced agricultural technology.",
  url: "https://talazo.co.zw",
  author: "Talazo Agritech Team",
  keywords: [
    "agriculture technology",
    "drone farming",
    "crop monitoring",
    "Zimbabwe farming",
    "precision agriculture",
    "smart farming",
    "agricultural drones",
    "crop health monitoring",
    "farm management",
    "agricultural innovation"
  ],
} as const;

// Company information
export const COMPANY_INFO = {
  name: "Talazo Agritech",
  tagline: "Farming Smarter, Growing Better",
  phone: "+263 78 630 3048",
  email: "info@talazoagritech.com",
  address: {
    street: "1 Fairfield Road",
    city: "Mutare",
    country: "Zimbabwe",
    full: "1 Fairfield Road, Mutare, Zimbabwe"
  },
  social: {
    twitter: "https://twitter.com/talazoagritech",
    linkedin: "https://linkedin.com/company/talazo-agritech",
    facebook: "https://facebook.com/talazoagritech",
    instagram: "https://instagram.com/talazoagritech",
  }
} as const;

// Crop types available for monitoring
export const CROP_TYPES = [
  { value: "maize", label: "Maize", icon: "🌽" },
  { value: "tobacco", label: "Tobacco", icon: "🚬" },
  { value: "cotton", label: "Cotton", icon: "🌸" },
  { value: "soybeans", label: "Soybeans", icon: "🫘" },
  { value: "wheat", label: "Wheat", icon: "🌾" },
  { value: "sunflower", label: "Sunflower", icon: "🌻" },
  { value: "groundnuts", label: "Groundnuts", icon: "🥜" },
  { value: "vegetables", label: "Vegetables", icon: "🥬" },
  { value: "fruits", label: "Fruits", icon: "🍎" },
  { value: "other", label: "Other", icon: "🌱" },
] as const;

// Service pricing (in USD)
export const SERVICE_PRICING = {
  basic: {
    name: "Basic Monitoring",
    price: 50,
    frequency: "monthly",
    features: [
      "Monthly drone flights",
      "Basic crop health report",
      "Email notifications",
      "Mobile app access"
    ]
  },
  premium: {
    name: "Premium Monitoring",
    price: 120,
    frequency: "monthly",
    features: [
      "Bi-weekly drone flights",
      "Detailed analytics report",
      "Real-time alerts",
      "Mobile app access",
      "Expert consultation",
      "Custom recommendations"
    ]
  },
  enterprise: {
    name: "Enterprise Solution",
    price: 300,
    frequency: "monthly",
    features: [
      "Weekly drone flights",
      "Advanced AI analytics",
      "24/7 monitoring",
      "Priority support",
      "Custom integrations",
      "On-site consultation",
      "Bulk discounts available"
    ]
  }
} as const;

// Navigation links
export const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/contact", label: "Contact Us" },
  { href: "/booking", label: "Make a Booking" },
] as const;

// Feature highlights
export const FEATURES = [
  {
    title: "Drone-Powered Monitoring",
    description: "Advanced drones equipped with multispectral cameras for precise crop analysis",
    icon: "drone",
  },
  {
    title: "AI-Driven Insights",
    description: "Machine learning algorithms provide actionable insights for better decision making",
    icon: "brain",
  },
  {
    title: "Real-Time Alerts",
    description: "Instant notifications about crop health issues, pest infestations, and irrigation needs",
    icon: "bell",
  },
  {
    title: "Easy Mobile Access",
    description: "User-friendly app for farmers to access reports and insights anywhere",
    icon: "smartphone",
  },
  {
    title: "Expert Support",
    description: "Agricultural experts available to help interpret data and provide recommendations",
    icon: "users",
  },
  {
    title: "Cost Effective",
    description: "Affordable solutions that increase yields while reducing operational costs",
    icon: "dollar-sign",
  },
] as const;