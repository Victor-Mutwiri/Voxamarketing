import React from 'react';
import { TESTIMONIALS } from '../../constants';

const TestimonialsSection: React.FC = () => {
  return (
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
  );
};

export default TestimonialsSection;