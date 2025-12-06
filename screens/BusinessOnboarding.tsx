
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Briefcase, 
  Clock, 
  Upload, 
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { INDUSTRIES, INDUSTRY_SPECIALTIES } from '../constants';
import { storage } from '../utils/storage';
import { EntityType } from '../types';

type OnboardingStep = 1 | 2 | 3 | 4;

interface OnboardingData {
  entityType: EntityType | '';
  name: string;
  industry: string;
  website: string;
  logo: string | null;
  location: string;
  about: string;
  specialties: string[];
  phone: string;
  email: string;
  availability: string;
}

const BusinessOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load user from session
  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(user);
    if (user.isProfileComplete) {
      navigate('/business/dashboard');
    }
    // Pre-fill email from auth
    setData(prev => ({ ...prev, email: user.email }));
  }, [navigate]);

  const [data, setData] = useState<OnboardingData>({
    entityType: '',
    name: '',
    industry: '',
    website: '',
    logo: null,
    location: '',
    about: '',
    specialties: [],
    phone: '',
    email: '',
    availability: 'Mon - Fri: 8:00 AM - 5:00 PM'
  });

  const handleNext = () => {
    // Basic validation per step
    if (step === 1 && !data.entityType) return alert('Please select an entity type.');
    if (step === 2 && (!data.name || !data.industry)) return alert('Name and Industry are required.');
    if (step === 3 && (!data.location || !data.about)) return alert('Location and Description are required.');
    if (step === 4 && (!data.phone || !data.email)) return alert('Contact details are required.');

    if (step < 4) {
      setStep((prev) => (prev + 1) as OnboardingStep);
    } else {
      // Final Submit -> Save to Storage
      if (currentUser) {
        storage.saveBusinessProfile(currentUser.id, {
           name: data.name,
           industry: data.industry,
           location: data.location,
           fullDescription: data.about,
           specialties: data.specialties,
           phone: data.phone,
           email: data.email,
           website: data.website,
           image: data.logo || "https://picsum.photos/400/300?random=100", // Fallback image if no logo
           tags: data.specialties.slice(0, 3), // Use first 3 specialties as tags
           entityType: data.entityType as EntityType
        });
        alert('Profile created successfully! Redirecting to dashboard...');
        navigate('/business/dashboard');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const toggleSpecialty = (spec: string) => {
    if (data.specialties.includes(spec)) {
      setData({ ...data, specialties: data.specialties.filter(s => s !== spec) });
    } else {
      if (data.specialties.length >= 5) return alert('You can select up to 5 specialties.');
      setData({ ...data, specialties: [...data.specialties, spec] });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create fake URL for preview
      const url = URL.createObjectURL(file);
      setData({ ...data, logo: url });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-serif font-bold text-slate-900">Create Your Profile</h1>
              <span className="text-sm font-medium text-slate-500">Step {step} of 4</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-voxa-gold transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-slate-100">
            
            {/* Step 1: Entity Type */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-900">What describes you best?</h2>
                  <p className="text-slate-500 text-sm mt-2">
                    This setting <span className="text-red-500 font-semibold">cannot be changed</span> later. Please select carefully.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Business', 'Company', 'Organization', 'Consultant'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setData({ ...data, entityType: type as EntityType })}
                      className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                        data.entityType === type 
                          ? 'border-voxa-gold bg-voxa-gold/5 ring-1 ring-voxa-gold' 
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg text-slate-900">{type}</span>
                        {data.entityType === type && <CheckCircle className="w-5 h-5 text-voxa-gold" />}
                      </div>
                      <p className="text-xs text-slate-500">
                        Select if you are operating primarily as a {type.toLowerCase()}.
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Basic Info */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>
                
                {/* Logo Upload */}
                <div className="flex items-center gap-6">
                  <div className={`w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 ${!data.logo ? 'p-4' : ''}`}>
                    {data.logo ? (
                      <img src={data.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Company Logo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-voxa-navy/10 file:text-voxa-navy hover:file:bg-voxa-navy/20 cursor-pointer"
                    />
                    <p className="text-xs text-slate-400 mt-1">Recommended: 400x400px, PNG or JPG.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {data.entityType ? `${data.entityType} Name` : 'Name'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none"
                      placeholder="e.g. Acme Innovations Ltd"
                      value={data.name}
                      onChange={(e) => setData({...data, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none bg-white"
                      value={data.industry}
                      onChange={(e) => setData({...data, industry: e.target.value, specialties: []})}
                    >
                      <option value="">Select Primary Industry</option>
                      {INDUSTRIES.map(ind => (
                        <option key={ind.id} value={ind.name}>{ind.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="url" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none"
                      placeholder="https://www.yourcompany.com"
                      value={data.website}
                      onChange={(e) => setData({...data, website: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Details</h2>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none"
                      placeholder="e.g. Westlands, Nairobi"
                      value={data.location}
                      onChange={(e) => setData({...data, location: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    About Business <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className="w-full p-4 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none h-32 resize-none"
                    placeholder="Describe your services, history, and value proposition..."
                    value={data.about}
                    onChange={(e) => setData({...data, about: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Specialties (Max 5)
                  </label>
                  {!data.industry ? (
                    <p className="text-sm text-red-500">Please select an industry in the previous step to see specialties.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {INDUSTRY_SPECIALTIES[data.industry]?.map(spec => (
                        <button
                          key={spec}
                          onClick={() => toggleSpecialty(spec)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                            data.specialties.includes(spec)
                              ? 'bg-voxa-navy text-white border-voxa-navy'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-voxa-gold'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-2">{data.specialties.length}/5 selected</p>
                </div>
              </div>
            )}

            {/* Step 4: Contact & Finish */}
            {step === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Contact & Availability</h2>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Public Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="tel" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none"
                      placeholder="+254 700 000 000"
                      value={data.phone}
                      onChange={(e) => setData({...data, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Public Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="email" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none"
                      placeholder="info@yourcompany.com"
                      value={data.email}
                      onChange={(e) => setData({...data, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Business Hours
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold focus:border-voxa-gold outline-none"
                      placeholder="e.g. Mon - Fri: 8:00 AM - 5:00 PM"
                      value={data.availability}
                      onChange={(e) => setData({...data, availability: e.target.value})}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-blue-800 text-sm mt-8">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p>
                    By clicking "Complete Profile", you agree to our Terms of Service. Your profile will be reviewed by our team before getting a "Verified" badge.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                disabled={step === 1}
                className={step === 1 ? 'invisible' : ''}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                {step === 4 ? 'Complete Profile' : 'Next Step'} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for check circle
const CheckCircle: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default BusinessOnboarding;