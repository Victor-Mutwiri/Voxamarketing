import { Business, User, WaitlistEntry } from '../types';

const STORAGE_KEYS = {
  USERS: 'voxa_users',
  BUSINESSES: 'voxa_businesses',
  WAITLIST: 'voxa_waitlist',
  SESSION: 'voxa_session'
};

// Initial Seed Data for Waitlist
const INITIAL_WAITLIST: WaitlistEntry[] = [
  { email: 'invite@partners.com', code: 'VOXA-2024', isUsed: false },
  { email: 'test@company.com', code: 'TEST-CODE', isUsed: false }
];

// Initial Seed Data for Businesses (Moving mock data here for persistence)
const INITIAL_BUSINESSES: Business[] = [
  {
    id: 1,
    name: "Nairobi Legal Partners",
    industry: "Legal Services",
    location: "Upper Hill, Nairobi",
    rating: 4.9,
    reviews: 124,
    tags: ["Corporate Law", "Litigation", "Commercial"],
    image: "https://picsum.photos/400/300?random=10",
    fullDescription: "Nairobi Legal Partners is a premier law firm specializing in corporate and commercial law. With over 20 years of experience, we have successfully represented multinational corporations and local enterprises in complex litigation and arbitration matters.",
    phone: "+254 722 123 456",
    email: "info@nairobilegal.co.ke",
    website: "www.nairobilegal.co.ke",
    isVerified: true,
    specialties: ["Mergers & Acquisitions", "Dispute Resolution", "Intellectual Property"]
  },
  {
    id: 2,
    name: "Apex Engineering Solutions",
    industry: "Engineering",
    location: "Industrial Area, Nairobi",
    rating: 4.8,
    reviews: 89,
    tags: ["Structural", "Civil", "Infrastructure"],
    image: "https://picsum.photos/400/300?random=11",
    fullDescription: "Apex Engineering delivers world-class structural and civil engineering solutions. We pride ourselves on innovation, sustainability, and timely delivery of large-scale infrastructure projects across East Africa.",
    phone: "+254 733 987 654",
    email: "projects@apexengineering.com",
    website: "www.apexengineering.com",
    isVerified: true,
    specialties: ["Structural Audit", "Road Construction", "Water Systems"]
  },
  {
    id: 3,
    name: "MediCare Specialists",
    industry: "Medicine & Health",
    location: "Westlands, Nairobi",
    rating: 5.0,
    reviews: 210,
    tags: ["Cardiology", "Diagnostics", "Wellness"],
    image: "https://picsum.photos/400/300?random=12",
    fullDescription: "A state-of-the-art medical facility offering specialized care in cardiology and advanced diagnostics. Our team comprises internationally trained consultants dedicated to patient-centric care.",
    phone: "+254 711 555 555",
    email: "appointments@medicare.co.ke",
    website: "www.medicare.co.ke",
    isVerified: true,
    specialties: ["Cardiac Care", "Advanced Imaging", "Executive Checkups"]
  },
  {
    id: 4,
    name: "BuildRight Architects",
    industry: "Architecture",
    location: "Kilimani, Nairobi",
    rating: 4.7,
    reviews: 56,
    tags: ["Residential", "Commercial", "Interior"],
    image: "https://picsum.photos/400/300?random=13",
    fullDescription: "BuildRight Architects combines aesthetic beauty with functional design. We create sustainable living and working spaces that inspire. Award winners for the 2023 Green Building Design.",
    phone: "+254 700 444 333",
    email: "design@buildright.com",
    website: "www.buildright.com",
    isVerified: true,
    specialties: ["Eco-friendly Design", "High-rise Developments", "Interior Architecture"]
  }
];

export const storage = {
  // Initialize storage with seed data if empty
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.WAITLIST)) {
      localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(INITIAL_WAITLIST));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUSINESSES)) {
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
  },

  // Auth: Verify Waitlist Code
  verifyInvite: (email: string, code: string): boolean => {
    const list: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
    const entry = list.find(e => e.email.toLowerCase() === email.toLowerCase() && e.code === code && !e.isUsed);
    return !!entry;
  },

  // Auth: Register User
  register: (email: string, password: string, code: string): User | null => {
    const list: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
    const entryIndex = list.findIndex(e => e.email.toLowerCase() === email.toLowerCase() && e.code === code && !e.isUsed);

    if (entryIndex === -1) return null; // Invalid or used code

    // Mark code as used
    list[entryIndex].isUsed = true;
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(list));

    // Create User
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password, // In real app, hash this
      isProfileComplete: false,
      role: 'business'
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Set Session
    localStorage.setItem(STORAGE_KEYS.SESSION, newUser.id);
    return newUser;
  },

  // Auth: Login
  login: (email: string, password: string): User | null => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, user.id);
      return user;
    }
    return null;
  },

  // Auth: Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  // Auth: Get Current User
  getCurrentUser: (): User | null => {
    const userId = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!userId) return null;
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find(u => u.id === userId) || null;
  },

  // Business: Create Profile
  saveBusinessProfile: (userId: string, data: Partial<Business>) => {
    const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
    const newBusiness: Business = {
      id: Date.now(),
      rating: 5.0,
      reviews: 0,
      isVerified: false,
      tags: [],
      ...data
    } as Business;
    
    businesses.push(newBusiness);
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));

    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].businessId = newBusiness.id;
      users[userIndex].isProfileComplete = true;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    return newBusiness;
  },

  // Business: Update Profile
  updateBusinessProfile: (businessId: number, data: Partial<Business>) => {
    const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
    const index = businesses.findIndex(b => b.id === businessId);
    
    if (index !== -1) {
      // Merge updates
      businesses[index] = { ...businesses[index], ...data };
      
      // Update tags if specialties changed
      if (data.specialties) {
          businesses[index].tags = data.specialties.slice(0, 3);
      }
      
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
      return businesses[index];
    }
    return null;
  },

  // Data: Get All Businesses
  getBusinesses: (): Business[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
  },

  // Data: Get Business by ID
  getBusinessById: (id: number): Business | undefined => {
    const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
    return businesses.find(b => b.id === id);
  }
};