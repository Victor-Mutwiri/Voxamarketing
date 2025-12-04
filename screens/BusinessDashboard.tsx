import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Phone, 
  MessageSquare, 
  MousePointerClick, 
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import Button from '../components/Button';
import { storage } from '../utils/storage';
import { Business, User as UserType } from '../types';

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [businessData, setBusinessData] = useState<Business | undefined>(undefined);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(user);
    if (user.businessId) {
      const biz = storage.getBusinessById(user.businessId);
      setBusinessData(biz);
    }
  }, [navigate]);

  // Mock Data
  const stats = [
    { label: 'Total Profile Views', value: '1,245', change: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Contact Reveals', value: '382', change: '+5%', icon: Phone, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Inquiries Received', value: '47', change: '+18%', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Website Clicks', value: '156', change: '+8%', icon: MousePointerClick, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const recentInquiries = [
    { id: 1, name: 'Alice Wambui', date: '2 hours ago', message: 'Hi, I would like to inquire about your corporate legal packages...', status: 'New' },
    { id: 2, name: 'John Otieno', date: '5 hours ago', message: 'Do you handle property dispute cases within Nairobi?', status: 'Read' },
    { id: 3, name: 'Sarah Jones', date: '1 day ago', message: 'We are looking for a retainer agreement for our startup.', status: 'Replied' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-grow md:ml-64 min-h-screen">
        <div className="p-8">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
              <p className="text-slate-500">Welcome back, {businessData?.name || currentUser?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/explore')}>
              View Public Profile
            </Button>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change} <ArrowUpRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Inquiries */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent Inquiries</h3>
                <a href="#" className="text-sm text-voxa-gold font-medium hover:underline">View All</a>
              </div>
              
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-voxa-navy/10 flex items-center justify-center text-voxa-navy font-bold flex-shrink-0">
                      {inquiry.name.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-slate-900">{inquiry.name}</span>
                        <span className="text-xs text-slate-400">{inquiry.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1">{inquiry.message}</p>
                    </div>
                    {inquiry.status === 'New' && (
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Account Status</h3>
              
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                  <CheckCircle className="w-5 h-5" /> Active & Visible
                </div>
                <p className="text-xs text-green-600">Your profile is currently visible to clients.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Membership Tier</span>
                  <span className="text-sm font-bold text-voxa-gold">Premium Trial</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Verification</span>
                  <span className="text-sm font-bold text-green-600">Verified</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Profile Completion</span>
                  <span className="text-sm font-bold text-slate-900">100%</span>
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