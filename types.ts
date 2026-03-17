

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

export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DailyHours {
  isOpen: boolean;
  open: string;
  close: string;
}

export type OperatingHours = Record<WeekDay, DailyHours>;

export type EntityType = 'Business' | 'Company' | 'Organization' | 'Consultant';

export interface BusinessMetrics {
  views: number;
  contactReveals: number;
  websiteClicks: number;
}

export type MetricType = 'view' | 'contact_reveal' | 'website_click';

export interface AnalyticsEvent {
  id: string;
  businessId: string;
  type: MetricType;
  timestamp: string; // ISO String
}

export interface Business {
  id: string;
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
  isVisible: boolean;
  joinedAt: string; // ISO Date for when they signed up
  accountStatus?: 'active' | 'suspended' | 'banned';
  metrics?: BusinessMetrics;
  specialties: string[];
  operatingHours?: OperatingHours;
  entityType?: EntityType;
  // AI score (optional, injected during search)
  score?: number;
  matchScore?: number;
}

export interface User {
  id: string;
  email: string;
  password?: string; // In real app, this would be hashed
  businessId?: string;
  isProfileComplete: boolean;
  role: 'business' | 'admin';
  theme?: 'light' | 'dark';
}

export interface WaitlistEntry {
  id: string;
  email: string;
  entityType: string;
  phone?: string;
  businessName?: string;
  code?: string;
  status: 'pending' | 'approved' | 'used';
  createdAt: string;
}

export interface Inquiry {
  id: string;
  businessId: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  message: string;
  date: string; // ISO String
  isRead: boolean;
  senderBusinessId?: string; // Optional ID if sent by a registered business
}
