import React from 'react';
import { ShieldCheck, Search, TrendingUp } from 'lucide-react';

const ValuePropSection: React.FC = () => {
  return (
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
  );
};

export default ValuePropSection;