import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  CheckCircle, 
  Ticket,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { storage } from '../utils/storage';

type AuthView = 'login' | 'redeem';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>('login');
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    code: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on type
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (view === 'login') {
      const user = storage.login(formData.email, formData.password);
      if (user) {
        if (user.isProfileComplete) {
          navigate('/business/dashboard');
        } else {
          navigate('/business/onboarding');
        }
      } else {
        setError('Invalid email or password.');
      }
    } else {
      // Redeem / Signup
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const newUser = storage.register(formData.email, formData.password, formData.code);
      if (newUser) {
        // Success
        navigate('/business/onboarding');
      } else {
        setError('Invalid invitation code or email. Please check your invite.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-12 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
          
          {/* Left Side: Brand/Visual */}
          <div className="hidden md:flex md:w-5/12 bg-voxa-navy relative overflow-hidden flex-col justify-between p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-voxa-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-bold mb-6">
                Business Partners Only.
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Voxa Marketing is an exclusive community. Access is restricted to approved businesses, companies, and consultants.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle className="w-5 h-5 text-voxa-gold" />
                <span>Strictly Vetted</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle className="w-5 h-5 text-voxa-gold" />
                <span>Invite-Only Access</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            <div className="flex gap-8 mb-8 border-b border-gray-100">
              <button
                className={`pb-4 text-lg font-medium transition-colors relative ${
                  view === 'login' ? 'text-voxa-navy' : 'text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => setView('login')}
              >
                Partner Login
                {view === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-voxa-gold"></div>}
              </button>
              <button
                className={`pb-4 text-lg font-medium transition-colors relative ${
                  view === 'redeem' ? 'text-voxa-navy' : 'text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => setView('redeem')}
              >
                Claim Invitation
                {view === 'redeem' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-voxa-gold"></div>}
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Login Fields */}
              {view === 'login' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="email"
                        name="email"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none transition-all"
                        placeholder="contact@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="password"
                        name="password"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none transition-all"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-voxa-gold hover:underline">Forgot password?</a>
                  </div>
                </>
              )}

              {/* Redeem Invite Fields */}
              {view === 'redeem' && (
                <div className="animate-in fade-in duration-300 space-y-5">
                  <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex gap-2">
                    <Ticket className="w-4 h-4 flex-shrink-0" />
                    Enter the code sent to your approved email address to verify your business.
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Waitlist Code</label>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text"
                        name="code"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none transition-all uppercase tracking-wider"
                        placeholder="VOXA-XXXX"
                        value={formData.code}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Approved Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="email"
                        name="email"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none transition-all"
                        placeholder="contact@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                      <input 
                        type="password"
                        name="password"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none"
                        placeholder="Create Password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Confirm</label>
                      <input 
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button variant="primary" size="lg" className="w-full gap-2 mt-6">
                {view === 'login' ? 'Access Dashboard' : 'Verify & Create Account'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-center mt-6 text-slate-400 text-xs">
              Having trouble? Contact concierge@voxamarketing.com
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;