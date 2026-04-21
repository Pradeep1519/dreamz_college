// src/app/components/CourseDetailModal.tsx

import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Calendar, Users, GraduationCap, IndianRupee, CheckCircle, Rocket, MessageCircle, BookOpen, Clock, Award, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  course: any;
  collegeName?: string;
}

// ✅ GN GROUP - Course Data
const gnGroupCoursesData: Record<string, any> = {
  'B.Tech (AKTU)': {
    name: 'B.Tech (Computer Science & Engineering)',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks. JEE Main/UPSEE qualified.',
    seats: 180,
    registrationFee: 10000,
    feePerYear: 264000,
    totalFee: 1056000,
    feeStructure: [
      { year: '1st Year', amount: 264000 },
      { year: '2nd Year', amount: 264000 },
      { year: '3rd Year', amount: 264000 },
      { year: '4th Year', amount: 264000 }
    ],
    affiliation: 'AKTU, Lucknow',
    highlights: ['NBA Accredited', 'Advanced Computing Labs', 'Industry Certifications', 'Research Opportunities']
  },
  'B.Tech (GGSIPU)': {
    name: 'B.Tech (Computer Science & Engineering)',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks. JEE Main/UPSEE qualified.',
    seats: 180,
    registrationFee: 10000,
    feePerYear: 314400,
    totalFee: 1257600,
    feeStructure: [
      { year: '1st Year', amount: 314400 },
      { year: '2nd Year', amount: 314400 },
      { year: '3rd Year', amount: 314400 },
      { year: '4th Year', amount: 314400 }
    ],
    affiliation: 'GGSIPU, Delhi',
    highlights: ['NBA Accredited', 'Advanced Computing Labs', 'Industry Certifications', 'Research Opportunities']
  },
  'B.Tech (LEET)': {
    name: 'B.Tech (LEET - Lateral Entry)',
    duration: '3 Years (6 Semesters)',
    eligibility: 'Diploma in Engineering with minimum 45% marks',
    seats: 60,
    registrationFee: 10000,
    feePerYear: 154000,
    totalFee: 462000,
    feeStructure: [
      { year: '2nd Year', amount: 154000 },
      { year: '3rd Year', amount: 154000 },
      { year: '4th Year', amount: 154000 }
    ],
    affiliation: 'AKTU, Lucknow',
    highlights: ['Lateral Entry', 'Direct 2nd Year Admission', 'Fast Track Program']
  },
  'MBA': {
    name: 'MBA (Master of Business Administration)',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Bachelor\'s degree with minimum 50% marks. MAT/CAT/CMAT qualified.',
    seats: 120,
    registrationFee: 10000,
    feePerYear: 179400,
    totalFee: 358800,
    feeStructure: [
      { year: '1st Year', amount: 179400 },
      { year: '2nd Year', amount: 179400 }
    ],
    affiliation: 'AKTU, Lucknow',
    highlights: ['AICTE Approved', 'Industry Focused Curriculum', 'Case Based Teaching', '100% Placement Assistance']
  },
  'PGDM': {
    name: 'PGDM (Post Graduate Diploma in Management)',
    duration: '2 Years (Full Time)',
    eligibility: 'Bachelor\'s degree with minimum 50% marks. Valid score in CAT/MAT/CMAT/XAT.',
    seats: 60,
    registrationFee: 10000,
    feePerYear: 287500,
    totalFee: 575000,
    feeStructure: [
      { year: '1st Year', amount: 287500 },
      { year: '2nd Year', amount: 287500 }
    ],
    affiliation: 'AICTE Approved',
    highlights: ['AICTE Approved', 'Industry Focused Curriculum', 'Global Exposure', '100% Placement Record']
  },
  'BBA': {
    name: 'BBA (Bachelor of Business Administration)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with minimum 45% marks from recognized board',
    seats: 120,
    registrationFee: 10000,
    feePerYear: 82500,
    totalFee: 247500,
    feeStructure: [
      { year: '1st Year', amount: 82500 },
      { year: '2nd Year', amount: 82500 },
      { year: '3rd Year', amount: 82500 }
    ],
    affiliation: 'CCS University, Meerut',
    highlights: ['Industry Exposure', 'Soft Skills Training', 'Internship Program', 'Personality Development']
  },
  'BCA': {
    name: 'BCA (Bachelor of Computer Applications)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with Mathematics/Computer Science with minimum 45% marks',
    seats: 120,
    registrationFee: 10000,
    feePerYear: 95000,
    totalFee: 285000,
    feeStructure: [
      { year: '1st Year', amount: 95000 },
      { year: '2nd Year', amount: 95000 },
      { year: '3rd Year', amount: 95000 }
    ],
    affiliation: 'CCS University, Meerut',
    highlights: ['Programming Labs', 'Industry Certifications', 'Project Based Learning', 'Placement Support']
  },
  'B.Com': {
    name: 'B.Com (Bachelor of Commerce)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with minimum 45% marks from recognized board',
    seats: 120,
    registrationFee: 10000,
    feePerYear: 82500,
    totalFee: 247500,
    feeStructure: [
      { year: '1st Year', amount: 82500 },
      { year: '2nd Year', amount: 82500 },
      { year: '3rd Year', amount: 82500 }
    ],
    affiliation: 'CCS University, Meerut',
    highlights: ['Tally Training', 'GST Certification', 'Industry Exposure', 'Soft Skills Development']
  },
  'B.Pharm': {
    name: 'B.Pharm (Bachelor of Pharmacy)',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCB/PCM with minimum 45% marks',
    seats: 100,
    registrationFee: 10000,
    feePerYear: 246000,
    totalFee: 984000,
    feeStructure: [
      { year: '1st Year', amount: 246000 },
      { year: '2nd Year', amount: 246000 },
      { year: '3rd Year', amount: 246000 },
      { year: '4th Year', amount: 246000 }
    ],
    affiliation: 'AKTU, Lucknow',
    highlights: ['PCI Approved', 'Modern Labs', 'Herbal Garden', 'Industry Training', 'Research Projects']
  },
  'D.Pharm': {
    name: 'D.Pharm (Diploma in Pharmacy)',
    duration: '2 Years (4 Semesters)',
    eligibility: '10+2 with PCB/PCM with minimum 50% marks',
    seats: 60,
    registrationFee: 10000,
    feePerYear: 100000,
    totalFee: 200000,
    feeStructure: [
      { year: '1st Year', amount: 100000 },
      { year: '2nd Year', amount: 100000 }
    ],
    affiliation: 'BTE, Lucknow',
    highlights: ['PCI Approved', 'Practical Training', 'Hospital Internship', 'Industry Ready']
  },
  'LL.B': {
    name: 'LL.B (Bachelor of Laws)',
    duration: '3 Years (6 Semesters)',
    eligibility: 'Graduation with minimum 45% marks',
    seats: 120,
    registrationFee: 10000,
    feePerYear: 62000,
    totalFee: 186000,
    feeStructure: [
      { year: '1st Year', amount: 62000 },
      { year: '2nd Year', amount: 62000 },
      { year: '3rd Year', amount: 62000 }
    ],
    affiliation: 'CCS University, Meerut',
    highlights: ['BCI Approved', 'Moot Court', 'Legal Aid Clinic', 'Internship Opportunities']
  }
};

// ✅ MANGALMAY GROUP - Course Data
const mangalmayCoursesData: Record<string, any> = {
  'MBA (IIM Certification)': {
    name: 'MBA (IIM Certification)',
    duration: '2 Years (4 Semesters)',
    eligibility: "Bachelor's degree with minimum 50% marks. Valid score in MAT/CAT/CMAT.",
    seats: 120,
    registrationFee: 10000,
    feePerYear: 310000,
    totalFee: 525000,
    feeStructure: [
      { year: '1st Year', amount: 310000 },
      { year: '2nd Year', amount: 215000 }
    ],
    affiliation: 'AKTU, Lucknow',
    highlights: ['IIM Certification', 'Industry Focused Curriculum', 'Case Based Teaching', '100% Placement Assistance']
  },
  'MBA': {
    name: 'MBA (Master of Business Administration)',
    duration: '2 Years (4 Semesters)',
    eligibility: "Bachelor's degree with minimum 50% marks. MAT/CAT/CMAT qualified.",
    seats: 120,
    registrationFee: 10000,
    feePerYear: 160000,
    totalFee: 309000,
    feeStructure: [
      { year: '1st Year', amount: 160000 },
      { year: '2nd Year', amount: 149000 }
    ],
    affiliation: 'AKTU, Lucknow',
    highlights: ['AICTE Approved', 'Industry Focused Curriculum', 'Case Based Teaching', '100% Placement Assistance']
  },
  'B.Tech Advance': {
    name: 'B.Tech Advance',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks. JEE Main/UPSEE qualified.',
    seats: 180,
    registrationFee: 10000,
    feePerYear: 165000,
    totalFee: 660000,
    feeStructure: [
      { year: '1st Year', amount: 165000 },
      { year: '2nd Year', amount: 165000 },
      { year: '3rd Year', amount: 165000 },
      { year: '4th Year', amount: 165000 }
    ],
    affiliation: 'AKTU, Lucknow',
    highlights: ['NBA Accredited', 'Advanced Computing Labs', 'Industry Certifications', 'Research Opportunities']
  },
  'B.Tech CSE (AI/CS/DS)': {
    name: 'B.Tech CSE (AI/CS/DS)',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks. JEE Main/UPSEE qualified.',
    seats: 180,
    registrationFee: 10000,
    feePerYear: 129000,
    totalFee: 516000,
    feeStructure: [
      { year: '1st Year', amount: 129000 },
      { year: '2nd Year', amount: 129000 },
      { year: '3rd Year', amount: 129000 },
      { year: '4th Year', amount: 129000 }
    ],
    affiliation: 'AKTU, Lucknow',
    highlights: ['NBA Accredited', 'AI/ML Labs', 'Industry Certifications', 'Research Opportunities']
  },
  'BBA (PLATINA)': {
    name: 'BBA (PLATINA)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with minimum 45% marks from recognized board',
    seats: 120,
    registrationFee: 10000,
    feePerYear: 129000,
    totalFee: 387000,
    feeStructure: [
      { year: '1st Year', amount: 129000 },
      { year: '2nd Year', amount: 129000 },
      { year: '3rd Year', amount: 129000 }
    ],
    affiliation: 'CCS University, Meerut',
    highlights: ['Industry Exposure', 'Soft Skills Training', 'Internship Program', 'Personality Development']
  },
  'BBA': {
    name: 'BBA (Bachelor of Business Administration)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with minimum 45% marks from recognized board',
    seats: 120,
    registrationFee: 10000,
    feePerYear: 84000,
    totalFee: 252000,
    feeStructure: [
      { year: '1st Year', amount: 84000 },
      { year: '2nd Year', amount: 84000 },
      { year: '3rd Year', amount: 84000 }
    ],
    affiliation: 'CCS University, Meerut',
    highlights: ['Industry Exposure', 'Soft Skills Training', 'Internship Program', 'Personality Development']
  },
  'BCA': {
    name: 'BCA (Bachelor of Computer Applications)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with Mathematics/Computer Science with minimum 45% marks',
    seats: 120,
    registrationFee: 10000,
    feePerYear: 84000,
    totalFee: 252000,
    feeStructure: [
      { year: '1st Year', amount: 84000 },
      { year: '2nd Year', amount: 84000 },
      { year: '3rd Year', amount: 84000 }
    ],
    affiliation: 'CCS University, Meerut',
    highlights: ['Programming Labs', 'Industry Certifications', 'Project Based Learning', 'Placement Support']
  },
  'B.Com': {
    name: 'B.Com (Bachelor of Commerce)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with minimum 45% marks from recognized board',
    seats: 120,
    registrationFee: 10000,
    feePerYear: 55000,
    totalFee: 165000,
    feeStructure: [
      { year: '1st Year', amount: 55000 },
      { year: '2nd Year', amount: 55000 },
      { year: '3rd Year', amount: 55000 }
    ],
    affiliation: 'CCS University, Meerut',
    highlights: ['Tally Training', 'GST Certification', 'Industry Exposure', 'Soft Skills Development']
  },
  'B.A.B.Ed': {
    name: 'B.A.B.Ed (Bachelor of Arts & Education)',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with minimum 50% marks',
    seats: 100,
    registrationFee: 10000,
    feePerYear: 110000,
    totalFee: 440000,
    feeStructure: [
      { year: '1st Year', amount: 110000 },
      { year: '2nd Year', amount: 110000 },
      { year: '3rd Year', amount: 110000 },
      { year: '4th Year', amount: 110000 }
    ],
    affiliation: 'CCS University, Meerut',
    highlights: ['NCTE Approved', 'Integrated Curriculum', 'Teaching Practice', 'School Internship']
  }
};

export function CourseDetailModal({ isOpen, onClose, onBack, course, collegeName }: CourseDetailModalProps) {
  const { user, userData } = useAuth();
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryData, setEnquiryData] = useState({ name: '', phone: '', email: '', message: '' });

  const userName = userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest';
  
  // Get course data based on college name
  let courseData;
  if (collegeName?.includes('Mangalmay')) {
    courseData = mangalmayCoursesData[course?.name];
  } else {
    courseData = gnGroupCoursesData[course?.key || course?.name];
  }
  
  if (!courseData) return null;

  const collegeDisplayName = collegeName?.includes('Mangalmay') ? 'Mangalmay Group of Institutions' : 'GN Group of Institutions';

  const handleChatWithExpert = () => {
    const message = `👋 Hello! I'm interested in ${courseData.name} at ${collegeDisplayName}. Can you guide me about admission process and fee structure?`;
    window.open(`https://wa.me/918796033021?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowEnquiryForm(false);
      alert(`Application submitted for ${courseData.name} at ${collegeDisplayName}! We will contact you soon.`);
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
              <div className="mb-6 mt-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    <span className="text-lg font-semibold text-gray-800">
                      Namaste, {userName}!
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    You're exploring <span className="font-semibold text-purple-600">{courseData.name}</span> at {collegeDisplayName}
                  </p>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{courseData.name}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>{courseData.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Seats: {courseData.seats}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>{courseData.affiliation}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Eligibility Criteria
                </h3>
                <p className="text-sm text-gray-600">{courseData.eligibility}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  Fee Structure
                </h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-gray-600">Registration Fee</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">₹{courseData.registrationFee.toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">One Time</td>
                      </tr>
                      {courseData.feeStructure.map((item: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-gray-600">{item.year} Fee</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">₹{item.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">Yearly</td>
                        </tr>
                      ))}
                      <tr className="bg-purple-50">
                        <td className="px-4 py-3 font-semibold text-gray-800">Total Fee</td>
                        <td className="px-4 py-3 font-bold text-purple-600">₹{courseData.totalFee.toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">+ Registration</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  * University examination fee & enrolment charges to be paid separately as per university guidelines.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Program Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {courseData.highlights.map((highlight: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

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
                <h3 className="text-xl font-bold text-gray-900">Apply for {courseData.name}</h3>
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
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}