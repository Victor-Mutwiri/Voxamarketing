




import { Business, User, WaitlistEntry, OperatingHours, WeekDay, Inquiry, AnalyticsEvent, MetricType } from '../types';

const STORAGE_KEYS = {
  USERS: 'voxa_users',
  BUSINESSES: 'voxa_businesses',
  WAITLIST: 'voxa_waitlist',
  SESSION: 'voxa_session',
  INQUIRIES: 'voxa_inquiries',
  ANALYTICS: 'voxa_analytics'
};

const DEFAULT_HOURS: OperatingHours = {
  Monday: { isOpen: true, open: '08:00', close: '17:00' },
  Tuesday: { isOpen: true, open: '08:00', close: '17:00' },
  Wednesday: { isOpen: true, open: '08:00', close: '17:00' },
  Thursday: { isOpen: true, open: '08:00', close: '17:00' },
  Friday: { isOpen: true, open: '08:00', close: '17:00' },
  Saturday: { isOpen: false, open: '09:00', close: '13:00' },
  Sunday: { isOpen: false, open: '09:00', close: '13:00' },
};

// Initial Seed Data for Waitlist
const INITIAL_WAITLIST: WaitlistEntry[] = [
  { 
    id: 'wl_1', 
    email: 'invite@partners.com', 
    entityType: 'Business', 
    code: 'VOXA-2024', 
    status: 'approved', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'wl_2', 
    email: 'pending@startup.com', 
    entityType: 'Company', 
    status: 'pending', 
    createdAt: new Date(Date.now() - 86400000).toISOString() 
  }
];

// Initial Seed Data for Businesses
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
    isVisible: true,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year ago
    accountStatus: 'active',
    metrics: { views: 1245, contactReveals: 382, websiteClicks: 156 },
    specialties: ["Mergers & Acquisitions", "Dispute Resolution", "Intellectual Property"],
    operatingHours: DEFAULT_HOURS,
    entityType: 'Company'
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
    isVisible: true,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
    accountStatus: 'active',
    metrics: { views: 950, contactReveals: 210, websiteClicks: 84 },
    specialties: ["Structural Audit", "Road Construction", "Water Systems"],
    operatingHours: DEFAULT_HOURS,
    entityType: 'Company'
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
    isVisible: true,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 400).toISOString(),
    accountStatus: 'active',
    metrics: { views: 2100, contactReveals: 640, websiteClicks: 420 },
    specialties: ["Cardiac Care", "Advanced Imaging", "Executive Checkups"],
    operatingHours: DEFAULT_HOURS,
    entityType: 'Organization'
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
    isVisible: true,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    accountStatus: 'active',
    metrics: { views: 560, contactReveals: 120, websiteClicks: 45 },
    specialties: ["Eco-friendly Design", "High-rise Developments", "Interior Architecture"],
    operatingHours: DEFAULT_HOURS,
    entityType: 'Business'
  },
  {
    id: 5,
    name: "Dr. James Kamau",
    industry: "Medicine & Health",
    location: "Parklands, Nairobi",
    rating: 4.9,
    reviews: 45,
    tags: ["Pediatrics", "Consultant"],
    image: "https://picsum.photos/400/300?random=14",
    fullDescription: "Dedicated pediatric consultant with 15 years experience in child healthcare. Specializing in early childhood development and pediatric neurology.",
    phone: "+254 722 999 888",
    email: "jkamau@health.com",
    website: "www.drjameskamau.com",
    isVerified: true,
    isVisible: true,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    accountStatus: 'active',
    metrics: { views: 320, contactReveals: 85, websiteClicks: 30 },
    specialties: ["Pediatrics", "Child Neurology"],
    operatingHours: DEFAULT_HOURS,
    entityType: 'Consultant'
  }
];

// Initial Seed Inquiries
const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_1',
    businessId: 1,
    visitorName: 'Alice Wambui',
    visitorEmail: 'alice@example.com',
    visitorPhone: '0711000111',
    message: 'Hi, I would like to inquire about your corporate legal packages for startups.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false
  },
  {
    id: 'inq_2',
    businessId: 1,
    visitorName: 'John Otieno',
    visitorEmail: 'john@example.com',
    visitorPhone: '0722000222',
    message: 'Do you handle property dispute cases within Nairobi?',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true
  }
];

// Helper to generate random past date for mock analytics
const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

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
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
    }

    // Backfill Analytics Events based on Business Metrics totals
    if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
        const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
        const events: AnalyticsEvent[] = [];
        const now = new Date();
        
        businesses.forEach(biz => {
            const joined = new Date(biz.joinedAt);
            
            // Generate View Events
            for (let i = 0; i < (biz.metrics?.views || 0); i++) {
                events.push({
                    id: `evt_${Date.now()}_${Math.random()}`,
                    businessId: biz.id,
                    type: 'view',
                    timestamp: getRandomDate(joined, now)
                });
            }
            // Generate Reveal Events
            for (let i = 0; i < (biz.metrics?.contactReveals || 0); i++) {
                events.push({
                    id: `evt_${Date.now()}_${Math.random()}`,
                    businessId: biz.id,
                    type: 'contact_reveal',
                    timestamp: getRandomDate(joined, now)
                });
            }
             // Generate Click Events
             for (let i = 0; i < (biz.metrics?.websiteClicks || 0); i++) {
                events.push({
                    id: `evt_${Date.now()}_${Math.random()}`,
                    businessId: biz.id,
                    type: 'website_click',
                    timestamp: getRandomDate(joined, now)
                });
            }
        });
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(events));
    }
  },

  // --- Waitlist & Admin Methods ---
  
  addToWaitlist: (email: string, entityType: string) => {
    const list: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
    // Check if already exists
    if (list.find(e => e.email.toLowerCase() === email.toLowerCase())) {
        return false;
    }
    const newEntry: WaitlistEntry = {
        id: 'wl_' + Date.now(),
        email,
        entityType,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    list.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(list));
    return true;
  },

  getWaitlist: (): WaitlistEntry[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
  },

  approveWaitlistEntry: (id: string): string | null => {
    const list: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
    const index = list.findIndex(e => e.id === id);
    if (index !== -1 && list[index].status === 'pending') {
        // Generate Code: VOXA-XXXX
        const code = 'VOXA-' + Math.floor(1000 + Math.random() * 9000).toString();
        list[index].status = 'approved';
        list[index].code = code;
        localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(list));
        return code;
    }
    return null;
  },

  deleteWaitlistEntry: (id: string) => {
    let list: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
    list = list.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(list));
  },

  // Auth: Verify Waitlist Code
  verifyInvite: (email: string, code: string): boolean => {
    const list: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
    // Valid if status is approved and email/code matches
    const entry = list.find(e => e.email.toLowerCase() === email.toLowerCase() && e.code === code && e.status === 'approved');
    return !!entry;
  },

  // Auth: Register User
  register: (email: string, password: string, code: string): User | null => {
    const list: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAITLIST) || '[]');
    const entryIndex = list.findIndex(e => e.email.toLowerCase() === email.toLowerCase() && e.code === code && e.status === 'approved');

    if (entryIndex === -1) return null; // Invalid or already used

    // Mark code as used
    list[entryIndex].status = 'used';
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(list));

    // Create User
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password, // In real app, hash this
      isProfileComplete: false,
      role: 'business',
      theme: 'light'
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

  // Auth: Update User Preferences
  updateUserTheme: (userId: string, theme: 'light' | 'dark') => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].theme = theme;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Also update current session class immediately
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  deleteAccount: (userId: string) => {
    // 1. Get User
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.id === userId);
    
    if (user) {
      // 2. Remove Business if exists
      if (user.businessId) {
        const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
        const updatedBusinesses = businesses.filter(b => b.id !== user.businessId);
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(updatedBusinesses));
        
        // Remove inquiries
        const inquiries: Inquiry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
        const updatedInquiries = inquiries.filter(i => i.businessId !== user.businessId);
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updatedInquiries));
      }

      // 3. Remove User
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      // 4. Clear Session
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },

  // Business: Create Profile
  saveBusinessProfile: (userId: string, data: Partial<Business>) => {
    const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
    const newBusiness: Business = {
      id: Date.now(),
      rating: 5.0,
      reviews: 0,
      isVerified: false,
      isVisible: true,
      joinedAt: new Date().toISOString(),
      accountStatus: 'active',
      operatingHours: DEFAULT_HOURS,
      metrics: { views: 0, contactReveals: 0, websiteClicks: 0 },
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

  // Admin: Update Business Status
  updateBusinessStatus: (businessId: number, status: 'active' | 'suspended' | 'banned') => {
    const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
    const index = businesses.findIndex(b => b.id === businessId);
    if (index !== -1) {
      businesses[index].accountStatus = status;
      // If suspended or banned, hide visibility automatically
      if (status !== 'active') {
        businesses[index].isVisible = false;
      } else {
        businesses[index].isVisible = true;
      }
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
      return businesses[index];
    }
    return null;
  },

  // Analytics: Increment Metric & Log Event
  incrementBusinessMetric: (businessId: number, metric: 'views' | 'contactReveals' | 'websiteClicks') => {
    // 1. Update Totals on Business Object (for fast list views)
    const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
    const index = businesses.findIndex(b => b.id === businessId);
    if (index !== -1) {
      if (!businesses[index].metrics) {
        businesses[index].metrics = { views: 0, contactReveals: 0, websiteClicks: 0 };
      }
      const currentVal = businesses[index].metrics![metric] || 0;
      businesses[index].metrics![metric] = currentVal + 1;
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
    }

    // 2. Log Granular Event (for time-based filtering)
    const analytics: AnalyticsEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '[]');
    
    let eventType: MetricType = 'view';
    if (metric === 'contactReveals') eventType = 'contact_reveal';
    if (metric === 'websiteClicks') eventType = 'website_click';

    const newEvent: AnalyticsEvent = {
        id: `evt_${Date.now()}_${Math.random()}`,
        businessId,
        type: eventType,
        timestamp: new Date().toISOString()
    };
    analytics.push(newEvent);
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  },

  // Analytics: Get Events for Business
  getAnalyticsEvents: (businessId: number): AnalyticsEvent[] => {
    const analytics: AnalyticsEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '[]');
    return analytics.filter(e => e.businessId === businessId);
  },

  // Data: Get All Businesses
  getBusinesses: (): Business[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
  },

  // Data: Get Business by ID
  getBusinessById: (id: number): Business | undefined => {
    const businesses: Business[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
    return businesses.find(b => b.id === id);
  },

  // --- Inquiry Methods ---

  saveInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'isRead'>) => {
    const inquiries: Inquiry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
    const newInquiry: Inquiry = {
        ...inquiry,
        id: 'inq_' + Date.now(),
        date: new Date().toISOString(),
        isRead: false
    };
    inquiries.push(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    return newInquiry;
  },

  getInquiriesByBusiness: (businessId: number): Inquiry[] => {
    const inquiries: Inquiry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
    return inquiries
      .filter(i => i.businessId === businessId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getInquiriesSentByBusiness: (senderBusinessId: number): Inquiry[] => {
    const inquiries: Inquiry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
    return inquiries
      .filter(i => i.senderBusinessId === senderBusinessId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  markInquiryAsRead: (inquiryId: string) => {
    const inquiries: Inquiry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
    const index = inquiries.findIndex(i => i.id === inquiryId);
    if (index !== -1) {
      inquiries[index].isRead = true;
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    }
  },

  getUnreadInquiryCount: (businessId: number): number => {
    const inquiries: Inquiry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
    return inquiries.filter(i => i.businessId === businessId && !i.isRead).length;
  }
};