import React from 'react';
import { MapPin, Star, CheckCircle, Sparkles } from 'lucide-react';
import { Business } from '../../types';
import Button from '../Button';

interface BusinessCardProps {
  business: Business;
  isAiResult: boolean;
  onClick: (business: Business) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, isAiResult, onClick }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full relative ${business.score && business.score > 0.8 ? 'border-voxa-gold/40 shadow-voxa-gold/10' : 'border-slate-100'}`}>
      {/* AI Ranking Badge */}
      {isAiResult && business.matchScore && (
          <div className="absolute top-3 left-3 z-10 bg-voxa-gold text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {Math.round(business.matchScore * 100)}% Match
          </div>
      )}

      <div className="h-48 overflow-hidden relative cursor-pointer" onClick={() => onClick(business)}>
         <img src={business.image} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
         {business.isVerified && (
           <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-voxa-navy shadow-sm flex items-center gap-1">
             <CheckCircle className="w-3 h-3 text-voxa-gold" /> Verified
           </div>
         )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs font-bold text-voxa-gold uppercase tracking-wide">{business.industry}</div>
          <div className="flex items-center gap-1 text-slate-700 text-sm font-medium">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {business.rating} ({business.reviews})
          </div>
        </div>
        <h3 
          className="text-xl font-bold text-slate-900 mb-1 cursor-pointer hover:text-voxa-gold transition-colors"
          onClick={() => onClick(business)}
        >
          {business.name}
        </h3>
        <div className="text-xs text-slate-400 mb-2 font-medium">{business.entityType || 'Business'}</div>

        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin className="w-3 h-3" /> {business.location}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {business.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onClick(business)}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;