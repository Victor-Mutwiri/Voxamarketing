import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExploreHeader from '../components/explore/ExploreHeader';
import FilterSidebar from '../components/explore/FilterSidebar';
import BusinessCard from '../components/explore/BusinessCard';
import BusinessProfileModal from '../components/explore/BusinessProfileModal';
import Button from '../components/Button';
import { INDUSTRIES } from '../constants';
import { Business } from '../types';
import { storage } from '../utils/storage';

const ExplorePage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // AI Results
  const [aiResults, setAiResults] = useState<Business[] | null>(null);
  const [aiQuery, setAiQuery] = useState<string | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());

  useEffect(() => {
    // Check if we came from Landing Page with AI results
    if (location.state && location.state.aiResults) {
        setAiResults(location.state.aiResults);
        setAiQuery(location.state.query);
    }

    // Fetch default businesses
    const data = storage.getBusinesses();
    setBusinesses(data);

    // Refresh user state
    setCurrentUser(storage.getCurrentUser());

    // Handle "Preview Mode" from query param
    const previewId = searchParams.get('preview');
    if (previewId) {
      const biz = data.find(b => b.id.toString() === previewId);
      if (biz) {
        setSelectedBusiness(biz);
      }
    }
  }, [searchParams, location.state]);

  const clearAiSearch = () => {
    setAiResults(null);
    setAiQuery(null);
    setSearchTerm('');
  };

  const activeBusinesses = aiResults || businesses;

  const filteredBusinesses = activeBusinesses.filter(biz => {
    // If we are previewing a specific business, we might ignore visibility
    if (biz.isVisible === false && searchParams.get('preview') !== biz.id.toString()) {
      return false;
    }

    // If AI results are active, we rely on the AI ranking and skip standard filtering unless user adds more
    if (aiResults) {
        return true; 
    }

    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          biz.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'All' || biz.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  // Analytics Simulation Function
  const trackMetric = (action: string, businessId: number, details?: string) => {
    console.log(`[ANALYTICS] Action: ${action} | BusinessID: ${businessId} | Details: ${details || 'N/A'}`);
  };

  const handleOpenProfile = (business: Business) => {
    setSelectedBusiness(business);
    trackMetric('profile_view', business.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <ExploreHeader 
        aiResults={aiResults}
        aiQuery={aiQuery}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        clearAiSearch={clearAiSearch}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <FilterSidebar 
              industries={INDUSTRIES}
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={setSelectedIndustry}
              disabled={!!aiResults}
            />
          </div>

          {/* Results Grid */}
          <div className="flex-grow">
            <div className="mb-4 text-slate-500 text-sm flex justify-between items-center">
              <span>Showing {filteredBusinesses.length} premium results</span>
              {aiResults && (
                  <Button variant="ghost" size="sm" onClick={clearAiSearch} className="text-red-500 hover:bg-red-50 h-8">
                      Clear AI Results
                  </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBusinesses.map((biz) => (
                <BusinessCard 
                  key={biz.id}
                  business={biz}
                  isAiResult={!!aiResults}
                  onClick={handleOpenProfile}
                />
              ))}
            </div>

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
                <p className="text-slate-500 text-lg">No businesses found matching your criteria.</p>
                <button 
                  className="mt-4 text-voxa-gold font-medium hover:underline"
                  onClick={() => {
                      setSearchTerm(''); 
                      setSelectedIndustry('All');
                      clearAiSearch();
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Profile Modal */}
      {selectedBusiness && (
        <BusinessProfileModal 
          business={selectedBusiness}
          currentUser={currentUser}
          onClose={() => setSelectedBusiness(null)}
          trackMetric={trackMetric}
        />
      )}

      <Footer />
    </div>
  );
};

export default ExplorePage;