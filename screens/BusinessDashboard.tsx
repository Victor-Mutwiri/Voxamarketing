



import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Phone, 
  MessageSquare, 
  MousePointerClick
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import Button from '../components/Button';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentInquiries from '../components/dashboard/RecentInquiries';
import AccountStatus from '../components/dashboard/AccountStatus';
import MetricsFilter from '../components/dashboard/MetricsFilter';
import { storage } from '../utils/storage';
import { Business, User as UserType, Inquiry, AnalyticsEvent } from '../types';

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [businessData, setBusinessData] = useState<Business | undefined>(undefined);
  const [allInquiries, setAllInquiries] = useState<Inquiry[]>([]);
  const [allAnalytics, setAllAnalytics] = useState<AnalyticsEvent[]>([]);
  
  // Date Filtering State
  const [dateRange, setDateRange] = useState<{ start: Date, end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(user);
    if (user.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    if (user.businessId) {
      const biz = storage.getBusinessById(user.businessId);
      setBusinessData(biz);
      
      const inqs = storage.getInquiriesByBusiness(user.businessId);
      setAllInquiries(inqs);

      const events = storage.getAnalyticsEvents(user.businessId);
      setAllAnalytics(events);
    }
  }, [navigate]);

  // Handle Filter Change
  const handleFilterChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  // Filter Logic
  const filteredStats = useMemo(() => {
    const startMs = dateRange.start.getTime();
    const endMs = dateRange.end.getTime();

    // Filter Inquiries
    const filteredInquiries = allInquiries.filter(i => {
        const time = new Date(i.date).getTime();
        return time >= startMs && time <= endMs;
    });

    // Filter Analytics
    const filteredAnalytics = allAnalytics.filter(e => {
        const time = new Date(e.timestamp).getTime();
        return time >= startMs && time <= endMs;
    });

    const views = filteredAnalytics.filter(e => e.type === 'view').length;
    const reveals = filteredAnalytics.filter(e => e.type === 'contact_reveal').length;
    const clicks = filteredAnalytics.filter(e => e.type === 'website_click').length;

    return {
        inquiries: filteredInquiries,
        views,
        reveals,
        clicks
    };
  }, [dateRange, allInquiries, allAnalytics]);

  const unreadInquiries = allInquiries.filter(i => !i.isRead).length; // Unread count always shows total current action items, not filtered

  const stats = [
    { label: 'Profile Views', value: filteredStats.views.toLocaleString(), change: '', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Contact Reveals', value: filteredStats.reveals.toLocaleString(), change: '', icon: Phone, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Inquiries', value: filteredStats.inquiries.length.toString(), change: '', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Website Clicks', value: filteredStats.clicks.toLocaleString(), change: '', icon: MousePointerClick, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-grow md:ml-64 min-h-screen">
        <div className="p-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
              <p className="text-slate-500 dark:text-slate-400">Welcome back, {businessData?.name || currentUser?.email}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-end">
                {businessData && (
                    <MetricsFilter 
                        joinedAt={businessData.joinedAt} 
                        onFilterChange={handleFilterChange} 
                    />
                )}
                <Button 
                variant="outline" 
                size="sm" 
                onClick={() => businessData && navigate(`/explore?preview=${businessData.id}`)}
                disabled={!businessData}
                className="h-[38px]"
                >
                View Public Profile
                </Button>
            </div>
          </header>

          <DashboardStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RecentInquiries 
              inquiries={allInquiries} // Recent inquiries should probably show actual recent ones regardless of filter, or we can use filteredInquiries if we want "Inquiries during this period"
              unreadInquiries={unreadInquiries}
              onViewAll={() => navigate('/business/inquiries')}
            />
            <AccountStatus business={businessData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;