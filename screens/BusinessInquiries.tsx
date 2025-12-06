
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Mail, 
  Phone, 
  User, 
  Clock, 
  Reply,
  CheckCircle,
  Inbox
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import Button from '../components/Button';
import { storage } from '../utils/storage';
import { Business, User as UserType, Inquiry } from '../types';

const BusinessInquiries: React.FC = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    // Set theme
    if (user.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    if (user.businessId) {
      const data = storage.getInquiriesByBusiness(user.businessId);
      setInquiries(data);
      if (data.length > 0 && window.innerWidth >= 768) {
        // Auto-select first if desktop
        // setSelectedInquiry(data[0]); 
        // Better not to auto-read.
      }
    }
  }, [navigate]);

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.isRead) {
      storage.markInquiryAsRead(inquiry.id);
      // Update local state
      setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, isRead: true } : i));
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesFilter = filter === 'all' || (filter === 'unread' && !inq.isRead);
    const matchesSearch = inq.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inq.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-grow md:ml-64 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 px-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Inquiries</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage leads and client messages.</p>
          </div>
          <div className="flex gap-2">
            <Button 
                variant={filter === 'all' ? 'primary' : 'ghost'} 
                size="sm"
                onClick={() => setFilter('all')}
            >
                All
            </Button>
            <Button 
                variant={filter === 'unread' ? 'primary' : 'ghost'} 
                size="sm"
                onClick={() => setFilter('unread')}
            >
                Unread
            </Button>
          </div>
        </div>

        {/* Content - Master/Detail Layout */}
        <div className="flex-grow flex overflow-hidden">
          
          {/* List View */}
          <div className={`w-full md:w-1/3 lg:w-96 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col ${selectedInquiry ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                 <input 
                   type="text" 
                   placeholder="Search inbox..."
                   className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-voxa-gold outline-none text-sm dark:text-white"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              {filteredInquiries.length === 0 ? (
                <div className="text-center py-10 px-4 text-slate-400">
                    <Inbox className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No messages found.</p>
                </div>
              ) : (
                  filteredInquiries.map((inq) => (
                    <div 
                        key={inq.id}
                        onClick={() => handleSelectInquiry(inq)}
                        className={`p-4 border-b border-slate-50 dark:border-slate-700 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                            selectedInquiry?.id === inq.id ? 'bg-blue-50 dark:bg-slate-700 border-l-4 border-l-voxa-gold' : ''
                        } ${!inq.isRead ? 'bg-slate-50/50 dark:bg-slate-800' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-sm ${!inq.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                {inq.visitorName}
                            </span>
                            <span className="text-xs text-slate-400">
                                {new Date(inq.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                            </span>
                        </div>
                        <p className={`text-xs line-clamp-2 ${!inq.isRead ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                            {inq.message}
                        </p>
                        {!inq.isRead && (
                             <span className="inline-block mt-2 w-2 h-2 rounded-full bg-red-500"></span>
                        )}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Detail View */}
          <div className={`w-full md:flex-grow bg-slate-50 dark:bg-slate-900 flex flex-col ${selectedInquiry ? 'flex' : 'hidden md:flex'}`}>
            {selectedInquiry ? (
                <div className="h-full flex flex-col">
                    {/* Toolbar */}
                    <div className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center md:justify-end">
                        <button 
                           className="md:hidden text-slate-500 flex items-center gap-1 text-sm"
                           onClick={() => setSelectedInquiry(null)}
                        >
                             ← Back
                        </button>
                        <div className="flex gap-2">
                            <a href={`tel:${selectedInquiry.visitorPhone}`}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Phone className="w-4 h-4" /> Call
                                </Button>
                            </a>
                            <a href={`mailto:${selectedInquiry.visitorEmail}?subject=Re: Inquiry via Voxa Marketing`}>
                                <Button size="sm" className="gap-2">
                                    <Reply className="w-4 h-4" /> Reply
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Message Body */}
                    <div className="p-8 overflow-y-auto flex-grow">
                        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-slate-100 dark:border-slate-700">
                            
                            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
                                <div className="w-12 h-12 rounded-full bg-voxa-navy text-white flex items-center justify-center text-lg font-bold">
                                    {selectedInquiry.visitorName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedInquiry.visitorName}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedInquiry.visitorEmail}</span>
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedInquiry.visitorPhone}</span>
                                    </div>
                                </div>
                                <div className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(selectedInquiry.date).toLocaleString()}
                                </div>
                            </div>

                            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
                                <p className="whitespace-pre-wrap leading-relaxed">{selectedInquiry.message}</p>
                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-400 flex-col">
                    <Mail className="w-16 h-16 mb-4 opacity-10" />
                    <p>Select a message to view details</p>
                </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default BusinessInquiries;
