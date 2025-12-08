

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, MapPin, Star, CheckCircle, Clock, 
  Phone, Mail, Globe, Eye, Copy, Check, 
  User, Send, Edit, AlertCircle, Building2, Briefcase, Lock 
} from 'lucide-react';
import Button from '../Button';
import { Business, DailyHours, User as UserType } from '../../types';
import { storage } from '../../utils/storage';

interface BusinessProfileModalProps {
  business: Business;
  currentUser: UserType | null;
  onClose: () => void;
  trackMetric: (action: string, businessId: number, details?: string) => void;
}

const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({ 
  business, 
  currentUser, 
  onClose,
  trackMetric 
}) => {
  const navigate = useNavigate();
  const [revealedContacts, setRevealedContacts] = useState<number[]>([]); 
  const [leadFormData, setLeadFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [senderBusiness, setSenderBusiness] = useState<Business | undefined>(undefined);

  const isOwner = currentUser && currentUser.businessId === business.id;

  // Initialize B2B data if applicable
  useEffect(() => {
    if (currentUser && currentUser.businessId && !isOwner) {
      const myBiz = storage.getBusinessById(currentUser.businessId);
      if (myBiz) {
        setSenderBusiness(myBiz);
        setLeadFormData(prev => ({
          ...prev,
          name: myBiz.name,
          email: myBiz.email,
          phone: myBiz.phone
        }));
      }
    }
  }, [currentUser, isOwner]);

  const handleRevealContact = (e: React.MouseEvent, type: 'phone' | 'email') => {
    e.stopPropagation(); 
    if (!revealedContacts.includes(business.id)) {
        setRevealedContacts([...revealedContacts, business.id]);
    }
    trackMetric(`reveal_${type}`, business.id);
  };

  const handleCopyContact = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(type);
      trackMetric(`copy_${type}`, business.id);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { name, phone, email, message } = leadFormData;

    // Name Validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (/\d/.test(name) && !senderBusiness) {
      // Stricter for individuals, relaxed for business names
      newErrors.name = 'Name cannot contain numbers';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Validation
    const phoneClean = phone.trim();
    if (!phoneClean) {
      newErrors.phone = 'Phone number is required';
    } else {
        // Allow + only at start, rest digits
        if (!/^[0-9+]+$/.test(phoneClean)) {
             newErrors.phone = 'Only numbers and + are allowed';
        } else if (phoneClean.includes('+') && !phoneClean.startsWith('+')) {
             newErrors.phone = '+ can only be at the beginning';
        } else {
            // Check formats: +254... (13 total) or 07.../01... (10 total)
            const isIntl = /^\+254\d{9}$/; // +254 7XX XXX XXX
            const isLocal = /^(07|01)\d{8}$/; // 07XX XXX XXX or 01XX XXX XXX

            if (!isIntl.test(phoneClean) && !isLocal.test(phoneClean)) {
                newErrors.phone = 'Must be +254... or 07.../01... (10 digits)';
            }
        }
    }

    // Message Validation
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    // If it's a locked field and we have a senderBusiness, prevent changes
    if (senderBusiness && (field === 'name' || field === 'email' || field === 'phone')) {
      return;
    }

    setLeadFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    storage.saveInquiry({
        businessId: business.id,
        visitorName: leadFormData.name,
        visitorEmail: leadFormData.email,
        visitorPhone: leadFormData.phone,
        message: leadFormData.message,
        senderBusinessId: senderBusiness?.id // Attach sender ID if B2B
    });

    trackMetric('send_inquiry', business.id, senderBusiness ? 'B2B Inquiry' : 'Form Submitted');
    setIsMessageSent(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
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
            <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-voxa-gold text-white text-xs font-bold px-2 py-0.5 rounded uppercase">{business.industry}</span>
                {business.isVerified && (
                  <span className="flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold font-serif leading-tight">{business.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-slate-200 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {business.location}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {business.rating} ({business.reviews})</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 flex-grow overflow-y-auto">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">About</h3>
              <p className="text-slate-600 leading-relaxed">{business.fullDescription}</p>
            </div>

            {/* Operating Hours Display */}
            {business.operatingHours && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Hours of Operation
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(business.operatingHours).map(([day, data]) => {
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
                {business.specialties.map(spec => (
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
                      <p className={`font-medium ${revealedContacts.includes(business.id) ? 'text-slate-900' : 'text-slate-400 tracking-wider'}`}>
                        {revealedContacts.includes(business.id) 
                          ? business.phone 
                          : `${business.phone.substring(0, 7)}...`}
                      </p>
                    </div>
                  </div>
                  
                  {!revealedContacts.includes(business.id) ? (
                    <Button size="sm" variant="ghost" onClick={(e) => handleRevealContact(e, 'phone')} className="text-xs gap-1">
                      <Eye className="w-3 h-3" /> Show
                    </Button>
                  ) : (
                    <button 
                      onClick={() => handleCopyContact(business.phone, 'phone')}
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
                      <p className={`font-medium ${revealedContacts.includes(business.id) ? 'text-slate-900' : 'text-slate-400 tracking-wider'}`}>
                         {revealedContacts.includes(business.id) 
                          ? business.email 
                          : "******@" + business.email.split('@')[1]}
                      </p>
                    </div>
                  </div>
                  
                  {!revealedContacts.includes(business.id) ? (
                    <Button size="sm" variant="ghost" onClick={(e) => handleRevealContact(e, 'email')} className="text-xs gap-1">
                      <Eye className="w-3 h-3" /> Show
                    </Button>
                  ) : (
                    <button 
                      onClick={() => handleCopyContact(business.email, 'email')}
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
                    <p className="font-medium text-slate-900">{business.website}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Messaging Form (Always Visible) */}
        <div className="w-full md:w-2/5 bg-slate-50 p-8 border-l border-slate-100 flex flex-col justify-center">
          {isOwner ? (
            <div className="text-center space-y-4 p-8 bg-white/50 rounded-xl border border-slate-200 border-dashed">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Owner Preview</h3>
                <p className="text-slate-500 text-sm mt-1">
                  This is the inquiry form your clients see. It is disabled because you are viewing your own profile.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/business/inquiries')}>
                View Inbox
              </Button>
            </div>
          ) : isMessageSent ? (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Inquiry Sent!</h3>
              <p className="text-slate-600">
                Thanks for contacting {business.name}. They will respond to the details provided shortly.
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

              {/* B2B Networking Badge */}
              {senderBusiness && (
                <div className="bg-voxa-navy/5 border border-voxa-navy/10 rounded-lg p-3 mb-4 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-voxa-gold">
                        <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-voxa-navy uppercase tracking-wide">B2B Networking Mode</p>
                        <p className="text-xs text-slate-600">Sending as <span className="font-semibold">{senderBusiness.name}</span>. Identity verified.</p>
                    </div>
                </div>
              )}

              <form onSubmit={handleLeadSubmit} className="space-y-4 flex-grow flex flex-col" noValidate>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {senderBusiness ? "Business Name" : "Your Name"}
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className={`w-full p-3 rounded-lg border outline-none bg-white 
                        ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200' : 'border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold'}
                        ${senderBusiness ? 'bg-slate-100 text-slate-500 cursor-not-allowed pr-10' : ''}
                      `}
                      placeholder={senderBusiness ? senderBusiness.name : "John Doe"}
                      value={leadFormData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      readOnly={!!senderBusiness}
                    />
                    {senderBusiness && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {senderBusiness ? "Business Phone" : "Phone Number"}
                  </label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      className={`w-full p-3 rounded-lg border outline-none bg-white 
                        ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200' : 'border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold'}
                        ${senderBusiness ? 'bg-slate-100 text-slate-500 cursor-not-allowed pr-10' : ''}
                      `}
                      placeholder="+254..."
                      value={leadFormData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      readOnly={!!senderBusiness}
                    />
                    {senderBusiness && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                     {senderBusiness ? "Business Email" : "Email Address"}
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      className={`w-full p-3 rounded-lg border outline-none bg-white 
                        ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200' : 'border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold'}
                        ${senderBusiness ? 'bg-slate-100 text-slate-500 cursor-not-allowed pr-10' : ''}
                      `}
                      placeholder="you@example.com"
                      value={leadFormData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      readOnly={!!senderBusiness}
                    />
                     {senderBusiness && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>

                <div className="flex-grow">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                  <textarea 
                    className={`w-full p-3 rounded-lg border focus:ring-1 outline-none bg-white h-32 resize-none ${errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-voxa-gold focus:border-voxa-gold'}`}
                    placeholder={`Hi, we are interested in collaborating...`}
                    value={leadFormData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                  ></textarea>
                  {errors.message ? (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.message}</p>
                  ) : (
                      <p className="text-xs text-slate-400 mt-1 text-right">{leadFormData.message.length}/20 min chars</p>
                  )}
                </div>

                <Button className="w-full gap-2 mt-auto" type="submit">
                  Send Message
                  <Send className="w-4 h-4" />
                </Button>
                <p className="text-xs text-slate-400 text-center mt-2">
                  {senderBusiness ? "Official business inquiry." : "Your details are sent securely."}
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileModal;
