import { Helmet } from 'react-helmet-async';
import { MapPin, Star, Users, Award, ArrowRight, Search, TrendingUp, DollarSign, Sparkles, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import colleges data

interface EngineeringCollege extends College {
  isEngineering: boolean;
}

export function EngineeringCollegesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Filter only engineering colleges
  const engineeringColleges = colleges.filter(college => {
    const isEng = college.courses?.some(course => 
      course.includes('B.Tech') || 
      course.includes('Engineering') || 
      course.includes('CSE') ||
      course.includes('AI') ||
      course.includes('Data Science') ||
      course.includes('Mechanical') ||
      course.includes('Civil') ||
      course.includes('Electrical')
    ) || college.type === 'Engineering';
    return isEng;
  });

  // Filter by search term
  let filteredColleges = engineeringColleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort colleges
  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredColleges];
    
    switch(value) {
      case 'rating-high':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'fees-low':
        sorted.sort((a, b) => {
          const aNum = parseInt(a.fees?.replace(/[^0-9]/g, '') || '999999');
          const bNum = parseInt(b.fees?.replace(/[^0-9]/g, '') || '999999');
          return aNum - bNum;
        });
        break;
      case 'package-high':
        sorted.sort((a, b) => {
          const aNum = parseInt(a.highestPackage?.replace(/[^0-9]/g, '') || '0');
          const bNum = parseInt(b.highestPackage?.replace(/[^0-9]/g, '') || '0');
          return bNum - aNum;
        });
        break;
      default:
        break;
    }
    
    filteredColleges = sorted;
  };

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('relevance');
  };

  // Get top colleges by rating
  const topColleges = [...engineeringColleges].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <>
      <Helmet>
        <title>Top 15+ Engineering Colleges in Greater Noida 2026 - Fees, Placements, Ranking | Dreamz College</title>
        <meta name="description" content="Explore top engineering colleges in Greater Noida 2026. Compare fees, placements, cutoff, rankings. Find best B.Tech colleges for CSE, AI, Data Science, Mechanical. Get free counseling!" />
        <meta name="keywords" content="engineering colleges in greater noida, btech colleges in noida, top engineering colleges greater noida, best engineering colleges in up, private engineering colleges noida" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="pt-20 pb-16">
          {/* Header Section */}
          <div className="text-center max-w-4xl mx-auto px-4 mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
            >
              <Award className="w-4 h-4" />
              Top Engineering Colleges 2026
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            >
              Best <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Engineering Colleges</span> in Greater Noida
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Find the best B.Tech colleges in Greater Noida. Compare fees, placements, rankings, and choose your dream engineering college.
            </motion.p>
          </div>

          {/* Stats Section */}
          <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <div className="text-2xl font-bold text-purple-600">{engineeringColleges.length}+</div>
                <div className="text-xs text-gray-500">Engineering Colleges</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-xs text-gray-500">B.Tech Programs</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <div className="text-2xl font-bold text-green-600">₹47 LPA</div>
                <div className="text-xs text-gray-500">Highest Package</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <div className="text-2xl font-bold text-orange-600">92%</div>
                <div className="text-xs text-gray-500">Avg Placement Rate</div>
              </div>
            </div>
          </div>

          {/* Top Colleges Section */}
          <div className="max-w-6xl mx-auto px-4 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Top 5 Engineering Colleges in Greater Noida
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topColleges.map((college, index) => (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => handleCollegeClick(college.id)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={college.image} 
                      alt={college.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      #{index + 1}
                    </div>
                    {college.nirfRank && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        NIRF {college.nirfRank}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{college.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{college.location.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {college.rating}
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {college.highestPackage}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{college.placementRate} Placement</span>
                      <span className="text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform">View Details →</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search engineering colleges by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Sort & Filter</span>
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl p-4 mt-3 shadow-md border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">Sort By</h3>
                    <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-full">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSortChange('relevance')}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${sortBy === 'relevance' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Relevance
                    </button>
                    <button
                      onClick={() => handleSortChange('rating-high')}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${sortBy === 'rating-high' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Rating: High to Low
                    </button>
                    <button
                      onClick={() => handleSortChange('package-high')}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${sortBy === 'package-high' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Package: High to Low
                    </button>
                    <button
                      onClick={() => handleSortChange('fees-low')}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${sortBy === 'fees-low' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Fees: Low to High
                    </button>
                  </div>
                  {(searchTerm || sortBy !== 'relevance') && (
                    <button onClick={clearFilters} className="mt-3 text-sm text-purple-600 hover:text-purple-700">
                      Clear All Filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Colleges List */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredColleges.length}</span> engineering colleges
              </p>
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="rating-high">Rating: High to Low</option>
                <option value="package-high">Package: High to Low</option>
                <option value="fees-low">Fees: Low to High</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college, index) => (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -4 }}
                  onClick={() => handleCollegeClick(college.id)}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={college.image} 
                      alt={college.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {college.admissionOpen && (
                      <div className="absolute top-3 left-3">
                        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                          <Sparkles className="w-3 h-3" />
                          <span>ADMISSIONS OPEN</span>
                        </div>
                      </div>
                    )}
                    {college.nirfRank && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        NIRF {college.nirfRank}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{college.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{college.fullName}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{college.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {college.rating}
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {college.highestPackage}
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                        <Users className="w-3 h-3" />
                        {college.placementRate}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {college.courses?.slice(0, 3).map((course, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">
                          {course.includes('B.Tech') ? course.split(' ').slice(0, 2).join(' ') : course}
                        </span>
                      ))}
                      {college.courses && college.courses.filter(c => c.includes('B.Tech')).length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{college.courses.filter(c => c.includes('B.Tech')).length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-end mt-3 text-purple-600 text-sm font-medium">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredColleges.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No engineering colleges found matching your search.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="max-w-6xl mx-auto px-4 mt-12">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Need Help Choosing the Right Engineering College?</h2>
              <p className="mb-4 opacity-90">Get free expert counseling from our career advisors</p>
              <Link
                to="/counseling"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Get Free Counseling
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto px-4 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Which is the best engineering college in Greater Noida?</h3>
                <p className="text-gray-600 text-sm">NIET, JSS Academy, and GN Group are among the top engineering colleges in Greater Noida with excellent placement records and NAAC A+ accreditation.</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">What is the average placement package for B.Tech in Greater Noida?</h3>
                <p className="text-gray-600 text-sm">The average placement package ranges from ₹4.5 LPA to ₹6.5 LPA, with top colleges like NIET and JSS Academy offering packages up to ₹47 LPA.</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">What is the fee structure for B.Tech in Greater Noida?</h3>
                <p className="text-gray-600 text-sm">B.Tech fees range from ₹1.2 Lakhs to ₹7.2 Lakhs per year depending on the college and specialization. GN Group and Mangalmay offer affordable options.</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Which B.Tech specialization has the highest placement?</h3>
                <p className="text-gray-600 text-sm">Computer Science Engineering (CSE) and Artificial Intelligence (AI) specializations have the highest placement rates, with top recruiters like Google, Microsoft, and Amazon.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}