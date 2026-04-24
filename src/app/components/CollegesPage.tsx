// src/app/components/CollegesPage.tsx

import { Helmet } from 'react-helmet-async';
import { MapPin, Star, Users, ArrowRight, Search, TrendingUp, Filter, X, Sparkles, ChevronDown, GraduationCap, Briefcase, Laptop, Scale, Heart, Microscope, IndianRupee, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CollegeDetailModal } from './CollegeDetailModal';
import { Login } from './Login';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface College {
  id: string;
  name: string;
  fullName: string;
  location: string;
  rating: number;
  students: string;
  type: string;
  image: string;
  nirfRank?: string;
  courses?: string[];
  highestPackage?: string;
  placementRate?: string;
  fees?: string;
  admissionOpen?: boolean;
  description?: string;
  facilities?: string[];
  accreditation?: string[];
}

const UG_COURSES = [
  { label: 'BBA', icon: Briefcase },
  { label: 'BCA', icon: Laptop },
  { label: 'B.Tech', icon: GraduationCap },
  { label: 'B.Com', icon: Scale },
  { label: 'Law', icon: Scale },
  { label: 'Nursing', icon: Heart },
  { label: 'Pharmacy', icon: Microscope }
];

const PG_COURSES = [
  { label: 'MBA', icon: Briefcase },
  { label: 'MCA', icon: Laptop },
  { label: 'M.Tech', icon: GraduationCap },
  { label: 'LLM', icon: Scale },
  { label: 'M.Sc', icon: Microscope },
  { label: 'M.Pharm', icon: Microscope }
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating-high', label: 'Rating: High to Low' },
  { value: 'fees-low', label: 'Fees: Low to High' },
  { value: 'package-high', label: 'Package: High to Low' }
];

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
    <div className="h-48 bg-gray-300" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 bg-gray-300 rounded-full w-16" />
        <div className="h-6 bg-gray-300 rounded-full w-20" />
      </div>
    </div>
  </div>
);

// Helper function to convert Firebase college data to modal format
const formatCollegeForModal = (college: College) => {
  return {
    id: college.id,
    name: college.name,
    location: college.location,
    rating: college.rating,
    reviews: 1250,
    established: '2000',
    about: college.description || `${college.name} is a premier educational institution in Greater Noida offering diverse programs. With state-of-the-art infrastructure, experienced faculty, and strong industry connections, the institution has consistently delivered excellent academic results and placements.`,
    facts: [
      `The university has all the accreditations and recognitions for providing quality education: UGC-DEB, AICTE, NIRF, ISO, AIU, ACU, WES and more.`,
      `${college.name} is a NAAC rated A+ institution with a grade point of 3.64.`,
      `Multi-faceted learning support features such as e-learning toolkit, self-evaluation kits, case studies, university LMS, digital libraries etc.`
    ],
    courses: college.courses || [],
    feePerSemester: college.fees?.split('-')[0] || 'Contact for details',
    highestPackage: college.highestPackage || 'Contact for details',
    averagePackage: college.placementRate ? `₹${Math.floor(parseInt(college.highestPackage?.replace(/[^0-9]/g, '') || '500000') * 0.4 / 100000)} LPA` : 'Contact for details',
    topRecruiters: ['Amazon', 'TCS', 'Microsoft', 'Deloitte', 'HDFC Bank', 'Wipro', 'Infosys', 'Samsung'],
    facilities: college.facilities || ['Smart Classrooms', 'Advanced Labs', 'Digital Library', 'Hostel', 'Sports Complex', 'Wi-Fi Campus', 'Auditorium', 'Cafeteria'],
    accreditation: college.accreditation || ['AICTE', 'NBA', 'NAAC A+'],
    lastMonthStudents: Math.floor(Math.random() * (60000 - 10000) + 10000),
    hostelFee: '₹1,10,000 - ₹1,45,000/year'
  };
};

export function CollegesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [pendingCollege, setPendingCollege] = useState<College | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    ugCourses: true,
    pgCourses: true
  });

  // ✅ Fetch colleges from Firebase
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setIsLoading(true);
    try {
      const collegesRef = collection(db, 'colleges');
      const snapshot = await getDocs(collegesRef);
      const collegesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as College[];
      setColleges(collegesData);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const course = searchParams.get('course');
    if (course) {
      const formattedCourse = course.toUpperCase();
      setSelectedCourse(formattedCourse);
    }
  }, [searchParams]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      const matchesCourse = selectedCourse
        ? college.courses?.some(c => c.toLowerCase().includes(selectedCourse.toLowerCase()))
        : true;

      const matchesSearch = searchTerm === '' ||
        college.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCourse && matchesSearch;
    });
  }, [selectedCourse, searchTerm, colleges]);

  const sortedColleges = useMemo(() => {
    const sorted = [...filteredColleges];
    switch (sortBy) {
      case 'rating-high':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'fees-low':
        return sorted.sort((a, b) => {
          const aNum = parseInt(a.fees?.replace(/[^0-9]/g, '') || '999999');
          const bNum = parseInt(b.fees?.replace(/[^0-9]/g, '') || '999999');
          return aNum - bNum;
        });
      case 'package-high':
        return sorted.sort((a, b) => {
          const aNum = parseInt(a.highestPackage?.replace(/[^0-9]/g, '') || '0');
          const bNum = parseInt(b.highestPackage?.replace(/[^0-9]/g, '') || '0');
          return bNum - aNum;
        });
      default:
        return sorted;
    }
  }, [filteredColleges, sortBy]);

  const handleCourseSelect = useCallback((course: string) => {
    const newSelected = selectedCourse === course ? '' : course;
    setSelectedCourse(newSelected);
    setSearchParams(newSelected ? { course: newSelected.toLowerCase() } : {});
  }, [selectedCourse, setSearchParams]);

  // ✅ College Click Handler - Opens Login Popup if not logged in
  const handleCollegeClick = useCallback((college: College) => {
    if (!user) {
      setPendingCollege(college);
      setIsLoginOpen(true);
      return;
    }
    const modalData = formatCollegeForModal(college);
    setSelectedCollege(modalData);
    setIsModalOpen(true);
  }, [user]);

  // ✅ Handle login success - open pending college modal
  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    if (pendingCollege) {
      const modalData = formatCollegeForModal(pendingCollege);
      setSelectedCollege(modalData);
      setIsModalOpen(true);
      setPendingCollege(null);
    }
  };

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCourse('');
    setSortBy('relevance');
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <>
      <Helmet>
        <title>{`${colleges.length}+ Top Colleges in Greater Noida 2026 | Dreamz College`}</title>
        <meta name="description" content={`Explore ${colleges.length}+ top colleges in Greater Noida. Compare fees, placements, and get free counseling!`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        
        <div className="relative w-full h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden">
          <img
            src="./collegebanner/banner1.png"
            alt="Dreamz College Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
          
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  🎓 Top Colleges in Greater Noida 2026
                </h1>
                <p className="text-sm text-gray-600">
                  Compare fees, placements, and choose your dream college
                </p>
                {selectedCourse && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm">
                    <CheckSquare className="w-4 h-4" />
                    <span>Filtered by: <strong>{selectedCourse}</strong></span>
                    <button onClick={() => handleCourseSelect(selectedCourse)} className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{colleges.length}+</div>
                  <div className="text-xs text-gray-500">Colleges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-xs text-gray-500">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹1.37Cr</div>
                  <div className="text-xs text-gray-500">Highest Package</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Filters Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-4">
                
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200"
                >
                  <span className="font-medium text-gray-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-purple-600" />
                    Filters & Search
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                </button>

                <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search college or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection('ugCourses')}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-purple-600" />
                        UG Courses
                      </h3>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.ugCourses ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedSections.ugCourses && (
                      <div className="px-3 pb-4 space-y-0.5">
                        {UG_COURSES.map((course) => {
                          const Icon = course.icon;
                          const isSelected = selectedCourse === course.label;
                          return (
                            <button
                              key={course.label}
                              onClick={() => handleCourseSelect(course.label)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                isSelected
                                  ? 'bg-purple-50 border border-purple-200'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-gray-500'}`} />
                              <span className={`text-sm ${isSelected ? 'font-medium text-purple-700' : ''}`}>
                                {course.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection('pgCourses')}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        PG Courses
                      </h3>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.pgCourses ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedSections.pgCourses && (
                      <div className="px-3 pb-4 space-y-0.5">
                        {PG_COURSES.map((course) => {
                          const Icon = course.icon;
                          const isSelected = selectedCourse === course.label;
                          return (
                            <button
                              key={course.label}
                              onClick={() => handleCourseSelect(course.label)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                isSelected
                                  ? 'bg-blue-50 border border-blue-200'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                              <span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : ''}`}>
                                {course.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {(searchTerm || selectedCourse) && (
                    <button
                      onClick={clearAllFilters}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2.5 rounded-lg font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </button>
                  )}

                </div>
              </div>
            </div>

            {/* Colleges Grid */}
            <div className="flex-1">
              
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{sortedColleges.length}</span> colleges
                </p>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <>
                  {sortedColleges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      <AnimatePresence mode="wait">
                        {sortedColleges.map((college, index) => (
                          <motion.div
                            key={college.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ y: -4 }}
                            onClick={() => handleCollegeClick(college)}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                          >
                            <div className="relative h-44 overflow-hidden">
                              <img
                                src={college.image}
                                alt={college.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800';
                                }}
                              />
                              {college.nirfRank && (
                                <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  NIRF {college.nirfRank}
                                </div>
                              )}
                              {college.admissionOpen && (
                                <div className="absolute top-3 right-3">
                                  <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    OPEN
                                  </motion.div>
                                </div>
                              )}
                            </div>

                            <div className="p-4">
                              <h3 className="text-lg font-semibold text-gray-900 mb-0.5 line-clamp-1">{college.name}</h3>
                              <p className="text-xs text-gray-500 mb-2 line-clamp-1">{college.fullName}</p>
                              
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <MapPin className="w-3 h-3 text-purple-500" />
                                <span className="line-clamp-1">{college.location}</span>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                  {college.rating}
                                </span>
                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                                  {college.type}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {college.highestPackage && (
                                  <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    {college.highestPackage}
                                  </span>
                                )}
                                {college.placementRate && (
                                  <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                                    <Users className="w-3 h-3" />
                                    {college.placementRate}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1 mb-3">
                                {college.courses?.slice(0, 3).map((course, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    {course.length > 12 ? course.substring(0, 12) + '...' : course}
                                  </span>
                                ))}
                                {college.courses && college.courses.length > 3 && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                                    +{college.courses.length - 3}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <IndianRupee className="w-3 h-3" />
                                  {college.fees?.split('-')[0] || 'Contact for fee'}
                                </span>
                                <span className="text-purple-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                  View Details <ArrowRight className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16 bg-white rounded-xl"
                    >
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No colleges found</p>
                      <button onClick={clearAllFilters} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Clear All Filters
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* College Detail Modal */}
      <CollegeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        college={selectedCollege}
      />

      {/* Login Modal */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setPendingCollege(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}