import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  User,
  ArrowLeft
} from 'lucide-react';
import { storage } from '../utils/storage';
import Button from './Button';

const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    storage.logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Overview', path: '/business/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', path: '/business/analytics', icon: BarChart3 }, // Placeholder path
    { label: 'Inquiries', path: '/business/inquiries', icon: MessageSquare, badge: 3 }, // Placeholder path
    { label: 'My Profile', path: '/business/profile', icon: User },
    { label: 'Settings', path: '/business/settings', icon: Settings }, // Placeholder path
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-voxa-navy text-white hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 cursor-pointer" onClick={() => navigate('/')}>
          <h1 className="text-2xl font-serif font-bold">Voxa<span className="text-voxa-gold">.</span></h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Business Portal</p>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-voxa-gold' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden bg-voxa-navy text-white p-4 flex justify-between items-center sticky top-0 z-50 w-full">
        <span className="font-serif font-bold text-xl">Voxa.</span>
        <div className="flex gap-2">
            <Button variant="ghost" className="text-white p-2" onClick={() => navigate('/business/dashboard')}>
                <LayoutDashboard className="w-5 h-5" />
            </Button>
             <Button variant="ghost" className="text-white p-2" onClick={() => navigate('/business/profile')}>
                <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="text-white p-2" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
            </Button>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;