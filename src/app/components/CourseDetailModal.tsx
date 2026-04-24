// src/app/components/CourseDetailModal.tsx

import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Calendar, Users, GraduationCap, IndianRupee, CheckCircle, Rocket, MessageCircle, BookOpen, Clock, Award, MapPin, University } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  course: any;
  collegeName?: string;
}

export function CourseDetailModal({ isOpen, onClose, onBack, course, collegeName }: CourseDetailModalProps) {
  const { user, userData } = useAuth();
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryData, setEnquiryData] = useState({ name: '', phone: '', email: '', message: '' });

  const userName = userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest';
  
  if (!course) return null;

  const formatFee = (fee: any) => {
    if (typeof fee === 'number') return `₹${fee.toLocaleString('en-IN')}`;
    return fee || 'Contact for details';
  };

  // Get fee structure (yearly)
  const getFeeStructure = () => {
    if (course.feeStructure && Array.isArray(course.feeStructure) && course.feeStructure.length > 0) {
      return course.feeStructure;
    }
    const years = course.duration?.match(/\d+/)?.[0] || '4';
    const numYears = parseInt(years);
    const feePerYear = typeof course.feePerYear === 'number' ? course.feePerYear : 0;
    
    const yearNames = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', '6th Year'];
    return Array.from({ length: numYears }, (_, i) => ({
      year: yearNames[i] || `${i + 1} Year`,
      amount: feePerYear
    }));
  };

  // Get semester-wise fee structure
  const getSemesterFeeStructure = () => {
    if (course.feeStructureSemester && Array.isArray(course.feeStructureSemester) && course.feeStructureSemester.length > 0) {
      return course.feeStructureSemester;
    }
    return null;
  };

  const feeStructure = getFeeStructure();
  const semesterFeeStructure = getSemesterFeeStructure();
  const totalFee = course.totalFee || feeStructure.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  const registrationFee = course.registrationFee || 10000;

  const handleChatWithExpert = () => {
    const message = `👋 Hello! I'm interested in ${course.name} at ${collegeName}. Can you guide me about admission process and fee structure?`;
    window.open(`https://wa.me/918796033021?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const whatsappMessage = `📬 *New Application - ${collegeName}*
    
🎓 *Course:* ${course.name}
👤 *Name:* ${enquiryData.name}
📞 *Phone:* ${enquiryData.phone}
📧 *Email:* ${enquiryData.email}
💬 *Message:* ${enquiryData.message || 'No message'}
⏰ *Time:* ${new Date().toLocaleString()}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/918796033021?text=${encodedMessage}`, '_blank');
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowEnquiryForm(false);
      setEnquiryData({ name: '', phone: '', email: '', message: '' });
      alert(`Application submitted for ${course.name} at ${collegeName}! We will contact you soon.`);
    }, 1000);
  };

  return (
    <AnimatePresence>
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

              {/* Year-wise Fee Structure */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  Fee Structure
                </h3>
                
                {/* Registration Fee */}
                <div className="bg-green-50 rounded-lg p-3 mb-3 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Registration Fee</span>
                    <span className="font-bold text-green-700">{formatFee(registrationFee)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">One Time Payment (Non-refundable)</p>
                </div>

                {/* Year-wise Table */}
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Year</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeStructure.map((item: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-gray-600">{item.year}</td>
                          <td className="px-4 py-3 text-right font-semibold text-purple-600">
                            {formatFee(item.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-purple-50">
                        <td className="px-4 py-3 font-semibold text-gray-800">Total Fee</td>
                        <td className="px-4 py-3 text-right font-bold text-purple-700 text-lg">
                          {formatFee(totalFee)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Semester-wise Fee Structure (if available) */}
              {semesterFeeStructure && semesterFeeStructure.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Semester-wise Fee Breakup
                  </h3>
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Semester</th>
                          <th className="px-4 py-2 text-right font-semibold text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semesterFeeStructure.map((item: any, idx: number) => (
                          <tr key={idx} className="border-b border-gray-200">
                            <td className="px-4 py-2 text-gray-600">{item.semester}</td>
                            <td className="px-4 py-2 text-right font-semibold text-purple-600">
                              {formatFee(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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

              {/* Note */}
              <div className="bg-yellow-50 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-600">
                  📌 <span className="font-semibold">Note:</span> University examination fee & enrolment charges to be paid separately as per university guidelines. EMI options available. Scholarships up to ₹60,000 for meritorious students.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowEnquiryForm(true)}
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

      {/* Enquiry Form Modal */}
      <AnimatePresence>
        {showEnquiryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={() => setShowEnquiryForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Apply for {course?.name}</h3>
                <button onClick={() => setShowEnquiryForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={enquiryData.name}
                  onChange={(e) => setEnquiryData({...enquiryData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  value={enquiryData.phone}
                  onChange={(e) => setEnquiryData({...enquiryData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={enquiryData.email}
                  onChange={(e) => setEnquiryData({...enquiryData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  placeholder="Message (Optional)"
                  rows={3}
                  value={enquiryData.message}
                  onChange={(e) => setEnquiryData({...enquiryData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  You'll receive confirmation on WhatsApp within 24 hours
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}