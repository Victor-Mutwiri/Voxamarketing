export interface NavItem {
  label: string;
  path: string;
}

export interface Industry {
  id: string;
  name: string;
  iconName: string; // Mapping to Lucide icons string name
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string;
}

export interface Statistic {
  label: string;
  value: string;
}

export interface Business {
  id: number;
  name: string;
  industry: string;
  location: string;
  rating: number;
  reviews: number;
  tags: string[];
  image: string;
  fullDescription: string;
  phone: string;
  email: string;
  website: string;
  isVerified: boolean;
  specialties: string[];
}

export interface User {
  id: string;
  email: string;
  password?: string; // In real app, this would be hashed
  businessId?: number;
  isProfileComplete: boolean;
  role: 'business' | 'admin';
}

export interface WaitlistEntry {
  email: string;
  code: string;
  isUsed: boolean;
}