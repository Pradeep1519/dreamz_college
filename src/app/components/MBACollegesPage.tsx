import { Helmet } from 'react-helmet-async';
import { MapPin, Star, Users, Award, ArrowRight, Search, TrendingUp, DollarSign, Sparkles, Filter, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function MBACollegesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Filter only MBA colleges
  const mbaColleges = colleges.filter(college => {
    const hasMBA = college.courses?.some(course => 
      course.includes('MBA') || course.includes('PGDM') || course.includes('Management')
    );
    return hasMBA;
  });

  let filteredColleges = mbaColleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredColleges];
    switch(value) {
      case 'rating-high': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'package-high':
        sorted.sort((a, b) => {
          const aNum = parseInt(a.highestPackage?.replace(/[^0-9]/g, '') || '0');
          const bNum = parseInt(b.highestPackage?.replace(/[^0-9]/g, '') || '0');
          return bNum - aNum;
        });
        break;
      case 'fees-low':
        sorted.sort((a, b) => {
          const aNum = parseInt(a.fees?.replace(/[^0-9]/g, '') || '999999');
          const bNum = parseInt(b.fees?.replace(/[^0-9]/g, '') || '999999');
          return aNum - bNum;
        });
        break;
      default: break;
    }
    filteredColleges = sorted;
  };

  const handleCollegeClick = (collegeId: string) => navigate(`/college/${collegeId}`);
  const clearFilters = () => { setSearchTerm(''); setSortBy('relevance'); };

  const topColleges = [...mbaColleges].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <>
      <Helmet>
        <title>Top MBA Colleges in Noida 2026 - Fees, Placements, Ranking | Dreamz College</title>
        <meta name="description" content="Explore top MBA colleges in Noida & Greater Noida 2026. Compare fees, placements, rankings. Find best B-School for your management career. Get free counseling!" />
        <meta name="keywords" content="mba colleges in noida, best mba colleges in noida, pgdm colleges in noida, top b-schools in delhi ncr, mba admission 2026" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="pt-20 pb-16">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto px-4 mb-12">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              <Award className="w-4 h-4" /> Top MBA Colleges 2026
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Best <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">MBA Colleges</span> in Noida
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the best B-Schools in Noida & Greater Noida. Compare fees, placements, specializations, and choose your dream MBA college.
            </motion.p>
          </div>

          {/* Stats */}
          <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-md text-center"><div className="text-2xl font-bold text-purple-600">{mbaColleges.length}+</div><div className="text-xs text-gray-500">MBA Colleges</div></div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center"><div className="text-2xl font-bold text-blue-600">15+</div><div className="text-xs text-gray-500">Specializations</div></div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center"><div className="text-2xl font-bold text-green-600">₹25 LPA</div><div className="text-xs text-gray-500">Highest Package</div></div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center"><div className="text-2xl font-bold text-orange-600">92%</div><div className="text-xs text-gray-500">Avg Placement</div></div>
            </div>
          </div>

          {/* Top Colleges */}
          <div className="max-w-6xl mx-auto px-4 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" /> Top 5 MBA Colleges in Noida</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topColleges.map((college, index) => (
                <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -4 }} onClick={() => handleCollegeClick(college.id)} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">#{index + 1}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{college.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2"><MapPin className="w-3 h-3" /><span>{college.location.split(',')[0]}</span></div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{college.rating}</span>
                      <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3" />{college.highestPackage}</span>
                    </div>
                    <div className="flex justify-between items-center"><span className="text-xs text-gray-500">{college.placementRate} Placement</span><span className="text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform">View Details →</span></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search MBA colleges..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white" /></div>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"><Filter className="w-4 h-4" /><span>Sort</span></button>
            </div>
            <AnimatePresence>{showFilters && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-xl p-4 mt-3 shadow-md"><div className="flex justify-between items-center mb-3"><h3 className="font-semibold">Sort By</h3><button onClick={() => setShowFilters(false)}><X className="w-4 h-4" /></button></div><div className="flex flex-wrap gap-2">
              <button onClick={() => handleSortChange('relevance')} className={`px-3 py-1.5 rounded-full text-sm ${sortBy === 'relevance' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Relevance</button>
              <button onClick={() => handleSortChange('rating-high')} className={`px-3 py-1.5 rounded-full text-sm ${sortBy === 'rating-high' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Rating: High to Low</button>
              <button onClick={() => handleSortChange('package-high')} className={`px-3 py-1.5 rounded-full text-sm ${sortBy === 'package-high' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Package: High to Low</button>
            </div></motion.div>)}</AnimatePresence>
          </div>

          {/* Colleges List */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-4"><p className="text-sm text-gray-600">Showing <span className="font-semibold">{filteredColleges.length}</span> MBA colleges</p>
              <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white"><option value="relevance">Sort by: Relevance</option><option value="rating-high">Rating: High to Low</option><option value="package-high">Package: High to Low</option></select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college, index) => (
                <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} whileHover={{ y: -4 }} onClick={() => handleCollegeClick(college.id)} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                  <div className="relative h-44 overflow-hidden"><img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{college.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3"><MapPin className="w-3 h-3" /><span>{college.location}</span></div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{college.rating}</span>
                      <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3" />{college.highestPackage}</span>
                    </div>
                    <div className="flex items-center justify-end text-purple-600 text-sm font-medium"><span>View Details</span><ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></div>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredColleges.length === 0 && (<div className="text-center py-12"><p className="text-gray-500">No MBA colleges found.</p><button onClick={clearFilters} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg">Clear Filters</button></div>)}
          </div>

          {/* CTA */}
          <div className="max-w-6xl mx-auto px-4 mt-12"><div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center"><h2 className="text-2xl md:text-3xl font-bold mb-2">Need Help Choosing the Right MBA College?</h2><p className="mb-4 opacity-90">Get free expert counseling from our career advisors</p><Link to="/counseling" className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">Get Free Counseling <ArrowRight className="w-4 h-4" /></Link></div></div>
        </div>
      </div>
    </>
  );
}