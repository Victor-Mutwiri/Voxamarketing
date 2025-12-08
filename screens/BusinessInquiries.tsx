

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
  Inbox,
  Building2,
  ExternalLink,
  Send,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import Button from '../components/Button';
import { storage } from '../utils/storage';
import { Business, User as UserType, Inquiry } from '../types';

type Tab = 'inbox' | 'sent';

const BusinessInquiries: React.FC = () => {
  const navigate = useNavigate();
  const [inboxInquiries, setInboxInquiries] = useState<Inquiry[]>([]);
  const [sentInquiries, setSentInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('inbox');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cache names for Sent View (To: [BusinessName])
  const [businessNames, setBusinessNames] = useState<Record<number, string>>({});

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
      // 1. Fetch Inbox
      const inbox = storage.getInquiriesByBusiness(user.businessId);
      setInboxInquiries(inbox);

      // 2. Fetch Sent
      const sent = storage.getInquiriesSentByBusiness(user.businessId);
      setSentInquiries(sent);
      
      // 3. Resolve Business Names for Sent items
      // We need to know who we sent messages to.
      // The `businessId` in the inquiry object is the RECIPIENT.
      const recipientIds = Array.from(new Set(sent.map(i => i.businessId)));
      const nameMap: Record<number, string> = {};
      
      // We can iterate recipientIds and get names. 
      // Optimization: Get all businesses once or get individually. Since mock data is sync:
      recipientIds.forEach(id => {
          const biz = storage.getBusinessById(id);
          if (biz) nameMap[id] = biz.name;
      });
      setBusinessNames(nameMap);
    }
  }, [navigate]);

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    
    // Only mark as read if it is an INBOX item
    if (activeTab === 'inbox' && !inquiry.isRead) {
      storage.markInquiryAsRead(inquiry.id);
      // Update local state
      setInboxInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, isRead: true } : i));
    }
  };

  const currentList = activeTab === 'inbox' ? inboxInquiries : sentInquiries;

  const filteredInquiries = currentList.filter(inq => {
    // Filter by Read/Unread only applies meaningfully to Inbox usually, 
    // but we can support it for both.
    const matchesFilter = filter === 'all' || (filter === 'unread' && !inq.isRead);
    
    // Search text matches Name OR Message
    // For Inbox: visitorName (Sender)
    // For Sent: businessNames[businessId] (Recipient)
    const nameToMatch = activeTab === 'inbox' 
        ? inq.visitorName 
        : (businessNames[inq.businessId] || 'Unknown Business');

    const matchesSearch = nameToMatch.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inq.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-grow md:ml-64 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 px-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage your business communications.</p>
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
             <button 
                onClick={() => { setActiveTab('inbox'); setSelectedInquiry(null); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'inbox' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
             >
                <Inbox className="w-4 h-4" /> Inbox 
                {inboxInquiries.filter(i => !i.isRead).length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{inboxInquiries.filter(i => !i.isRead).length}</span>
                )}
             </button>
             <button 
                onClick={() => { setActiveTab('sent'); setSelectedInquiry(null); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'sent' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
             >
                <Send className="w-4 h-4" /> Sent
             </button>
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
                   placeholder={activeTab === 'inbox' ? "Search sender..." : "Search recipient..."}
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
                  filteredInquiries.map((inq) => {
                    // Logic to display Name depending on tab
                    const displayName = activeTab === 'inbox' 
                        ? inq.visitorName 
                        : (businessNames[inq.businessId] || "Unknown Recipient");

                    const isUnread = !inq.isRead;
                    
                    return (
                        <div 
                            key={inq.id}
                            onClick={() => handleSelectInquiry(inq)}
                            className={`p-4 border-b border-slate-50 dark:border-slate-700 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                                selectedInquiry?.id === inq.id ? 'bg-blue-50 dark:bg-slate-700 border-l-4 border-l-voxa-gold' : ''
                            } ${isUnread && activeTab === 'inbox' ? 'bg-slate-50/50 dark:bg-slate-800' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm ${isUnread && activeTab === 'inbox' ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                    {activeTab === 'sent' && <span className="text-xs text-slate-400 font-normal mr-1">To:</span>}
                                    {displayName}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(inq.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                </span>
                            </div>

                            {/* Indicators */}
                            <div className="flex items-center gap-2 mb-1">
                                {/* B2B Badge for Inbox */}
                                {activeTab === 'inbox' && inq.senderBusinessId && (
                                    <div className="flex items-center gap-1 text-[10px] bg-voxa-navy/10 dark:bg-white/10 text-voxa-navy dark:text-voxa-gold px-1.5 py-0.5 rounded font-bold uppercase">
                                        <Building2 className="w-3 h-3" /> Verified Business
                                    </div>
                                )}
                                {/* Read Status for Sent */}
                                {activeTab === 'sent' && (
                                    <div className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${inq.isRead ? 'text-green-600 bg-green-50' : 'text-slate-500 bg-slate-100'}`}>
                                        {inq.isRead ? (
                                            <>
                                                <CheckCircle className="w-3 h-3" /> Seen
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-3 h-3" /> Delivered
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <p className={`text-xs line-clamp-2 ${isUnread && activeTab === 'inbox' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                {inq.message}
                            </p>
                            
                            {/* Unread Dot for Inbox */}
                            {isUnread && activeTab === 'inbox' && (
                                <span className="inline-block mt-2 w-2 h-2 rounded-full bg-red-500"></span>
                            )}
                        </div>
                    );
                  })
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
                             {/* Actions dependent on tab */}
                             {activeTab === 'inbox' ? (
                                <>
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
                                </>
                             ) : (
                                // Actions for Sent Items (e.g. Follow up)
                                <a href={`mailto:${selectedInquiry.visitorEmail}?subject=Follow up: Inquiry via Voxa`}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Mail className="w-4 h-4" /> Follow Up
                                    </Button>
                                </a>
                             )}
                        </div>
                    </div>

                    {/* Message Body */}
                    <div className="p-8 overflow-y-auto flex-grow">
                        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-slate-100 dark:border-slate-700">
                            
                            {/* Special Header for Sent Items */}
                            {activeTab === 'sent' && (
                                <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
                                     <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Sent To</p>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {businessNames[selectedInquiry.businessId] || "Unknown Business"}
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-6 w-6 p-0"
                                                onClick={() => navigate(`/explore?preview=${selectedInquiry.businessId}`)}
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </Button>
                                        </h3>
                                     </div>
                                     <div className={`text-sm px-3 py-1 rounded-full font-bold flex items-center gap-2 ${selectedInquiry.isRead ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                         {selectedInquiry.isRead ? <><Eye className="w-4 h-4"/> Read by Recipient</> : <><Check className="w-4 h-4"/> Sent</>}
                                     </div>
                                </div>
                            )}

                            {/* B2B Badge Header (Inbox Only) */}
                            {activeTab === 'inbox' && selectedInquiry.senderBusinessId && (
                                <div className="mb-6 bg-voxa-navy/5 dark:bg-white/5 border border-voxa-navy/10 dark:border-white/10 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-voxa-navy text-white rounded-full">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Verified Business Inquiry</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Sent by a registered business on Voxa.</p>
                                        </div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-voxa-gold hover:text-voxa-goldhover"
                                      onClick={() => navigate(`/explore?preview=${selectedInquiry.senderBusinessId}`)}
                                    >
                                        View Business Profile <ExternalLink className="w-3 h-3 ml-2" />
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center text-lg font-bold">
                                    {selectedInquiry.visitorName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {activeTab === 'inbox' ? selectedInquiry.visitorName : "You"}
                                    </h3>
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
