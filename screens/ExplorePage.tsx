import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { INDUSTRIES } from '../constants';
import { Search, MapPin, Star, Filter, X, Phone, Mail, Globe, CheckCircle, Send, User, ChevronRight, Eye, Copy, Check, Clock, Edit } from 'lucide-react';
import Button from '../components/Button';
import { Business, WeekDay, DailyHours } from '../types';
import { storage } from '../utils/storage';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ExplorePage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Auth State
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());

  // Interaction State
  const [revealedContacts, setRevealedContacts] = useState<number[]>([]); // IDs of businesses where contact is revealed
  const [leadFormData, setLeadFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null); // 'phone' | 'email'

  useEffect(() => {
    // Fetch businesses from our storage (which includes mock seeds + new users)
    const data = storage.getBusinesses();
    setBusinesses(data);

    // Refresh user state
    setCurrentUser(storage.getCurrentUser());

    // Handle "Preview Mode" from query param
    const previewId = searchParams.get('preview');
    if (previewId) {
      const biz = data.find(b => b.id.toString() === previewId);
      if (biz) {
        setSelectedBusiness(biz);
      }
    }
  }, [searchParams]);

  const filteredBusinesses = businesses.filter(biz => {
    // If we are previewing a specific business, we might ignore visibility, 
    // but in general list we respect `isVisible`.
    if (biz.isVisible === false && searchParams.get('preview') !== biz.id.toString()) {
      return false;
    }

    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          biz.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'All' || biz.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  // Analytics Simulation Function
  const trackMetric = (action: string, businessId: number, details?: string) => {
    console.log(`[ANALYTICS] Action: ${action} | BusinessID: ${businessId} | Details: ${details || 'N/A'}`);
    // In a real app, this would POST to your backend: /api/analytics
  };

  const handleOpenProfile = (business: Business) => {
    setSelectedBusiness(business);
    setIsMessageSent(false);
    setLeadFormData({ name: '', phone: '', email: '', message: '' });
    trackMetric('profile_view', business.id);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBusiness) {
        trackMetric('send_inquiry', selectedBusiness.id, 'Form Submitted');
        setIsMessageSent(true);
        setTimeout(() => {
            // Reset after a few seconds or keep showing success message
        }, 3000);
    }
  };

  const handleRevealContact = (e: React.MouseEvent, type: 'phone' | 'email') => {
    e.stopPropagation(); // Prevent other clicks
    if (selectedBusiness && !revealedContacts.includes(selectedBusiness.id)) {
        setRevealedContacts([...revealedContacts, selectedBusiness.id]);
    }
    if (selectedBusiness) {
        trackMetric(`reveal_${type}`, selectedBusiness.id);
    }
  };

  const handleCopyContact = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(type);
      if (selectedBusiness) {
          trackMetric(`copy_${type}`, selectedBusiness.id);
      }
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const isOwner = currentUser && selectedBusiness && currentUser.businessId === selectedBusiness.id;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Search Header */}
      <div className="pt-24 pb-12 bg-voxa-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">Explore Excellence</h1>
          
          <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-lg max-w-4xl shadow-xl">
             <div className="flex-grow flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200">
               <Search className="text-gray-400 w-5 h-5 mr-3" />
               <input 
                 type="text" 
                 placeholder="Search for businesses, services, or tags..." 
                 className="w-full h-12 outline-none text-slate-800 placeholder:text-gray-400"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <div className="flex-shrink-0 flex items-center px-4 md:w-64">
               <MapPin className="text-gray-400 w-5 h-5 mr-3" />
               <select className="w-full h-12 outline-none text-slate-800 bg-transparent cursor-pointer">
                 <option>Nairobi, Kenya</option>
                 <option>Mombasa, Kenya</option>
                 <option>Kisumu, Kenya</option>
               </select>
             </div>
             <Button className="md:w-auto w-full">Search</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
                <Filter className="w-4 h-4" /> Filters
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Industry</h3>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                  <input 
                    type="radio" 
                    name="industry" 
                    checked={selectedIndustry === 'All'}
                    onChange={() => setSelectedIndustry('All')}
                    className="text-voxa-gold focus:ring-voxa-gold"
                  />
                  <span className="text-slate-700 text-sm">All Industries</span>
                </label>
                {INDUSTRIES.map(ind => (
                  <label key={ind.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                    <input 
                      type="radio" 
                      name="industry" 
                      checked={selectedIndustry === ind.name}
                      onChange={() => setSelectedIndustry(ind.name)}
                      className="text-voxa-gold focus:ring-voxa-gold"
                    />
                    <span className="text-slate-700 text-sm">{ind.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-grow">
            <div className="mb-4 text-slate-500 text-sm">
              Showing {filteredBusinesses.length} premium results
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBusinesses.map((biz) => (
                <div key={biz.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                  <div className="h-48 overflow-hidden relative cursor-pointer" onClick={() => handleOpenProfile(biz)}>
                     <img src={biz.image} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     {biz.isVerified && (
                       <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-voxa-navy shadow-sm flex items-center gap-1">
                         <CheckCircle className="w-3 h-3 text-voxa-gold" /> Verified
                       </div>
                     )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold text-voxa-gold uppercase tracking-wide">{biz.industry}</div>
                      <div className="flex items-center gap-1 text-slate-700 text-sm font-medium">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {biz.rating} ({biz.reviews})
                      </div>
                    </div>
                    <h3 
                      className="text-xl font-bold text-slate-900 mb-2 cursor-pointer hover:text-voxa-gold transition-colors"
                      onClick={() => handleOpenProfile(biz)}
                    >
                      {biz.name}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                      <MapPin className="w-3 h-3" /> {biz.location}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {biz.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleOpenProfile(biz)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
                <p className="text-slate-500 text-lg">No businesses found matching your criteria.</p>
                <button 
                  className="mt-4 text-voxa-gold font-medium hover:underline"
                  onClick={() => {setSearchTerm(''); setSelectedIndustry('All');}}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Profile Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedBusiness(null)}></div>
          
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col md:flex-row">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedBusiness(null)}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors z-20 shadow-sm"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            {/* Owner Controls (Only visible if viewing own profile) */}
            {isOwner && (
              <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="primary" onClick={() => navigate('/business/dashboard')} className="shadow-lg">
                   Back to Dashboard
                </Button>
                 <Button size="sm" variant="secondary" onClick={() => navigate('/business/profile')} className="shadow-lg gap-2">
                   <Edit className="w-3 h-3" /> Edit
                </Button>
              </div>
            )}

            {/* Left Col - Business Info & Contacts */}
            <div className="w-full md:w-3/5 p-0 flex flex-col">
              <div className="h-64 relative flex-shrink-0">
                <img src={selectedBusiness.image} alt={selectedBusiness.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-voxa-gold text-white text-xs font-bold px-2 py-0.5 rounded uppercase">{selectedBusiness.industry}</span>
                    {selectedBusiness.isVerified && (
                      <span className="flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold font-serif leading-tight">{selectedBusiness.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-slate-200 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedBusiness.location}</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {selectedBusiness.rating} ({selectedBusiness.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 flex-grow overflow-y-auto">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">About</h3>
                  <p className="text-slate-600 leading-relaxed">{selectedBusiness.fullDescription}</p>
                </div>

                {/* Operating Hours Display */}
                {selectedBusiness.operatingHours && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Hours of Operation
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(selectedBusiness.operatingHours).map(([day, data]) => {
                        const hours = data as DailyHours;
                        return (
                          <div key={day} className="flex justify-between border-b border-slate-50 py-1">
                            <span className="text-slate-500 font-medium">{day}</span>
                            <span className={hours.isOpen ? 'text-slate-900' : 'text-slate-400 italic'}>
                              {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBusiness.specialties.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-voxa-navy/5 text-voxa-navy text-sm font-medium rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Contact Information</h3>
                  <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    {/* Phone Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-voxa-navy shadow-sm">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                          <p className={`font-medium ${revealedContacts.includes(selectedBusiness.id) ? 'text-slate-900' : 'text-slate-400 tracking-wider'}`}>
                            {revealedContacts.includes(selectedBusiness.id) 
                              ? selectedBusiness.phone 
                              : `${selectedBusiness.phone.substring(0, 7)}...`}
                          </p>
                        </div>
                      </div>
                      
                      {!revealedContacts.includes(selectedBusiness.id) ? (
                        <Button size="sm" variant="ghost" onClick={(e) => handleRevealContact(e, 'phone')} className="text-xs gap-1">
                          <Eye className="w-3 h-3" /> Show
                        </Button>
                      ) : (
                        <button 
                          onClick={() => handleCopyContact(selectedBusiness.phone, 'phone')}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-voxa-navy hover:bg-slate-200 rounded-md transition-colors"
                        >
                          {copiedField === 'phone' ? (
                            <>
                              <Check className="w-3 h-3 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Email Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-voxa-navy shadow-sm">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                          <p className={`font-medium ${revealedContacts.includes(selectedBusiness.id) ? 'text-slate-900' : 'text-slate-400 tracking-wider'}`}>
                             {revealedContacts.includes(selectedBusiness.id) 
                              ? selectedBusiness.email 
                              : "******@" + selectedBusiness.email.split('@')[1]}
                          </p>
                        </div>
                      </div>
                      
                      {!revealedContacts.includes(selectedBusiness.id) ? (
                        <Button size="sm" variant="ghost" onClick={(e) => handleRevealContact(e, 'email')} className="text-xs gap-1">
                          <Eye className="w-3 h-3" /> Show
                        </Button>
                      ) : (
                        <button 
                          onClick={() => handleCopyContact(selectedBusiness.email, 'email')}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-voxa-navy hover:bg-slate-200 rounded-md transition-colors"
                        >
                          {copiedField === 'email' ? (
                            <>
                              <Check className="w-3 h-3 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-voxa-navy shadow-sm">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Website</p>
                        <p className="font-medium text-slate-900">{selectedBusiness.website}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col - Messaging Form (Always Visible) */}
            <div className="w-full md:w-2/5 bg-slate-50 p-8 border-l border-slate-100 flex flex-col justify-center">
              {isMessageSent ? (
                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Inquiry Sent!</h3>
                  <p className="text-slate-600">
                    Thanks for contacting {selectedBusiness.name}. They will respond to the details provided shortly.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsMessageSent(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Send an Inquiry</h3>
                    <p className="text-slate-500 text-sm">Fill out the form below to contact this business directly.</p>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-4 flex-grow flex flex-col">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none bg-white"
                        placeholder="John Doe"
                        value={leadFormData.name}
                        onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                      <input 
                        required 
                        type="tel" 
                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none bg-white"
                        placeholder="+254..."
                        value={leadFormData.phone}
                        onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none bg-white"
                        placeholder="you@example.com"
                        value={leadFormData.email}
                        onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                      />
                    </div>
                    <div className="flex-grow">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                      <textarea 
                        required 
                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none bg-white h-32 resize-none"
                        placeholder={`Hi, I'm interested in your services...`}
                        value={leadFormData.message}
                        onChange={(e) => setLeadFormData({...leadFormData, message: e.target.value})}
                      ></textarea>
                    </div>

                    <Button className="w-full gap-2 mt-auto">
                      Send Message
                      <Send className="w-4 h-4" />
                    </Button>
                    <p className="text-xs text-slate-400 text-center mt-2">
                      Your details are sent securely to the business.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ExplorePage;