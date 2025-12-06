import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Sparkles, XCircle, Search, Loader2, MapPin, ChevronRight, ArrowRight } from 'lucide-react';
import Button from '../Button';
import { Business } from '../../types';
import AI from '../../utils/ai';
import { storage } from '../../utils/storage';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Close search results if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setHasSearched(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (hasSearched && searchResults.length > 0 && resultsRef.current) {
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
  }, [hasSearched, searchResults]);

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(false); 

    try {
      const businesses = storage.getBusinesses();
      const results = await AI.search(searchQuery, businesses);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error("Search failed", error);
      alert("AI Search is initializing. Please try again in a few seconds.");
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setSearchResults([]);
  };

  const handleResultClick = (businessId: number) => {
    navigate(`/explore?preview=${businessId}`);
  };

  return (
    <section className="relative pt-12 pb-16 lg:pt-24 lg:pb-24">
        {/* Background wrapper to prevent horizontal scroll from blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-voxa-gold/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-voxa-navy/5 border border-voxa-navy/10 text-voxa-navy font-medium text-sm animate-fade-in-up">
              <Star className="w-4 h-4 text-voxa-gold fill-current" />
              <span>The Premier Directory for Kenya</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-slate-900 leading-tight">
              Connect with <span className="text-voxa-gold italic">Excellence</span>.
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find Kenya's top-tier professionals using our AI-powered concierge. Simply describe what you need, and we'll match you with the best.
            </p>
            
            {/* Smart Search Bar Container */}
            <div ref={searchContainerRef} className="max-w-2xl mx-auto pt-6 relative z-30">
              <form onSubmit={handleSmartSearch} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-voxa-gold to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className={`relative bg-white p-2 shadow-xl flex items-center transition-all duration-300 ${hasSearched ? 'rounded-t-xl border-b border-slate-100' : 'rounded-xl'}`}>
                  <div className="pl-4 text-voxa-gold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <input 
                    type="text" 
                    className="flex-grow p-4 text-lg outline-none text-slate-800 placeholder:text-slate-400 bg-transparent"
                    placeholder="E.g. I need a pediatric dentist in Westlands open on weekends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                        type="button"
                        onClick={clearSearch}
                        className="p-2 text-slate-400 hover:text-slate-600"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="rounded-lg px-8 gap-2 ml-2"
                    disabled={isSearching}
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Search
                  </Button>
                </div>
              </form>

              {/* Inline Search Results Panel */}
              {hasSearched && (
                <div ref={resultsRef} className="absolute top-full left-0 right-0 bg-white rounded-b-xl shadow-2xl border-t-0 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-40 text-left">
                    
                    {searchResults.length > 0 ? (
                        <>
                            <div className="p-4 bg-slate-50 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wide">
                                <span>Top Matches</span>
                                <span className="text-voxa-gold flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Sorted</span>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                {searchResults.slice(0, 4).map((result) => (
                                    <div 
                                        key={result.id} 
                                        onClick={() => handleResultClick(result.id)}
                                        className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group flex items-start gap-4"
                                    >
                                        <img src={result.image} alt={result.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-900 group-hover:text-voxa-gold transition-colors">{result.name}</h4>
                                                {result.matchScore && (
                                                    <span className="bg-voxa-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                        {Math.round(result.matchScore * 100)}% Match
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 line-clamp-1">{result.industry} • {result.entityType}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {result.location}</span>
                                                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-current" /> {result.rating}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-voxa-gold self-center" />
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                                <button 
                                    onClick={() => navigate('/explore', { state: { aiResults: searchResults, query: searchQuery } })}
                                    className="text-sm font-medium text-voxa-navy hover:text-voxa-gold transition-colors flex items-center justify-center gap-1 w-full"
                                >
                                    View All {searchResults.length} Matches <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Search className="w-8 h-8 opacity-50" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No exact matches found</h3>
                            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                                We couldn't find a business matching your specific request. Try adjusting your prompt or browse our full directory.
                            </p>
                            <Button 
                                variant="outline" 
                                className="w-full justify-center"
                                onClick={() => navigate('/explore')}
                            >
                                Browse Directory
                            </Button>
                        </div>
                    )}
                </div>
              )}
              
              {!hasSearched && (
                <p className="text-xs text-slate-400 mt-3 flex justify-center items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    AI Search Active
                </p>
              )}
            </div>

            <div className="pt-8">
                <Button variant="ghost" className="text-slate-500" onClick={() => document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    Are you a top-tier business? List with us <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
          </div>
        </div>
    </section>
  );
};

export default HeroSection;