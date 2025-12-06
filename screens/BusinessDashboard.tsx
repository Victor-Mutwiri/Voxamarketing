
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Phone, 
  MessageSquare, 
  MousePointerClick, 
  ArrowUpRight,
  CheckCircle,
  EyeOff
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import Button from '../components/Button';
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change} <ArrowUpRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Inquiries */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Inquiries</h3>
                    {unreadInquiries > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{unreadInquiries} New</span>
                    )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/business/inquiries')} className="text-voxa-gold">View All</Button>
              </div>
              
              <div className="space-y-4">
                {inquiries.length > 0 ? (
                    inquiries.slice(0, 3).map((inquiry) => (
                    <div 
                        key={inquiry.id} 
                        className={`flex gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer border ${!inquiry.isRead ? 'bg-slate-50 dark:bg-slate-700/50 border-voxa-gold/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
                        onClick={() => navigate('/business/inquiries')}
                    >
                        <div className="w-10 h-10 rounded-full bg-voxa-navy/10 flex items-center justify-center text-voxa-navy font-bold flex-shrink-0">
                        {inquiry.visitorName.charAt(0)}
                        </div>
                        <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-slate-900 dark:text-white">{inquiry.visitorName}</span>
                            <span className="text-xs text-slate-400">{new Date(inquiry.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">{inquiry.message}</p>
                        </div>
                        {!inquiry.isRead && (
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                        )}
                    </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p>No inquiries yet.</p>
                    </div>
                )}
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Status</h3>
              
              {businessData?.isVisible ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                    <CheckCircle className="w-5 h-5" /> Active & Visible
                  </div>
                  <p className="text-xs text-green-600">Your profile is currently visible to clients.</p>
                </div>
              ) : (
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700 font-bold mb-1">
                    <EyeOff className="w-5 h-5" /> Hidden
                  </div>
                  <p className="text-xs text-gray-600">Your profile is hidden from the directory.</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Membership Tier</span>
                  <span className="text-sm font-bold text-voxa-gold">Premium Trial</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Verification</span>
                  <span className="text-sm font-bold text-green-600">Verified</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Profile Completion</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">100%</span>
                </div>
              </div>

              <Button className="w-full mt-6" variant="outline">Manage Subscription</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;
