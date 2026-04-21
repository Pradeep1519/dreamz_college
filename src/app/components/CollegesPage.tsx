// src/app/components/CollegesPage.tsx

import { Helmet } from 'react-helmet-async';
import { MapPin, Star, Users, ArrowRight, Search, TrendingUp, Filter, X, Sparkles, ChevronDown, GraduationCap, Briefcase, Laptop, Scale, Heart, Microscope, IndianRupee, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CollegeDetailModal } from './CollegeDetailModal';
import { Login } from './Login';

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
}

export const colleges: College[] = [
  {
    id: 'gn-group',
    name: 'GN Group of Institutions',
    fullName: 'Greater Noida Institute of Technology, Management, Pharmacy & Law',
    location: 'Knowledge Park II & III, Greater Noida',
    rating: 4.3,
    students: '6,500+',
    type: 'Multi-Discipline',
    image: 'college-img/GNGroup/Gngrp1.jpeg',
    nirfRank: 'Top 200',
    courses: ['B.Tech', 'MBA', 'PGDM', 'BBA', 'BCA', 'B.Com', 'B.Pharm', 'D.Pharm', 'LL.B'],
    highestPackage: '₹14 LPA',
    placementRate: '90%',
    fees: '₹31,000 - ₹1.57L/semester',
    admissionOpen: true
  },
  {
    id: 'mangalmay',
    name: 'Mangalmay Group of Institutions',
    fullName: 'Mangalmay Institute of Management & Technology',
    location: 'Knowledge Park II, Greater Noida',
    rating: 4.5,
    students: '5,500+',
    type: 'Multi-Discipline',
    image: 'college-img/Mangalmay/m3.jpg',
    nirfRank: 'Top 150',
    courses: ['B.Tech CSE', 'B.Tech (AI/DS)', 'MBA++', 'BBA', 'BCA', 'B.Pharm', 'B.A.B.Ed'],
    highestPackage: '₹25 LPA',
    placementRate: '92%',
    fees: '₹55,000 - ₹2.62L/year',
    admissionOpen: true
  },
  {
    id: 'sharda-university',
    name: 'Sharda University',
    fullName: 'Sharda University',
    location: 'Knowledge Park III, Greater Noida',
    rating: 4.3,
    students: '12,000+',
    type: 'Multi-Discipline',
    image: 'college-img/Sharda/sh1.jpeg',
    nirfRank: '78',
    courses: ['B.Tech', 'MBA', 'MBBS', 'BBA', 'BCA', 'B.Pharm', 'LL.B', 'B.Sc Nursing'],
    highestPackage: '₹42 LPA',
    placementRate: '88%',
    fees: '₹1.8 - 3.5 Lakhs/year',
    admissionOpen: true
  },
  {
    id: 'galgotias-university',
    name: 'Galgotias University',
    fullName: 'Galgotias University',
    location: 'Yamuna Expressway, Greater Noida',
    rating: 4.2,
    students: '15,000+',
    type: 'Multi-Discipline',
    image: 'college-img/Galgotias/gu1.jpeg',
    nirfRank: '151-200',
    courses: ['B.Tech', 'MBA', 'BCA', 'BBA', 'LL.B', 'B.Pharm'],
    highestPackage: '₹39 LPA',
    placementRate: '85%',
    fees: '₹1.2 - 2.2 Lakhs/year',
    admissionOpen: true
  },
  {
    id: 'niet',
    name: 'NIET',
    fullName: 'Noida Institute of Engineering & Technology',
    location: 'Knowledge Park II, Greater Noida',
    rating: 4.4,
    students: '5,000+',
    type: 'Multi-Discipline',
    image: 'college-img/NIET/n1.webp',
    nirfRank: '101-150',
    courses: ['B.Tech', 'MBA', 'B.Pharm', 'D.Pharm', 'BCA', 'BBA'],
    highestPackage: '₹47 LPA',
    placementRate: '92%',
    fees: '₹1.2 - 2.5 Lakhs/year',
    admissionOpen: true
  },
  {
    id: 'gl-bajaj',
    name: 'GL Bajaj',
    fullName: 'GL Bajaj Institute of Technology & Management',
    location: 'Knowledge Park III, Greater Noida',
    rating: 4.1,
    students: '3,500+',
    type: 'Engineering',
    image: 'college-img/GLBajaj/gl1.jpg',
    nirfRank: '151',
    courses: ['B.Tech', 'MBA', 'MCA'],
    highestPackage: '₹44 LPA',
    placementRate: '90%',
    fees: '₹1.1 - 1.8 Lakhs/year',
    admissionOpen: true
  },
  {
    id: 'iimt-group',
    name: 'IIMT Group',
    fullName: 'IIMT Group of Colleges',
    location: 'Knowledge Park I, Greater Noida',
    rating: 4.0,
    students: '4,000+',
    type: 'Multi-Discipline',
    image: 'college-img/IIMT/iimt5.png',
    nirfRank: 'Top 200',
    courses: ['B.Tech', 'MBA', 'BCA', 'BBA', 'B.Pharm', 'D.Pharm', 'LL.B'],
    highestPackage: '₹32 LPA',
    placementRate: '82%',
    fees: '₹48,000 - ₹8.6 Lakhs/year',
    admissionOpen: true
  },
  {
    id: 'lloyd',
    name: 'Lloyd Institute',
    fullName: 'Lloyd Institute of Engineering & Technology',
    location: 'Knowledge Park II, Greater Noida',
    rating: 4.0,
    students: '2,500+',
    type: 'Engineering',
    image: 'college-img/Lloyd/l2.webp',
    courses: ['B.Tech', 'MBA', 'MCA'],
    highestPackage: '₹28 LPA',
    placementRate: '80%',
    fees: '₹2.45 - ₹9.46 Lakhs/year',
    admissionOpen: true
  },
  {
    id: 'its-engineering',
    name: 'ITS Engineering',
    fullName: 'ITS Engineering College',
    location: '46, Knowledge Park III, Greater Noida',
    rating: 4.2,
    students: '3,000+',
    type: 'Engineering',
    image: 'college-img/ITS/i1.webp',
    nirfRank: 'Top 200',
    courses: ['B.Tech', 'B.Tech (LEET)', 'MBA', 'BCA'],
    highestPackage: '₹45 LPA',
    placementRate: '85%',
    fees: '₹4.24 - 10.60 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'bennett-university',
    name: 'Bennett University',
    fullName: 'Bennett University',
    location: 'Tech Zone II, Greater Noida',
    rating: 4.3,
    students: '4,500+',
    type: 'Multi-Discipline',
    image: 'college-img/Bennett/bb4.png',
    nirfRank: 'Top 100',
    courses: ['B.Tech', 'MBA', 'BBA', 'BCA', 'LL.B', 'B.Com'],
    highestPackage: '₹54 LPA',
    placementRate: '94%',
    fees: '₹15.0 Lakhs/year',
    admissionOpen: true
  },
  {
    id: 'jims-noida',
    name: 'JIMS',
    fullName: 'Jagannath Institute of Management Sciences',
    location: 'Noida, Uttar Pradesh',
    rating: 4.25,
    students: '3,000+',
    type: 'Multi-Discipline',
    image: 'college-img/JIMS/j1.avif',
    courses: ['BBA', 'BCA', 'MBA', 'MCA', 'B.Com'],
    highestPackage: '₹12 LPA',
    placementRate: '85%',
    fees: '₹4.5 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'amity-greater-noida',
    name: 'Amity University',
    fullName: 'Amity University Greater Noida Campus',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 4.2,
    students: '10,000+',
    type: 'Multi-Discipline',
    image: 'college-img/amity-uni/am8.jpg',
    nirfRank: '35',
    courses: ['B.Tech', 'MBA', 'BBA', 'BCA', 'LL.B', 'B.Arch'],
    highestPackage: '₹47 LPA',
    placementRate: '92%',
    fees: '₹10.0 Lakhs/year',
    admissionOpen: true
  },
  {
    id: 'metro-college',
    name: 'Metro College',
    fullName: 'Metro College of Health Sciences and Research',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 4.0,
    students: '1,500+',
    type: 'Medical',
    image: 'college-img/metro-college/m1.jpg',
    courses: ['B.Sc Nursing', 'B.Pharm', 'D.Pharm', 'BPT', 'MLT'],
    highestPackage: '₹6 LPA',
    placementRate: '80%',
    fees: '₹3.8 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'ishan-educational',
    name: 'Ishan Educational',
    fullName: 'Ishan Educational Institutions',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 3.8,
    students: '2,000+',
    type: 'Multi-Discipline',
    image: 'college-img/ishan/i1.jpeg',
    courses: ['B.Tech', 'MBA', 'BBA', 'BCA', 'B.Pharm'],
    highestPackage: '₹8 LPA',
    placementRate: '75%',
    fees: '₹2.5 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'global-institute',
    name: 'Global Institute',
    fullName: 'Global Institute of Information Technology',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 3.55,
    students: '1,200+',
    type: 'IT & Computer',
    image: 'college-img/global/g2.jpeg',
    courses: ['BCA', 'MCA', 'B.Tech IT'],
    highestPackage: '₹7 LPA',
    placementRate: '75%',
    fees: '₹2.0 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'himt-college',
    name: 'HIMT College',
    fullName: 'HIMT College',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 3.75,
    students: '1,000+',
    type: 'Multi-Discipline',
    image: 'college-img/himt/h2.avif',
    courses: ['BBA', 'BCA', 'B.Com'],
    highestPackage: '₹5 LPA',
    placementRate: '70%',
    fees: '₹2.2 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'noida-international-university',
    name: 'Noida International University',
    fullName: 'Noida International University',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 4.0,
    students: '8,000+',
    type: 'Multi-Discipline',
    image: 'college-img/niu/n1.jpg',
    courses: ['B.Tech', 'MBA', 'BBA', 'BCA', 'LL.B', 'B.Pharm', 'B.Sc Nursing'],
    highestPackage: '₹25 LPA',
    placementRate: '85%',
    fees: '₹5.0 Lakhs/year',
    admissionOpen: true
  },
  {
    id: 'innovative-group',
    name: 'Innovative Group',
    fullName: 'Innovative Group of Colleges',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 3.65,
    students: '2,500+',
    type: 'Multi-Discipline',
    image: 'college-img/innovative/in4.jpg',
    courses: ['B.Tech', 'MBA', 'BCA', 'BBA'],
    highestPackage: '₹7 LPA',
    placementRate: '70%',
    fees: '₹3.0 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'nimt-college',
    name: 'NIMT College',
    fullName: 'NIMT College',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 3.8,
    students: '1,800+',
    type: 'Multi-Discipline',
    image: 'college-img/nimt/ni1.png',
    courses: ['B.Tech', 'MBA', 'BBA', 'BCA'],
    highestPackage: '₹6 LPA',
    placementRate: '70%',
    fees: '₹3.0 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'dronacharya',
    name: 'Dronacharya Group',
    fullName: 'Dronacharya Group of Institutions',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 3.85,
    students: '3,000+',
    type: 'Engineering',
    image: 'college-img/dronacharya/d5.jpeg',
    courses: ['B.Tech', 'MBA', 'MCA'],
    highestPackage: '₹10 LPA',
    placementRate: '80%',
    fees: '₹3.8 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'ram-eesh-institute',
    name: 'Ram-Eesh Institute',
    fullName: 'Ram-Eesh Institute',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 3.75,
    students: '1,500+',
    type: 'Multi-Discipline',
    image: 'college-img/ram-ese/r3.webp',
    courses: ['BBA', 'BCA', 'B.Com'],
    highestPackage: '₹5 LPA',
    placementRate: '70%',
    fees: '₹3.2 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'gniot',
    name: 'GNIOT Group',
    fullName: 'GNIOT Group of Institutions',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 4.05,
    students: '4,500+',
    type: 'Multi-Discipline',
    image: 'college-img/gniot/g5.jpg',
    courses: ['B.Tech', 'MBA', 'BCA', 'BBA'],
    highestPackage: '₹12 LPA',
    placementRate: '85%',
    fees: '₹4.8 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'accurate-institute',
    name: 'Accurate Institute',
    fullName: 'Accurate Institute of Management and Technology',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 3.9,
    students: '2,200+',
    type: 'Multi-Discipline',
    image: 'college-img/accurate/a8.jpg',
    courses: ['B.Tech', 'MBA', 'BCA', 'BBA'],
    highestPackage: '₹10 LPA',
    placementRate: '82%',
    fees: '₹4.5 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'kcc-institute',
    name: 'KCC Institute',
    fullName: 'KCC Institute of Technology & Management',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 4.0,
    students: '2,500+',
    type: 'Multi-Discipline',
    image: 'college-img/kcc/k7.webp',
    courses: ['B.Tech', 'MBA', 'BCA', 'BBA'],
    highestPackage: '₹9 LPA',
    placementRate: '80%',
    fees: '₹4.0 Lakhs (Total)',
    admissionOpen: true
  },
  {
    id: 'united-college-of-education',
    name: 'United College',
    fullName: 'United College of Education',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 3.95,
    students: '1,200+',
    type: 'Education',
    image: 'college-img/united/u6.webp',
    courses: ['B.Ed', 'D.El.Ed', 'B.A.B.Ed'],
    highestPackage: '₹4.5 LPA',
    placementRate: '85%',
    fees: '₹3.5 Lakhs (Total)',
    admissionOpen: true
  }
];

// Helper function to convert college data to modal format
const formatCollegeForModal = (college: College) => {
  return {
    id: college.id,
    name: college.name,
    location: college.location,
    rating: college.rating,
    reviews: 1250,
    established: '2000',
    about: `${college.name} is a premier educational institution in Greater Noida offering diverse programs. With state-of-the-art infrastructure, experienced faculty, and strong industry connections, the institution has consistently delivered excellent academic results and placements.`,
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
    facilities: ['Smart Classrooms', 'Advanced Labs', 'Digital Library', 'Hostel', 'Sports Complex', 'Wi-Fi Campus', 'Auditorium', 'Cafeteria'],
    accreditation: ['AICTE', 'NBA', 'NAAC A+'],
    lastMonthStudents: Math.floor(Math.random() * (60000 - 10000) + 10000),
    hostelFee: '₹1,10,000 - ₹1,45,000/year'
  };
};

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

export function CollegesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

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
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCourse && matchesSearch;
    });
  }, [selectedCourse, searchTerm]);

  const sortedColleges = useMemo(() => {
    const sorted = [...filteredColleges];
    switch (sortBy) {
      case 'rating-high':
        return sorted.sort((a, b) => b.rating - a.rating);
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

  // ✅ FIXED: College Click Handler - Opens Login Popup if not logged in
  const handleCollegeClick = useCallback((college: College) => {
    if (!user) {
      // Save the college for later
      setPendingCollege(college);
      setIsLoginOpen(true);
      return;
    }
    // User is logged in - Open college modal
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
                                  {college.fees?.split('-')[0]}
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

      {/* ✅ College Detail Modal */}
      <CollegeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        college={selectedCollege}
      />

      {/* ✅ Login Modal - Opens when user clicks on college without login */}
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