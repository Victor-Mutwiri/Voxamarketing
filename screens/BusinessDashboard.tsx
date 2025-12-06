import React, { useEffect, useState } from 'react';
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
import { storage } from '../utils/storage';
import { Business, User as UserType, Inquiry } from '../types';

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [businessData, setBusinessData] = useState<Business | undefined>(undefined);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(user);
    // Sync theme
    if (user.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    if (user.businessId) {
      const biz = storage.getBusinessById(user.businessId);
      setBusinessData(biz);
      
      const inqs = storage.getInquiriesByBusiness(user.businessId);
      setInquiries(inqs);
    }
  }, [navigate]);

  // Derived Stats
  const totalInquiries = inquiries.length;
  const unreadInquiries = inquiries.filter(i => !i.isRead).length;

  const stats = [
    { label: 'Total Profile Views', value: '1,245', change: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Contact Reveals', value: '382', change: '+5%', icon: Phone, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Inquiries Received', value: totalInquiries.toString(), change: '+18%', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Website Clicks', value: '156', change: '+8%', icon: MousePointerClick, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-grow md:ml-64 min-h-screen">
        <div className="p-8">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
              <p className="text-slate-500 dark:text-slate-400">Welcome back, {businessData?.name || currentUser?.email}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => businessData && navigate(`/explore?preview=${businessData.id}`)}
              disabled={!businessData}
            >
              View Public Profile
            </Button>
          </header>

          <DashboardStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RecentInquiries 
              inquiries={inquiries}
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