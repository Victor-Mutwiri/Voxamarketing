import React from 'react';
import { Filter } from 'lucide-react';
import { Industry } from '../../types';

interface FilterSidebarProps {
  industries: Industry[];
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  disabled: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  industries, 
  selectedIndustry, 
  setSelectedIndustry, 
  disabled 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 sticky top-24">
      <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
        <Filter className="w-4 h-4" /> Filters
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Industry</h3>
        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
          <input 
            type="radio" 
            name="industry" 
            checked={selectedIndustry === 'All'}
            onChange={() => setSelectedIndustry('All')}
            className="text-voxa-gold focus:ring-voxa-gold"
            disabled={disabled}
          />
          <span className={`text-sm ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>All Industries</span>
        </label>
        {industries.map(ind => (
          <label key={ind.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <input 
              type="radio" 
              name="industry" 
              checked={selectedIndustry === ind.name}
              onChange={() => setSelectedIndustry(ind.name)}
              className="text-voxa-gold focus:ring-voxa-gold"
              disabled={disabled}
            />
            <span className={`text-sm ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>{ind.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;