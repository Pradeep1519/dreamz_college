import { Helmet } from 'react-helmet-async';
import { MapPin, Star, Users, Award, ArrowRight, Search, TrendingUp, DollarSign, Sparkles, Filter, X, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { colleges } from './CollegesPage';

export function LowFeeCollegesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('fees-low');
  const [showFilters, setShowFilters] = useState(false);

  // Parse fee to number for sorting
  const getFeeNumber = (fee: string | undefined) => {
    if (!fee) return 999999;
    const num = parseInt(fee.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 999999 : num;
  };

  // Filter affordable colleges (less than ₹3 Lakhs per year)
  const affordableColleges = colleges.filter(college => {
    const feeNum = getFeeNumber(college.fees);
    return feeNum < 300000 && feeNum > 0;
  });

  let filteredColleges = affordableColleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredColleges];
    if (value === 'fees-low') sorted.sort((a, b) => getFeeNumber(a.fees) - getFeeNumber(b.fees));
    else if (value === 'rating-high') sorted.sort((a, b) => b.rating - a.rating);
    filteredColleges = sorted;
  };

  const handleCollegeClick = (collegeId: string) => navigate(`/college/${collegeId}`);
  const clearFilters = () => { setSearchTerm(''); setSortBy('fees-low'); };

  return (
    <>
      <Helmet>
        <title>Low Fee Colleges in Greater Noida 2026 - Affordable Education | Dreamz College</title>
        <meta name="description" content="Explore affordable low fee colleges in Greater Noida 2026. Find budget-friendly colleges with good placements. Get free counseling for admission!" />
        <meta name="keywords" content="low fee colleges in greater noida, affordable colleges in noida, budget colleges in up, cheap college admission" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto px-4 mb-12">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              <Wallet className="w-4 h-4" /> Affordable Colleges 2026
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Low Fee Colleges</span> in Greater Noida
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find affordable colleges with fees under ₹3 Lakhs per year. Quality education at budget-friendly prices.
            </motion.p>
          </div>

          <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-md text-center"><div className="text-2xl font-bold text-purple-600">{affordableColleges.length}+</div><div className="text-xs text-gray-500">Affordable Colleges</div></div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center"><div className="text-2xl font-bold text-blue-600">₹3L</div><div className="text-xs text-gray-500">Avg Fees/Year</div></div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center"><div className="text-2xl font-bold text-green-600">₹10 LPA</div><div className="text-xs text-gray-500">Highest Package</div></div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center"><div className="text-2xl font-bold text-orange-600">80%</div><div className="text-xs text-gray-500">Placement Rate</div></div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search affordable colleges..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white" /></div>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl"><Filter className="w-4 h-4" /><span>Sort</span></button>
            </div>
            <AnimatePresence>{showFilters && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-xl p-4 mt-3 shadow-md"><div className="flex justify-between items-center mb-3"><h3 className="font-semibold">Sort By</h3><button onClick={() => setShowFilters(false)}><X className="w-4 h-4" /></button></div><div className="flex flex-wrap gap-2">
              <button onClick={() => handleSortChange('fees-low')} className={`px-3 py-1.5 rounded-full text-sm ${sortBy === 'fees-low' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Fees: Low to High</button>
              <button onClick={() => handleSortChange('rating-high')} className={`px-3 py-1.5 rounded-full text-sm ${sortBy === 'rating-high' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Rating: High to Low</button>
            </div></motion.div>)}</AnimatePresence>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college, index) => (
                <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} whileHover={{ y: -4 }} onClick={() => handleCollegeClick(college.id)} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                  <div className="relative h-44 overflow-hidden"><img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{college.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3"><MapPin className="w-3 h-3" /><span>{college.location}</span></div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{college.rating}</span>
                      <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full"><DollarSign className="w-3 h-3" />{college.fees}</span>
                      {college.highestPackage && <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3" />{college.highestPackage}</span>}
                    </div>
                    <div className="flex justify-between items-center"><span className="text-xs text-gray-500">{college.placementRate || '75%'} Placement</span><span className="text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform">View Details →</span></div>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredColleges.length === 0 && (<div className="text-center py-12"><p className="text-gray-500">No affordable colleges found.</p><button onClick={clearFilters} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">Clear Filters</button></div>)}
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-12"><div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center"><h2 className="text-2xl md:text-3xl font-bold mb-2">Need Help Finding Affordable Colleges?</h2><p className="mb-4 opacity-90">Get free expert counseling from our career advisors</p><Link to="/counseling" className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">Get Free Counseling <ArrowRight className="w-4 h-4" /></Link></div></div>
        </div>
      </div>
    </>
  );
}