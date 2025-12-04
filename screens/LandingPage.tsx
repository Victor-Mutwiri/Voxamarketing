import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Search, 
  Scale, 
  Stethoscope, 
  HardHat, 
  Factory, 
  Compass, 
  Briefcase,
  Star,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { INDUSTRIES, STATISTICS, TESTIMONIALS } from '../constants';

const iconMap: Record<string, React.ElementType> = {
  Scale, Stethoscope, HardHat, Factory, Compass, Briefcase
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [entityType, setEntityType] = useState<string>('Business');

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for joining the waitlist as a ${entityType}! We will contact ${email} soon.`);
    setEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 -z-20" />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-voxa-gold/10 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-voxa-navy/5 border border-voxa-navy/10 text-voxa-navy font-medium text-sm animate-fade-in-up">
              <Star className="w-4 h-4 text-voxa-gold fill-current" />
              <span>The Premier Directory for Kenya</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-slate-900 leading-tight">
              Connect with <span className="text-voxa-gold italic">Excellence</span>.
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Voxa Marketing is the exclusive gateway to Kenya's top-tier professionals and enterprises. From Law to Manufacturing, find the best of the best.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full sm:w-auto gap-2 group"
                onClick={() => navigate('/explore')}
              >
                Start Exploring
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                List Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-voxa-navy text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700">
            {STATISTICS.map((stat, index) => (
              <div key={index} className="pt-8 md:pt-0">
                <div className="text-4xl font-bold text-voxa-gold mb-2">{stat.value}</div>
                <div className="text-slate-300 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-voxa-gold/20 transform translate-x-4 translate-y-4 rounded-2xl" />
              <img 
                src="https://picsum.photos/600/600" 
                alt="Professional meeting in Nairobi" 
                className="relative rounded-2xl shadow-xl w-full object-cover aspect-square"
              />
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl font-serif font-bold text-slate-900">
                Not just a directory.<br />
                A standard of quality.
              </h2>
              <p className="text-lg text-slate-600">
                We don't work with everyone. Voxa Marketing is a curated ecosystem of industry leaders. We vet every business to ensure our clients connect only with verified experts.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-voxa-navy/5 flex items-center justify-center text-voxa-navy">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Vetted Professionals</h3>
                    <p className="text-slate-600">Strict acceptance criteria ensure you only deal with reputable, high-performing entities.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-voxa-navy/5 flex items-center justify-center text-voxa-navy">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Precision Matching</h3>
                    <p className="text-slate-600">Advanced filtering helps you find the exact specialist you need in Nairobi and beyond.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-voxa-navy/5 flex items-center justify-center text-voxa-navy">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Growth for Business</h3>
                    <p className="text-slate-600">Premium exposure for businesses that have earned their place at the top.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Elite Professionals Across Industries</h2>
            <p className="text-slate-600">Explore our curated selection of top-rated businesses in key sectors.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INDUSTRIES.map((industry) => {
              const Icon = iconMap[industry.iconName] || Briefcase;
              return (
                <div key={industry.id} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group cursor-pointer" onClick={() => navigate('/explore')}>
                  <div className="w-14 h-14 bg-voxa-navy text-white rounded-lg flex items-center justify-center mb-6 group-hover:bg-voxa-gold transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{industry.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{industry.description}</p>
                  <span className="text-voxa-gold font-medium text-sm flex items-center gap-1">
                    Find Experts <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" onClick={() => navigate('/explore')}>View All Categories</Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-slate-900 mb-16">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="bg-slate-50 p-8 rounded-2xl relative">
                <div className="text-voxa-gold text-6xl font-serif absolute top-4 left-6 opacity-20">"</div>
                <p className="text-slate-700 italic text-lg mb-6 relative z-10">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
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
            
            <form onSubmit={handleWaitlistSubmit} className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/10 flex flex-col md:flex-row gap-2">
               <select 
                className="h-12 px-4 rounded-lg bg-slate-800 border-none text-white focus:ring-2 focus:ring-voxa-gold outline-none md:w-56 cursor-pointer"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
              >
                <option value="Business">I am a Business</option>
                <option value="Company">I am a Company</option>
                <option value="Organization">I am an Organization</option>
                <option value="Consultant">I am a Consultant</option>
              </select>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-12 flex-grow px-6 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-voxa-gold"
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" size="lg" className="md:w-auto w-full">
                Join Waitlist
              </Button>
            </form>
            <p className="mt-4 text-sm text-slate-400">
              Limited spots available for the beta launch in Nairobi.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;