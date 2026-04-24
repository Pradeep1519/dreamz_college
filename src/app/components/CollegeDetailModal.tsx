// src/app/components/CollegeDetailModal.tsx

import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Users, Award, CheckCircle, Phone, MessageCircle, Rocket, BookOpen, Briefcase, Building, GraduationCap, MapPin, Calendar, TrendingUp, Shield, ChevronRight, Download, AlertCircle, Heart, HeartOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CourseDetailModal } from './CourseDetailModal';
import { ApplicationPopup } from './ApplicationPopup';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { saveCollege, removeSavedCollege, isCollegeSaved } from '../../lib/firebase';

interface CollegeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  college: any;
}

export function CollegeDetailModal({ isOpen, onClose, college }: CollegeDetailModalProps) {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('about');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isApplicationPopupOpen, setIsApplicationPopupOpen] = useState(false);
  const [appliedCoursesList, setAppliedCoursesList] = useState<string[]>([]);
  const [showAlreadyAppliedToast, setShowAlreadyAppliedToast] = useState(false);
  const [loadingApplied, setLoadingApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Courses from Firebase
  const [collegeCourses, setCollegeCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const userName = userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest';

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch courses for this college from Firebase
  const fetchCollegeCourses = async () => {
    if (!college?.id) return;
    
    setLoadingCourses(true);
    try {
      const coursesRef = collection(db, 'courses');
      const q = query(
        coursesRef,
        where('collegeId', '==', college.id),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCollegeCourses(courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch applied courses for this college
  const fetchAppliedCourses = async () => {
    if (!user?.uid || !college?.id) return;
    
    setLoadingApplied(true);
    try {
      const inquiriesRef = collection(db, 'inquiries');
      const q = query(
        inquiriesRef,
        where('userId', '==', user.uid),
        where('collegeId', '==', college.id)
      );
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map(doc => doc.data().course);
      setAppliedCoursesList(courses);
    } catch (err) {
      console.error('Error fetching applied courses:', err);
    } finally {
      setLoadingApplied(false);
    }
  };

  // Check if college is saved
  const checkIfSaved = async () => {
    if (!user?.uid || !college?.id) return;
    try {
      const saved = await isCollegeSaved(user.uid, college.id);
      setIsSaved(saved);
    } catch (err) {
      console.error('Error checking saved status:', err);
    }
  };

  // Handle save college
  const handleSaveCollege = async () => {
    if (!user?.uid) {
      showToast('Please login to save colleges', 'error');
      return;
    }
    
    setSavingLoading(true);
    try {
      if (isSaved) {
        const savedRef = collection(db, 'saved_colleges');
        const q = query(savedRef, where('userId', '==', user.uid), where('collegeId', '==', college.id));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          await removeSavedCollege(snapshot.docs[0].id);
          setIsSaved(false);
          showToast('College removed from saved list', 'success');
        }
      } else {
        await saveCollege(user.uid, {
          collegeId: college.id,
          collegeName: college.name,
          location: college.location,
          rating: college.rating,
          fee: college.fees?.split('-')[0] || 'Contact for details',
          image: college.image
        });
        setIsSaved(true);
        showToast('College saved successfully', 'success');
      }
    } catch (err) {
      console.error('Error saving college:', err);
      showToast('Failed to save college', 'error');
    }
    setSavingLoading(false);
  };

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    if (showAlreadyAppliedToast) {
      const timer = setTimeout(() => {
        setShowAlreadyAppliedToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlreadyAppliedToast]);

  // Call when modal opens
  useEffect(() => {
    if (isOpen && college?.id) {
      fetchCollegeCourses();
      if (user?.uid) {
        fetchAppliedCourses();
        checkIfSaved();
      }
    }
  }, [isOpen, college?.id, user?.uid]);

  if (!isOpen || !college) return null;

  // Get courses list for display
  const getCoursesList = () => {
    return collegeCourses.map(course => course.name);
  };

  // Handle course click
  const handleCourseClick = (courseName: string) => {
    const courseData = collegeCourses.find(c => c.name === courseName);
    if (courseData) {
      setSelectedCourse(courseData);
      setIsCourseModalOpen(true);
    }
  };

  const handleApplyNow = () => {
    setIsApplicationPopupOpen(true);
  };

  const handleChatWithExpert = () => {
    const message = `👋 Hello! I'm interested in ${college.name}. Can you guide me about admission process?`;
    window.open(`https://wa.me/918796033021?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadBrochure = () => {
    const link = document.createElement('a');
    const fileName = `${college.id}-brochure.pdf`;
    link.href = `/brochures/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return 'Contact for details';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Get duration in years
  const getDurationYears = (duration: string) => {
    if (!duration) return 4;
    const match = duration.match(/\d+/);
    return match ? parseInt(match[0]) : 4;
  };

  // Generate fee structure from years
  const generateFeeStructure = (course: any) => {
    // If feeStructure already exists in database, use it
    if (course.feeStructure && Array.isArray(course.feeStructure) && course.feeStructure.length > 0) {
      return course.feeStructure;
    }
    
    // Otherwise generate from feePerYear and duration
    const years = getDurationYears(course.duration);
    const feePerYear = typeof course.feePerYear === 'number' ? course.feePerYear : 0;
    const feeStructure = [];
    
    const yearNames = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', '6th Year'];
    for (let i = 0; i < years; i++) {
      feeStructure.push({
        year: yearNames[i] || `${i + 1} Year`,
        amount: feePerYear
      });
    }
    
    return feeStructure;
  };

  // Calculate total fee
  const calculateTotalFee = (course: any) => {
    if (course.totalFee && typeof course.totalFee === 'number' && course.totalFee > 0) {
      return course.totalFee;
    }
    
    const years = getDurationYears(course.duration);
    const feePerYear = typeof course.feePerYear === 'number' ? course.feePerYear : 0;
    return feePerYear * years;
  };

  // ✅ UPDATED: Render fee structure properly
  const renderFeeStructure = () => {
    if (loadingCourses) {
      return <div className="text-center py-4">Loading fee structure...</div>;
    }
    
    if (collegeCourses.length === 0) {
      return <div className="text-center py-4 text-gray-500">No courses available</div>;
    }
    
    // Get registration fee from first course
    const registrationFee = collegeCourses[0]?.registrationFee || 10000;
    
    return (
      <div className="space-y-4">
        {/* Registration Fee Header */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Registration Fee</span>
            <span className="font-bold text-green-700 text-lg">
              {formatCurrency(registrationFee)} <span className="text-sm font-normal">(One Time)</span>
            </span>
          </div>
        </div>
        
        {/* Course-wise Fee Structure */}
        {collegeCourses.map((course) => {
          const feeStructure = generateFeeStructure(course);
          const totalFee = calculateTotalFee(course);
          const hasValidFee = feeStructure.some(f => f.amount > 0);
          
          return (
            <div key={course.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3 pb-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-800 text-base">{course.name}</h4>
                {course.duration && course.duration !== 'Contact for details' && (
                  <p className="text-xs text-gray-500 mt-0.5">{course.duration}</p>
                )}
              </div>
              
              {hasValidFee ? (
                <div className="space-y-2">
                  {feeStructure.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">{item.year}</span>
                      <span className="font-semibold text-purple-600">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-gray-200">
                    <span className="text-sm font-semibold text-gray-800">Total Fee</span>
                    <span className="font-bold text-purple-700 text-lg">
                      {formatCurrency(totalFee)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-gray-500">
                  <p className="text-sm">Fee structure not available</p>
                  <button 
                    onClick={() => handleChatWithExpert()}
                    className="mt-2 text-xs text-purple-600 hover:text-purple-700"
                  >
                    Contact for details →
                  </button>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="bg-blue-50 rounded-lg p-3 mt-2">
          <p className="text-xs text-gray-600 text-center">
            💡 EMI options available | Scholarships up to ₹60,000 for meritorious students
          </p>
        </div>
        
        <p className="text-xs text-gray-400 text-center">
          * University examination fee & enrolment charges to be paid separately as per university guidelines.
        </p>
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto z-50 rounded-2xl bg-white shadow-2xl"
            >
              <button
                onClick={onClose}
                className="sticky top-4 right-4 float-right z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="clear-both px-6 pb-6 pt-2">
                {/* Toast Message */}
                <AnimatePresence>
                  {toast && (
                    <motion.div
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      className="fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white text-sm"
                    >
                      {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {toast.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Greeting */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎓</span>
                      <span className="text-lg font-semibold text-gray-800">
                        Namaste, {userName}!
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Great news! Special offers for {college.name}, upto ₹20,000 Coupon Cashback Available* and EMI Plans available.
                    </p>
                  </div>
                </div>

                {/* College Name & Rating */}
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{college.name}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{college.rating || '4.3'}</span>
                      <span className="text-gray-500 text-sm">({college.reviews || '1250'} Reviews)</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5" />
                      {college.location || 'Greater Noida'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={handleDownloadBrochure}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Brochure
                  </button>
                  
                  <button
                    onClick={handleSaveCollege}
                    disabled={savingLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSaved 
                        ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {savingLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isSaved ? (
                      <Heart className="w-4 h-4 fill-pink-600" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )}
                    {isSaved ? 'Saved' : 'Save College'}
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex overflow-x-auto gap-1">
                    {['about', 'courses', 'fees', 'placement', 'facilities'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all relative ${
                          activeTab === tab ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab === 'about' ? 'About University' : 
                         tab === 'courses' ? 'Courses' :
                         tab === 'fees' ? 'Fee Structure' :
                         tab === 'placement' ? 'Placement' : 'Facilities'}
                        {activeTab === tab && (
                          <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="mb-6">
                  {activeTab === 'about' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">About University</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {college.about || college.description || `${college.name} is a premier educational institution in Greater Noida offering diverse programs. With state-of-the-art infrastructure, experienced faculty, and strong industry connections, the institution has consistently delivered excellent academic results and placements.`}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Facts</h3>
                        <ul className="space-y-2">
                          {(college.facts || [
                            'Approved by AICTE, Ministry of HRD, Government of India',
                            'Affiliated to Dr. A.P.J. Abdul Kalam Technical University, Lucknow & CCS University, Meerut',
                            'State-of-the-art infrastructure with modern facilities'
                          ]).map((fact: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'courses' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Courses Offered</h3>
                      {loadingCourses ? (
                        <div className="text-center py-8">
                          <div className="inline-block w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm text-gray-500 mt-2">Loading courses...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {collegeCourses.map((course) => (
                            <button
                              key={course.id}
                              onClick={() => handleCourseClick(course.name)}
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition-all group"
                            >
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-purple-600" />
                                <div className="text-left">
                                  <span className="text-sm text-gray-700 group-hover:text-purple-700">{course.name}</span>
                                  {course.duration && course.duration !== 'Contact for details' && (
                                    <p className="text-xs text-gray-400 mt-0.5">{course.duration}</p>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'fees' && renderFeeStructure()}

                  {activeTab === 'placement' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Placement Highlights</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xs text-gray-500">Highest Package</div>
                          <div className="font-bold text-lg text-green-600">{college.highestPackage || '₹14 LPA'}</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs text-gray-500">Average Package</div>
                          <div className="font-bold text-lg text-blue-600">{college.averagePackage || '₹5.8 LPA'}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Top Recruiters</h4>
                        <div className="flex flex-wrap gap-2">
                          {(college.topRecruiters || [
                            'Amazon', 'TCS', 'Microsoft', 'Deloitte', 'HDFC Bank', 'Wipro', 'Infosys', 'Samsung'
                          ]).map((recruiter: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {recruiter}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'facilities' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Campus Facilities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(college.facilities || [
                          'Smart Classrooms', 'Advanced Labs', 'Digital Library', 'Hostel', 'Sports Complex',
                          'Wi-Fi Campus', 'Auditorium', 'Cafeteria', 'Transport Facility', 'Medical Facility'
                        ]).map((facility: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <Building className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-sm text-gray-700">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats & Apply Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-800">
                        Last Month {college.lastMonthStudents?.toLocaleString() || '52,899'} Students Opted this
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-700 font-medium">Dreamz College Assured</span>
                    </div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-600">✅ Get 100% Full Refund* on Cancellation</p>
                    <p className="text-xs text-gray-600">✅ No Cost EMI Available</p>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-xs text-gray-500">Registration Fee</span>
                      <div className="text-2xl font-bold text-purple-600">₹10,000</div>
                      <span className="text-xs text-gray-400">* One Time Payment</span>
                    </div>
                    <div className="flex gap-2">
                      {loadingApplied ? (
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-400 text-white rounded-lg font-semibold text-sm">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </button>
                      ) : appliedCoursesList.length > 0 ? (
                        <button
                          onClick={() => setShowAlreadyAppliedToast(true)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gray-400 text-white rounded-lg font-semibold text-sm cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Already Applied
                        </button>
                      ) : (
                        <button
                          onClick={handleApplyNow}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                        >
                          <Rocket className="w-4 h-4" />
                          Apply Now
                        </button>
                      )}
                      <button
                        onClick={handleChatWithExpert}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Already Applied Toast Message */}
                <AnimatePresence>
                  {showAlreadyAppliedToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      transition={{ duration: 0.3 }}
                      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] bg-amber-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span>You have already applied for a course in this college</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Accreditation Badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {(college.accreditation || ['AICTE', 'NBA', 'NAAC A+']).map((badge: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Course Detail Modal */}
      <CourseDetailModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onBack={() => setIsCourseModalOpen(false)}
        course={selectedCourse}
        collegeName={college?.name}
      />

      {/* Application Popup */}
      <ApplicationPopup
        isOpen={isApplicationPopupOpen}
        onClose={() => setIsApplicationPopupOpen(false)}
        college={{
          id: college.id,
          name: college.name,
          courses: getCoursesList()
        }}
        onSuccess={() => {
          fetchAppliedCourses();
        }}
      />
    </>
  );
}