import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Trash2, 
  Moon, 
  Sun, 
  Eye, 
  EyeOff, 
  Clock, 
  ShieldAlert,
  CheckCircle
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import Button from '../components/Button';
import { storage } from '../utils/storage';
import { Business, User as UserType, WeekDay, OperatingHours } from '../types';

const WEEKDAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const BusinessSettings: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [business, setBusiness] = useState<Business | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Local state for editing to avoid immediate saves
  const [hours, setHours] = useState<OperatingHours | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(user);
    setTheme(user.theme || 'light');
    
    // Apply theme on load
    if (user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (user.businessId) {
      const biz = storage.getBusinessById(user.businessId);
      if (biz) {
        setBusiness(biz);
        setIsVisible(biz.isVisible);
        // Initialize hours if missing
        setHours(biz.operatingHours || {
          Monday: { isOpen: true, open: '08:00', close: '17:00' },
          Tuesday: { isOpen: true, open: '08:00', close: '17:00' },
          Wednesday: { isOpen: true, open: '08:00', close: '17:00' },
          Thursday: { isOpen: true, open: '08:00', close: '17:00' },
          Friday: { isOpen: true, open: '08:00', close: '17:00' },
          Saturday: { isOpen: false, open: '09:00', close: '13:00' },
          Sunday: { isOpen: false, open: '09:00', close: '13:00' },
        });
      }
    }
    setIsLoading(false);
  }, [navigate]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (currentUser) {
      storage.updateUserTheme(currentUser.id, newTheme);
    }
  };

  const handleHourChange = (day: WeekDay, field: keyof typeof hours[WeekDay], value: any) => {
    if (!hours) return;
    setHours({
      ...hours,
      [day]: {
        ...hours[day],
        [field]: value
      }
    });
  };

  const saveSettings = () => {
    if (currentUser?.businessId && business) {
      storage.updateBusinessProfile(currentUser.businessId, {
        isVisible: isVisible,
        operatingHours: hours
      });
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteAccount = () => {
    const confirmName = prompt(`To confirm deletion, please type "${business?.name}" below:`);
    if (confirmName === business?.name) {
      if (currentUser) {
        storage.deleteAccount(currentUser.id);
        alert('Your account has been permanently deleted.');
        navigate('/');
      }
    } else if (confirmName !== null) {
      alert('Business name did not match. Deletion cancelled.');
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-grow md:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage your business preferences and account.</p>
          </header>

          {successMessage && (
             <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                {successMessage}
             </div>
          )}

          <div className="space-y-8">
            
            {/* Visibility & Theme */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">General Preferences</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Control how you view the app and how others view you.</p>
              </div>
              
              <div className="p-6 space-y-6">
                
                {/* Profile Visibility */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isVisible ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                      {isVisible ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Public Visibility</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isVisible ? 'Your profile is currently visible to all clients.' : 'Your profile is hidden from the directory.'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={isVisible}
                      onChange={() => setIsVisible(!isVisible)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-voxa-gold"></div>
                  </label>
                </div>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {theme === 'light' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Interface Theme</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode.</p>
                    </div>
                  </div>
                  <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                    <button 
                      onClick={handleThemeToggle}
                      className={`p-2 rounded-md text-sm font-medium transition-all ${theme === 'light' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                      Light
                    </button>
                    <button 
                       onClick={handleThemeToggle}
                       className={`p-2 rounded-md text-sm font-medium transition-all ${theme === 'dark' ? 'bg-slate-700 shadow text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
               <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Operating Hours</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Set your weekly availability for clients.</p>
              </div>

              <div className="p-6">
                {hours && WEEKDAYS.map((day) => (
                  <div key={day} className="flex items-center py-3 border-b border-slate-50 dark:border-slate-700 last:border-0">
                    
                    {/* Day Name & Checkbox */}
                    <div className="w-40 flex items-center gap-3">
                       <input 
                        type="checkbox"
                        checked={hours[day].isOpen}
                        onChange={(e) => handleHourChange(day, 'isOpen', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-voxa-gold focus:ring-voxa-gold"
                       />
                       <span className={`font-medium ${hours[day].isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{day}</span>
                    </div>

                    {/* Time Inputs */}
                    <div className="flex items-center gap-4 flex-grow">
                      {hours[day].isOpen ? (
                        <>
                          <div className="relative">
                            <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="time" 
                              value={hours[day].open}
                              onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                              className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-1 focus:ring-voxa-gold outline-none dark:text-white"
                            />
                          </div>
                          <span className="text-slate-400">-</span>
                          <div className="relative">
                            <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                             <input 
                              type="time" 
                              value={hours[day].close}
                              onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                              className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-1 focus:ring-voxa-gold outline-none dark:text-white"
                            />
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Closed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                 <Button onClick={saveSettings} className="gap-2">
                   <Save className="w-4 h-4" /> Save Preferences
                 </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-red-700 dark:text-red-500 mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-sm text-red-600/80 dark:text-red-400 mb-6">
                  Deleting your account is permanent. This will wipe your business profile, analytics, and settings immediately.
                </p>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/40"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessSettings;