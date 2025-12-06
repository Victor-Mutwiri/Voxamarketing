import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, Scale, Stethoscope, HardHat, Factory, Compass } from 'lucide-react';
import Button from '../Button';
import { INDUSTRIES } from '../../constants';

const iconMap: Record<string, React.ElementType> = {
  Scale, Stethoscope, HardHat, Factory, Compass, Briefcase
};

const IndustriesSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default IndustriesSection;