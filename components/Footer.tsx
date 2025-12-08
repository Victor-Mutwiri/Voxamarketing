
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [tapCount, setTapCount] = useState(0);

  // Reset taps if no activity for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setTapCount(0);
    }, 2000);
    return () => clearTimeout(timer);
  }, [tapCount]);

  const handleSecretTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount === 4) {
      // Secret path navigation
      navigate('/portal/8f030ac9-93da-41cc-af88-d9342cd54e5d');
    }
  };

  return (
    <footer className="bg-voxa-navy text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-default select-none" onClick={handleSecretTap}>
              <Hexagon className={`w-8 h-8 ${tapCount > 0 ? 'text-white' : 'text-voxa-gold'} fill-current transition-colors`} />
              <span className="text-2xl font-serif font-bold">Voxa.</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              The definitive directory for Kenya's most distinguished businesses and professionals. Excellence curated for those who demand the best.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-voxa-gold">Platform</h3>
            <ul className="space-y-3 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#/explore" className="hover:text-white transition-colors">Explore Directory</a></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">Pricing for Business</a></li> */}
              {/* <li><a href="#" className="hover:text-white transition-colors">Review Guidelines</a></li> */}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-voxa-gold">Contact</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-voxa-gold" />
                <span>Westlands, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-voxa-gold" />
                <span>concierge@voxamarketing.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-voxa-gold" />
                <span>+254 700 000 000</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-voxa-gold">Stay Connected</h3>
            <div className="flex gap-4 mb-6">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-voxa-gold transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-voxa-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-voxa-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Voxa Marketing. All rights reserved.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
          <p>Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;