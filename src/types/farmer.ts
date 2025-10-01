// Farmer related types
export interface Farmer {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  phone: string;
  farmLocation: string;
  farmSize: number;
  cropTypes: string[];
  experience: 'beginner' | 'intermediate' | 'experienced';
  hasSmartphone: boolean;
  preferredLanguage: 'english' | 'shona' | 'ndebele';
  hearAboutUs: 'social_media' | 'word_of_mouth' | 'agricultural_extension' | 'online_search' | 'other';
  additionalInfo?: string;
  status: 'active' | 'inactive' | 'pending';
}

// Form state types
export interface FormState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Contact form types
export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
}

// Service types
export interface ServicePlan {
  name: string;
  price: number;
  frequency: string;
  features: string[];
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  cropType: string;
  image?: string;
  quote: string;
  rating: number;
  verified: boolean;
}

// Navigation types
export interface NavigationLink {
  href: string;
  label: string;
}

// Feature types
export interface Feature {
  title: string;
  description: string;
  icon: string;
}