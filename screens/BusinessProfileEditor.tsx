import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  MapPin, 
  Globe, 
  Briefcase, 
  Upload, 
  Phone, 
  Mail,
  User,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import Button from '../components/Button';
import { storage } from '../utils/storage';
import { Business, User as UserType } from '../types';
import { INDUSTRIES, INDUSTRY_SPECIALTIES } from '../constants';

const BusinessProfileEditor: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<Partial<Business>>({});
  const [originalData, setOriginalData] = useState<Partial<Business>>({}); // For tracking changes
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch Data on Mount
  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(user);

    if (user.businessId) {
      const biz = storage.getBusinessById(user.businessId);
      if (biz) {
        setFormData(biz);
        setOriginalData(biz);
      }
    }
    setIsLoading(false);
  }, [navigate]);

  const handleChange = (field: keyof Business, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange('image', url);
    }
  };

  const toggleSpecialty = (spec: string) => {
    const currentSpecs = formData.specialties || [];
    if (currentSpecs.includes(spec)) {
      handleChange('specialties', currentSpecs.filter(s => s !== spec));
    } else {
      if (currentSpecs.length >= 5) return alert('You can select up to 5 specialties.');
      handleChange('specialties', [...currentSpecs, spec]);
    }
  };

  const handleSave = () => {
    if (!currentUser?.businessId) return;

    if (!formData.name || !formData.location || !formData.phone || !formData.email) {
      alert("Please fill in all required fields.");
      return;
    }

    storage.updateBusinessProfile(currentUser.businessId, formData);
    setOriginalData(formData);
    setSuccessMessage('Profile updated successfully!');
    
    // Auto-hide toast
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar />

      <main className="flex-grow md:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
              <p className="text-slate-500">Update your business information and public appearance.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/business/dashboard')}>Cancel</Button>
              <Button className="gap-2" onClick={handleSave}>
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </div>

          {/* Success Toast */}
          {successMessage && (
             <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="w-5 h-5" />
                {successMessage}
             </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Media & Identity */}
            <div className="space-y-6">
              
              {/* Logo / Image */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Brand Image</h3>
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4 group cursor-pointer">
                    <img 
                      src={formData.image} 
                      alt="Business Logo" 
                      className="w-full h-full object-cover rounded-full border-4 border-slate-50 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="text-white w-8 h-8" />
                    </div>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <p className="text-xs text-slate-400 text-center">Click to upload new logo.<br/>Recommended 400x400px.</p>
                </div>
              </div>

              {/* Immutable Settings */}
              <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold">
                   <AlertCircle className="w-4 h-4" /> Account Type
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  You are registered as a <span className="font-bold text-voxa-navy">Business</span>.
                </p>
                <p className="text-xs text-slate-400">
                  This setting cannot be changed. Contact support for entity type modifications.
                </p>
              </div>

            </div>

            {/* Right Column: Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Info */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold outline-none"
                      value={formData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold outline-none"
                      value={formData.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">About</label>
                  <textarea 
                    className="w-full p-4 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold outline-none h-32 resize-none"
                    value={formData.fullDescription || ''}
                    onChange={(e) => handleChange('fullDescription', e.target.value)}
                  />
                </div>
              </div>

              {/* Industry & Skills */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Expertise</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold outline-none bg-white"
                      value={formData.industry || ''}
                      onChange={(e) => {
                          const newInd = e.target.value;
                          if (newInd !== formData.industry) {
                              if(window.confirm("Changing industry will reset your selected specialties. Continue?")) {
                                  handleChange('industry', newInd);
                                  handleChange('specialties', []);
                              }
                          }
                      }}
                    >
                      {INDUSTRIES.map(ind => (
                        <option key={ind.id} value={ind.name}>{ind.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.industry && INDUSTRY_SPECIALTIES[formData.industry]?.map(spec => (
                      <button
                        key={spec}
                        onClick={() => toggleSpecialty(spec)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                          formData.specialties?.includes(spec)
                            ? 'bg-voxa-navy text-white border-voxa-navy'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-voxa-gold'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Select up to 5 key areas.</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                        type="tel" 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold outline-none"
                        value={formData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                        type="email" 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold outline-none"
                        value={formData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="url" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-voxa-gold outline-none"
                      value={formData.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                    />
                  </div>
                </div>

                {/* We could add availability field to Business type if needed, assuming it's part of description for now or extended types */}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessProfileEditor;