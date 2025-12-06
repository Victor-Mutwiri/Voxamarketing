import React from 'react';
import { Search, MapPin, Sparkles, XCircle } from 'lucide-react';
import Button from '../Button';

interface ExploreHeaderProps {
  aiResults: any[] | null;
  aiQuery: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearAiSearch: () => void;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({ 
  aiResults, 
  aiQuery, 
  searchTerm, 
  setSearchTerm, 
  clearAiSearch 
}) => {
  return (
    <div className="pt-24 pb-12 bg-voxa-navy text-white relative overflow-hidden">
      {aiResults && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-voxa-gold/20 z-0"></div>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">Explore Excellence</h1>
        
        <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-lg max-w-4xl shadow-xl">
           <div className="flex-grow flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200">
             {aiResults ? <Sparkles className="text-voxa-gold w-5 h-5 mr-3" /> : <Search className="text-gray-400 w-5 h-5 mr-3" />}
             <input 
               type="text" 
               placeholder="Search for businesses, services, or tags..." 
               className="w-full h-12 outline-none text-slate-800 placeholder:text-gray-400"
               value={aiQuery ? `AI Search: "${aiQuery}"` : searchTerm}
               onChange={(e) => {
                   if (aiResults) clearAiSearch(); 
                   setSearchTerm(e.target.value);
               }}
             />
             {aiResults && (
                 <button onClick={clearAiSearch} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                     <XCircle className="w-5 h-5" />
                 </button>
             )}
           </div>
           <div className="flex-shrink-0 flex items-center px-4 md:w-64">
             <MapPin className="text-gray-400 w-5 h-5 mr-3" />
             <select className="w-full h-12 outline-none text-slate-800 bg-transparent cursor-pointer">
               <option>Nairobi, Kenya</option>
               <option>Mombasa, Kenya</option>
               <option>Kisumu, Kenya</option>
             </select>
           </div>
           <Button className="md:w-auto w-full">Search</Button>
        </div>
        
        {aiResults && (
            <div className="mt-4 flex items-center gap-2 text-sm text-voxa-gold animate-in fade-in slide-in-from-top-2">
                <Sparkles className="w-4 h-4" />
                <span>Showing AI-curated matches based on your request. Sorted by relevance.</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default ExploreHeader;