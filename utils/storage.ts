




import { Business, User, WaitlistEntry, Inquiry, AnalyticsEvent, MetricType, EntityType } from '../types';
import { supabase } from './supabase';

export const storage = {
  // Initialize storage (no-op for Supabase, but kept for compatibility)
  init: async () => {
    console.log('Supabase storage initialized');
  },

  // --- Waitlist & Admin Methods ---
  
  addToWaitlist: async (email: string, entityType: string, phone: string, businessName: string) => {
    const { error } = await supabase
      .from('invitations')
      .insert([{ 
        email, 
        entity_type: entityType, 
        phone,
        business_name: businessName,
        status: 'pending', 
        code: 'PENDING-' + Math.random().toString(36).substring(7).toUpperCase() 
      }]);
    
    if (error) {
      console.error('Supabase error adding to waitlist:', error);
      throw new Error(error.message);
    }
    return true;
  },

  getWaitlist: async (): Promise<WaitlistEntry[]> => {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error fetching waitlist:', error);
      return [];
    }
    return data.map(item => ({
      id: item.id,
      email: item.email,
      entityType: item.entity_type,
      phone: item.phone,
      businessName: item.business_name,
      code: item.code,
      status: item.status,
      createdAt: item.created_at
    }));
  },

  approveWaitlistEntry: async (id: string): Promise<string | null> => {
    const code = 'VOXA-' + Math.floor(1000 + Math.random() * 9000).toString();
    const { error } = await supabase
      .from('invitations')
      .update({ status: 'approved', code })
      .eq('id', id);
    
    return error ? null : code;
  },

  deleteWaitlistEntry: async (id: string) => {
    await supabase.from('invitations').delete().eq('id', id);
  },

  // Auth: Verify Waitlist Code
  verifyInvite: async (email: string, code: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .eq('status', 'approved')
      .single();
    
    return !!data && !error;
  },

  // Auth: Register User
  register: async (email: string, password: string, code: string): Promise<User | null> => {
    console.log('[DEBUG] register started for:', email, 'code:', code);
    
    // 1. Verify invitation
    const { data: invite, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('code', code.trim())
      .eq('status', 'approved')
      .single();

    if (inviteError || !invite) {
      console.error('[DEBUG] Invite fetch failed:', inviteError || 'Not found');
      return null;
    }

    console.log('[DEBUG] Invite verified, calling signUp');

    // 2. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          invitation_id: invite.id
        }
      }
    });

    if (authError || !authData.user) {
      console.error('[DEBUG] Auth signUp failed:', authError);
      return null;
    }

    console.log('[DEBUG] Auth signUp success, updating invite');

    // 3. Mark invitation as used
    await supabase
      .from('invitations')
      .update({ status: 'used' })
      .eq('id', invite.id);

    // Profile is created by DB trigger
    return {
      id: authData.user.id,
      email: authData.user.email!,
      isProfileComplete: false,
      role: 'business',
      theme: 'light'
    };
  },

  // Auth: Login
  login: async (email: string, password: string): Promise<User | null> => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) return null;

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      businessId: profile.business_id,
      isProfileComplete: profile.is_profile_complete,
      role: profile.role,
      theme: profile.theme
    };
  },

  // Auth: Logout
  logout: async () => {
    await supabase.auth.signOut();
  },

  // Auth: Get Current User
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      businessId: profile.business_id,
      isProfileComplete: profile.is_profile_complete,
      role: profile.role,
      theme: profile.theme
    };
  },

  // Auth: Update User Preferences
  updateUserTheme: async (userId: string, theme: 'light' | 'dark') => {
    await supabase
      .from('profiles')
      .update({ theme })
      .eq('id', userId);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  deleteAccount: async (userId: string) => {
    // This usually requires a service role or edge function to delete auth user
    // For now, we delete the business and profile data
    const user = await storage.getCurrentUser();
    if (user?.businessId) {
      await supabase.from('businesses').delete().eq('id', user.businessId);
    }
    await supabase.from('profiles').delete().eq('id', userId);
    await supabase.auth.signOut();
  },

  // Business: Create Profile
  saveBusinessProfile: async (userId: string, data: Partial<Business>) => {
    // 1. Create Business
    const { data: newBiz, error: bizError } = await supabase
      .from('businesses')
      .insert([{
        name: data.name,
        industry: data.industry,
        location: data.location,
        full_description: data.fullDescription,
        phone: data.phone,
        email: data.email,
        website: data.website,
        image: data.image,
        specialties: data.specialties,
        tags: data.tags,
        entity_type: data.entityType,
        owner_id: userId,
        operating_hours: data.operatingHours,
        is_visible: true,
        account_status: 'active'
      }])
      .select()
      .single();

    if (bizError) throw bizError;

    // 2. Update Profile
    await supabase
      .from('profiles')
      .update({ 
        business_id: newBiz.id,
        is_profile_complete: true 
      })
      .eq('id', userId);
    
    return newBiz;
  },

  // Business: Update Profile
  updateBusinessProfile: async (businessId: string, data: Partial<Business>) => {
    const updates: any = {};
    if (data.name) updates.name = data.name;
    if (data.industry) updates.industry = data.industry;
    if (data.location) updates.location = data.location;
    if (data.fullDescription) updates.full_description = data.fullDescription;
    if (data.phone) updates.phone = data.phone;
    if (data.email) updates.email = data.email;
    if (data.website) updates.website = data.website;
    if (data.image) updates.image = data.image;
    if (data.specialties) {
      updates.specialties = data.specialties;
      updates.tags = data.specialties.slice(0, 3);
    }
    if (data.operatingHours) updates.operating_hours = data.operatingHours;
    if (data.isVisible !== undefined) updates.is_visible = data.isVisible;

    const { data: updated, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', businessId)
      .select()
      .single();
    
    return error ? null : updated;
  },

  // Admin: Get All Businesses (including hidden/suspended)
  getAllBusinesses: async (): Promise<Business[]> => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('joined_at', { ascending: false });
    
    if (error) return [];
    
    // Fetch metrics and inquiry counts for each business
    const businessesWithStats = await Promise.all(data.map(async (b) => {
      const { count: inquiryCount } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', b.id);
      
      // Fetch specific metric counts
      const [views, reveals, clicks] = await Promise.all([
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('business_id', b.id).eq('type', 'view'),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('business_id', b.id).eq('type', 'contact_reveal'),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('business_id', b.id).eq('type', 'website_click')
      ]);

      return {
        id: b.id,
        name: b.name,
        industry: b.industry,
        location: b.location,
        rating: b.rating,
        reviews: b.reviews,
        tags: b.tags,
        image: b.image,
        fullDescription: b.full_description,
        phone: b.phone,
        email: b.email,
        website: b.website,
        isVerified: b.is_verified,
        isVisible: b.is_visible,
        joinedAt: b.joined_at,
        accountStatus: b.account_status,
        specialties: b.specialties,
        operatingHours: b.operating_hours,
        entityType: b.entity_type,
        metrics: {
          views: views.count || 0,
          contactReveals: reveals.count || 0,
          websiteClicks: clicks.count || 0
        },
        inquiryCount: inquiryCount || 0
      } as Business & { inquiryCount: number };
    }));

    return businessesWithStats;
  },

  // Admin: Update Business Status
  updateBusinessStatus: async (businessId: string, status: 'active' | 'suspended' | 'banned') => {
    const { data: updated, error } = await supabase
      .from('businesses')
      .update({ 
        account_status: status,
        is_visible: status === 'active'
      })
      .eq('id', businessId)
      .select()
      .single();
    
    return error ? null : updated;
  },

  // Analytics: Increment Metric & Log Event
  incrementBusinessMetric: async (businessId: string, metric: 'views' | 'contactReveals' | 'websiteClicks') => {
    // 1. Log Event
    let eventType: MetricType = 'view';
    if (metric === 'contactReveals') eventType = 'contact_reveal';
    if (metric === 'websiteClicks') eventType = 'website_click';

    await supabase.from('analytics_events').insert([{
      business_id: businessId,
      type: eventType
    }]);

    // 2. Update Totals (Optional, could be calculated via SQL view)
    // For now we just log the event
  },

  // Analytics: Get Events for Business
  getAnalyticsEvents: async (businessId: string): Promise<AnalyticsEvent[]> => {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('business_id', businessId);
    
    if (error) return [];
    return data.map(e => ({
      id: e.id,
      businessId: e.business_id,
      type: e.type as MetricType,
      timestamp: e.timestamp
    }));
  },

  // Data: Get All Businesses
  getBusinesses: async (): Promise<Business[]> => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('is_visible', true)
      .eq('account_status', 'active');
    
    if (error) return [];
    return data.map(b => ({
      id: b.id,
      name: b.name,
      industry: b.industry,
      location: b.location,
      rating: b.rating,
      reviews: b.reviews,
      tags: b.tags,
      image: b.image,
      fullDescription: b.full_description,
      phone: b.phone,
      email: b.email,
      website: b.website,
      isVerified: b.is_verified,
      isVisible: b.is_visible,
      joinedAt: b.joined_at,
      accountStatus: b.account_status,
      specialties: b.specialties,
      operatingHours: b.operating_hours,
      entityType: b.entity_type
    }));
  },

  // Data: Get Business by ID
  getBusinessById: async (id: string): Promise<Business | undefined> => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return {
      id: data.id,
      name: data.name,
      industry: data.industry,
      location: data.location,
      rating: data.rating,
      reviews: data.reviews,
      tags: data.tags,
      image: data.image,
      fullDescription: data.full_description,
      phone: data.phone,
      email: data.email,
      website: data.website,
      isVerified: data.is_verified,
      isVisible: data.is_visible,
      joinedAt: data.joined_at,
      accountStatus: data.account_status,
      specialties: data.specialties,
      operatingHours: data.operating_hours,
      entityType: data.entity_type
    };
  },

  // --- Inquiry Methods ---

  saveInquiry: async (inquiry: Omit<Inquiry, 'id' | 'date' | 'isRead'>) => {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        business_id: inquiry.businessId,
        visitor_name: inquiry.visitorName,
        visitor_email: inquiry.visitorEmail,
        visitor_phone: inquiry.visitorPhone,
        message: inquiry.message,
        sender_business_id: inquiry.senderBusinessId
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getInquiriesByBusiness: async (businessId: string): Promise<Inquiry[]> => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data.map(i => ({
      id: i.id,
      businessId: i.business_id,
      visitorName: i.visitor_name,
      visitorEmail: i.visitor_email,
      visitorPhone: i.visitor_phone,
      message: i.message,
      date: i.created_at,
      isRead: i.is_read,
      senderBusinessId: i.sender_business_id
    }));
  },

  getInquiriesSentByBusiness: async (senderBusinessId: string): Promise<Inquiry[]> => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('sender_business_id', senderBusinessId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data.map(i => ({
      id: i.id,
      businessId: i.business_id,
      visitorName: i.visitor_name,
      visitorEmail: i.visitor_email,
      visitorPhone: i.visitor_phone,
      message: i.message,
      date: i.created_at,
      isRead: i.is_read,
      senderBusinessId: i.sender_business_id
    }));
  },

  markInquiryAsRead: async (inquiryId: string) => {
    await supabase
      .from('inquiries')
      .update({ is_read: true })
      .eq('id', inquiryId);
  },

  getUnreadInquiryCount: async (businessId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('is_read', false);
    
    return error ? 0 : (count || 0);
  }
};
