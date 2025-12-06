import React from 'react';
import { STATISTICS } from '../../constants';

const StatsSection: React.FC = () => {
  return (
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
  );
};

export default StatsSection;