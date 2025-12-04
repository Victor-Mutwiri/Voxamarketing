import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  Building2, 
  User, 
  CheckCircle, 
  Briefcase 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { INDUSTRIES } from '../constants';

type AuthView = 'login' | 'signup';
type UserType = 'client' | 'business';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>('signup');
  const [userType, setUserType] = useState<UserType>('client');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    industry: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login') {
      alert('Login logic would go here.');
      navigate('/explore');
    } else {
      if (userType === 'business') {
        alert('Thank you for applying. Your business has been added to our priority waitlist.');
        navigate('/');
      } else {
        alert('Account created successfully! Welcome to Voxa.');
        navigate('/explore');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-12 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Left Side: Brand/Visual */}
          <div className="hidden md:flex md:w-5/12 bg-voxa-navy relative overflow-hidden flex-col justify-between p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-voxa-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-bold mb-6">
                {view === 'login' ? 'Welcome Back.' : 'Join the Elite.'}
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {view === 'login' 
                  ? 'Access your dashboard, manage your preferences, and connect with top-tier professionals.' 
                  : 'Voxa is the premier destination for distinguishing quality in the Kenyan market.'}
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle className="w-5 h-5 text-voxa-gold" />
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle className="w-5 h-5 text-voxa-gold" />
                <span>Secure Connections</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle className="w-5 h-5 text-voxa-gold" />
                <span>Premium Network</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            {/* Toggle Login/Signup */}
            <div className="flex gap-8 mb-8 border-b border-gray-100">
              <button
                className={`pb-4 text-lg font-medium transition-colors relative ${
                  view === 'signup' ? 'text-voxa-navy' : 'text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => setView('signup')}
              >
                Create Account
                {view === 'signup' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-voxa-gold"></div>}
              </button>
              <button
                className={`pb-4 text-lg font-medium transition-colors relative ${
                  view === 'login' ? 'text-voxa-navy' : 'text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => setView('login')}
              >
                Sign In
                {view === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-voxa-gold"></div>}
              </button>
            </div>

            {/* Signup Type Selection */}
            {view === 'signup' && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setUserType('client')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    userType === 'client' 
                      ? 'border-voxa-gold bg-voxa-gold/5 ring-1 ring-voxa-gold' 
                      : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <User className={`w-6 h-6 mb-2 ${userType === 'client' ? 'text-voxa-gold' : 'text-slate-400'}`} />
                  <div className="font-semibold text-slate-900">Private Client</div>
                  <div className="text-xs text-slate-500 mt-1">I'm looking for services</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('business')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    userType === 'business' 
                      ? 'border-voxa-gold bg-voxa-gold/5 ring-1 ring-voxa-gold' 
                      : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <Building2 className={`w-6 h-6 mb-2 ${userType === 'business' ? 'text-voxa-gold' : 'text-slate-400'}`} />
                  <div className="font-semibold text-slate-900 leading-tight">Business & Partners</div>
                  <div className="text-xs text-slate-500 mt-1">Companies, Organizations & Consultants</div>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Login View */}
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
                        placeholder="john@example.com"
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

              {/* Signup: Client View */}
              {view === 'signup' && userType === 'client' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text"
                        name="name"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none transition-all"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="email"
                        name="email"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none transition-all"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Create Password</label>
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
                </>
              )}

              {/* Signup: Business View */}
              {view === 'signup' && userType === 'business' && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
                    <Briefcase className="w-5 h-5 flex-shrink-0" />
                    <p>
                      To ensure quality, all business profiles are verified. Please join our priority waitlist to start the vetting process.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Organization / Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text"
                        name="companyName"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none transition-all"
                        placeholder="Acme Inc."
                        value={formData.companyName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                    <select
                      name="industry"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-voxa-gold focus:ring-1 focus:ring-voxa-gold outline-none transition-all bg-white"
                      value={formData.industry}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Industry</option>
                      {INDUSTRIES.map(ind => (
                        <option key={ind.id} value={ind.name}>{ind.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Business Email</label>
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
                </div>
              )}

              <Button variant="primary" size="lg" className="w-full gap-2">
                {view === 'login' ? 'Sign In' : (userType === 'business' ? 'Join Priority Waitlist' : 'Create Account')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {view === 'login' && (
              <p className="text-center mt-6 text-slate-500 text-sm">
                Don't have an account?{' '}
                <button onClick={() => setView('signup')} className="text-voxa-navy font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            )}

            {view === 'signup' && (
              <p className="text-center mt-6 text-slate-500 text-sm">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="text-voxa-navy font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;