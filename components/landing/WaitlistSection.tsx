
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '../Button';
import { storage } from '../../utils/storage';

const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [entityType, setEntityType] = useState<string>('Business');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await storage.addToWaitlist(email, entityType, phone, businessName);
      if (success) {
        setSubmitted(true);
        setEmail('');
        setPhone('');
        setBusinessName('');
      } else {
        alert("This email is already on the waitlist.");
      }
    } catch (error: any) {
      alert(error.message || 'Failed to join waitlist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist-section" className="py-24 bg-voxa-navy relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-voxa-gold rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Join the Inner Circle</h2>
          <p className="text-slate-300 mb-10 text-lg">
            Are you a top-tier business, organization, or consultant looking for premium clients?
            <br className="hidden md:block"/> Join our waitlist to be notified when spots open.
          </p>
          
          {submitted ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Request Received</h3>
              <p className="text-slate-300">
                Thank you for your interest. Our team will review your application and send an invite code to your email if approved.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm text-voxa-gold hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleWaitlistSubmit} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 flex flex-col gap-4 max-w-xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Business Name" 
                    className="h-12 px-4 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-voxa-gold"
                    required 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                  <select 
                    className="h-12 px-4 rounded-lg bg-slate-800 border-none text-white focus:ring-2 focus:ring-voxa-gold outline-none cursor-pointer"
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                  >
                    <option value="Business">I am a Business</option>
                    <option value="Company">I am a Company</option>
                    <option value="Organization">I am an Organization</option>
                    <option value="Consultant">I am a Consultant</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="h-12 px-4 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-voxa-gold"
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="h-12 px-4 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-voxa-gold"
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Join Waitlist'
                  )}
                </Button>
              </form>
              <p className="mt-4 text-sm text-slate-400">
                Limited spots available for the beta launch in Nairobi.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;