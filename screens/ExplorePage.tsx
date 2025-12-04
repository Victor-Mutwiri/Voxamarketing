import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { INDUSTRIES } from '../constants';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import Button from '../components/Button';

// Mock business data for the explore page
const MOCK_BUSINESSES = [
  {
    id: 1,
    name: "Nairobi Legal Partners",
    industry: "Legal Services",
    location: "Upper Hill, Nairobi",
    rating: 4.9,
    reviews: 124,
    tags: ["Corporate Law", "Litigation"],
    image: "https://picsum.photos/400/300?random=10"
  },
  {
    id: 2,
    name: "Apex Engineering Solutions",
    industry: "Engineering",
    location: "Industrial Area, Nairobi",
    rating: 4.8,
    reviews: 89,
    tags: ["Structural", "Civil"],
    image: "https://picsum.photos/400/300?random=11"
  },
  {
    id: 3,
    name: "MediCare Specialists",
    industry: "Medicine & Health",
    location: "Westlands, Nairobi",
    rating: 5.0,
    reviews: 210,
    tags: ["Cardiology", "Diagnostics"],
    image: "https://picsum.photos/400/300?random=12"
  },
  {
    id: 4,
    name: "BuildRight Architects",
    industry: "Architecture",
    location: "Kilimani, Nairobi",
    rating: 4.7,
    reviews: 56,
    tags: ["Residential", "Commercial"],
    image: "https://picsum.photos/400/300?random=13"
  }
];

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  const filteredBusinesses = MOCK_BUSINESSES.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          biz.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'All' || biz.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Search Header */}
      <div className="pt-24 pb-12 bg-voxa-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">Explore Excellence</h1>
          
          <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-lg max-w-4xl shadow-xl">
             <div className="flex-grow flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200">
               <Search className="text-gray-400 w-5 h-5 mr-3" />
               <input 
                 type="text" 
                 placeholder="Search for businesses, services, or tags..." 
                 className="w-full h-12 outline-none text-slate-800 placeholder:text-gray-400"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
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
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
                <Filter className="w-4 h-4" /> Filters
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Industry</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="industry" 
                    checked={selectedIndustry === 'All'}
                    onChange={() => setSelectedIndustry('All')}
                    className="text-voxa-gold focus:ring-voxa-gold"
                  />
                  <span className="text-slate-700">All Industries</span>
                </label>
                {INDUSTRIES.map(ind => (
                  <label key={ind.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="industry" 
                      checked={selectedIndustry === ind.name}
                      onChange={() => setSelectedIndustry(ind.name)}
                      className="text-voxa-gold focus:ring-voxa-gold"
                    />
                    <span className="text-slate-700">{ind.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-grow">
            <div className="mb-4 text-slate-500 text-sm">
              Showing {filteredBusinesses.length} premium results
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBusinesses.map((biz) => (
                <div key={biz.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-48 overflow-hidden relative">
                     <img src={biz.image} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold text-slate-900 shadow-sm">
                       Verified
                     </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold text-voxa-gold uppercase tracking-wide">{biz.industry}</div>
                      <div className="flex items-center gap-1 text-slate-700 text-sm font-medium">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {biz.rating} ({biz.reviews})
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{biz.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                      <MapPin className="w-3 h-3" /> {biz.location}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {biz.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
                <p className="text-slate-500 text-lg">No businesses found matching your criteria.</p>
                <button 
                  className="mt-4 text-voxa-gold font-medium hover:underline"
                  onClick={() => {setSearchTerm(''); setSelectedIndustry('All');}}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExplorePage;