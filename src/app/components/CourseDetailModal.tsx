// src/app/components/CourseDetailModal.tsx

import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Calendar, Users, GraduationCap, IndianRupee, CheckCircle, Rocket, MessageCircle, BookOpen, Clock, Award, MapPin, University } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApplicationPopup } from './ApplicationPopup';
import { useOffers } from '../hooks/useOffers';
import { Offer } from '../../lib/offerService';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  course: any;
  collegeName?: string;
}

export function CourseDetailModal({ isOpen, onClose, onBack, course, collegeName }: CourseDetailModalProps) {
  const { user, userData } = useAuth();
  const [isApplicationPopupOpen, setIsApplicationPopupOpen] = useState(false);
  
  // Offer states
  const { bestOffer } = useOffers({ location: 'apply_button', autoFetch: true });
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [showOffer, setShowOffer] = useState(true);

  const userName = userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest';
  
  if (!course) return null;

  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return 'Contact for details';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // ✅ Get year-wise fees from course data
  const getYearWiseFees = () => {
    if (course.yearWiseFees && Array.isArray(course.yearWiseFees) && course.yearWiseFees.length > 0) {
      return course.yearWiseFees;
    }
    return null;
  };

  const yearWiseFees = getYearWiseFees();
  const totalFee = course.totalFee || (yearWiseFees ? yearWiseFees.reduce((sum: number, y: any) => sum + (y.amount || 0), 0) : 0);
  const registrationFee = course.registrationFee || 10000;

  const handleChatWithExpert = () => {
    const message = `👋 Hello! I'm interested in ${course.name} at ${collegeName}. Can you guide me about admission process and fee structure?`;
    window.open(`https://wa.me/918796033021?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[60] rounded-2xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back to College</span>
                </button>
                <button
                  onClick={onClose}
                  className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 pb-6">
                {/* Greeting */}
                <div className="mb-6 mt-4">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎓</span>
                      <span className="text-lg font-semibold text-gray-800">
                        Namaste, {userName}!
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      You're exploring <span className="font-semibold text-purple-600">{course.name}</span> at {collegeName}
                    </p>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h1>
                
                {/* Course Meta Info */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  {course.duration && course.duration !== 'Contact for details' && (
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>{course.duration}</span>
                    </div>
                  )}
                  {course.university && (
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <University className="w-4 h-4 text-purple-600" />
                      <span>{course.university}</span>
                    </div>
                  )}
                  {course.seats && course.seats !== 'Contact for details' && (
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>Seats: {course.seats}</span>
                    </div>
                  )}
                  {course.category && (
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="capitalize">{course.category}</span>
                    </div>
                  )}
                </div>

                {/* Eligibility */}
                {course.eligibility && course.eligibility !== 'Contact for details' && (
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      Eligibility Criteria
                    </h3>
                    <p className="text-sm text-gray-600">{course.eligibility}</p>
                  </div>
                )}

                {/* ✅ YEAR-WISE FEE STRUCTURE */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    Fee Structure
                  </h3>
                  
                  {/* ✅ Registration Fee with Offer */}
                  <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-700 font-medium">Registration Fee</span>
                        {bestOffer && showOffer && !appliedOffer && (
                          <div className="mt-1">
                            <span className="text-xs line-through text-gray-400">₹{registrationFee.toLocaleString()}</span>
                            <span className="text-sm font-bold text-red-600 ml-2">50% OFF</span>
                          </div>
                        )}
                      </div>
                      {appliedOffer ? (
                        <div className="text-right">
                          <span className="text-sm line-through text-gray-400 mr-2">₹{registrationFee.toLocaleString()}</span>
                          <span className="font-bold text-green-700 text-lg">₹{appliedOffer.discountedFee.toLocaleString()}</span>
                          <p className="text-xs text-green-600 mt-1">🎉 Offer Applied!</p>
                        </div>
                      ) : (
                        <div className="text-right">
                          {bestOffer && showOffer ? (
                            <div>
                              <span className="text-sm line-through text-gray-400 mr-2">₹{registrationFee.toLocaleString()}</span>
                              <span className="font-bold text-purple-600 text-lg">₹{bestOffer.discountedFee.toLocaleString()}</span>
                              <button
                                onClick={() => {
                                  setAppliedOffer(bestOffer);
                                  setShowOffer(false);
                                  setTimeout(() => {
                                    setIsApplicationPopupOpen(true);
                                  }, 500);
                                }}
                                className="ml-2 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full hover:bg-red-600 transition"
                              >
                                Claim 50% OFF
                              </button>
                            </div>
                          ) : (
                            <span className="font-bold text-green-700 text-lg">₹{formatCurrency(registrationFee)}</span>
                          )}
                        </div>
                      )}
                    </div>
                    {appliedOffer && (
                      <div className="mt-2 text-xs text-green-600 bg-green-100 rounded-lg p-1 text-center">
                        🎉 Offer Applied: {appliedOffer.name} - Saved ₹{(registrationFee - appliedOffer.discountedFee).toLocaleString()}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">One Time Payment (Refundable)</p>
                  </div>

                  {/* Year-wise Fee Grid */}
                  {yearWiseFees && yearWiseFees.length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-700">Year-wise Fee Breakdown</h4>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {yearWiseFees.map((yearFee: any) => (
                              <div key={yearFee.year} className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                                <p className="text-xs text-gray-500">Year {yearFee.year}</p>
                                <p className="text-lg font-bold text-purple-600">
                                  {formatCurrency(yearFee.amount)}
                                </p>
                              </div>
                            ))}
                          </div>
                          
                          {totalFee > 0 && (
                            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Total Course Fee</span>
                              <span className="text-xl font-bold text-purple-700">{formatCurrency(totalFee)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                      <p>Detailed fee structure not available</p>
                      <button 
                        onClick={handleChatWithExpert}
                        className="mt-2 text-purple-600 text-sm hover:text-purple-700"
                      >
                        Contact for details →
                      </button>
                    </div>
                  )}
                </div>

                {/* Program Highlights */}
                {course.highlights && course.highlights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Program Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {course.highlights.map((highlight: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specializations */}
                {course.specializations && course.specializations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.specializations.map((spec: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam Accepted */}
                {course.examAccepted && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg mb-6">
                    <Award className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">Exam Accepted:</span>
                    <span>{course.examAccepted}</span>
                  </div>
                )}

                {/* Note */}
                <div className="bg-yellow-50 rounded-lg p-3 mb-6">
                  <p className="text-xs text-gray-600">
                    📌 <span className="font-semibold">Note:</span> University examination fee & enrolment charges to be paid separately as per university guidelines. EMI options available. Scholarships up to ₹60,000 for meritorious students.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsApplicationPopupOpen(true)}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-5 h-5" />
                    Apply Now
                  </button>
                  <button
                    onClick={handleChatWithExpert}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat with Expert
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ApplicationPopup */}
      <ApplicationPopup
        isOpen={isApplicationPopupOpen}
        onClose={() => setIsApplicationPopupOpen(false)}
        college={{
          id: collegeName || '',
          name: collegeName || '',
          courses: [course?.name].filter(Boolean)
        }}
        onSuccess={() => {
          console.log('Application submitted successfully');
          setIsApplicationPopupOpen(false);
        }}
      />
    </>
  );
}