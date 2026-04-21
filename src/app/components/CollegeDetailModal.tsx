// src/app/components/CollegeDetailModal.tsx

import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Users, Award, CheckCircle, Phone, MessageCircle, Rocket, BookOpen, Briefcase, Building, GraduationCap, MapPin, Calendar, TrendingUp, Shield, ChevronRight, Download } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CourseDetailModal } from './CourseDetailModal';

interface CollegeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  college: any;
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

export function CollegeDetailModal({ isOpen, onClose, college }: CollegeDetailModalProps) {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('about');
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryData, setEnquiryData] = useState({ name: '', phone: '', email: '', course: '', message: '' });
  
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const userName = userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest';
  const isMangalmay = college?.name?.includes('Mangalmay');

  if (!isOpen || !college) return null;

  const handleCourseClick = (courseName: string) => {
    let courseData;
    if (isMangalmay) {
      courseData = mangalmayCoursesData[courseName];
    } else {
      let courseKey = courseName;
      if (courseName === 'B.Tech') courseKey = 'B.Tech (AKTU)';
      if (courseName === 'B.Tech (GGSIPU)') courseKey = 'B.Tech (GGSIPU)';
      if (courseName === 'B.Tech (LEET)') courseKey = 'B.Tech (LEET)';
      courseData = gnGroupCoursesData[courseKey];
    }
    
    if (courseData) {
      setSelectedCourse({ name: courseName, ...courseData });
      setIsCourseModalOpen(true);
    }
  };

  const handleChatWithExpert = () => {
    const message = `👋 Hello! I'm interested in ${college.name}. Can you guide me about admission process?`;
    window.open(`https://wa.me/918796033021?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadBrochure = () => {
    const link = document.createElement('a');
    const fileName = isMangalmay ? 'mangalmay-brochure.pdf' : 'gn-group-brochure.pdf';
    link.href = `/brochures/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowEnquiryForm(false);
      alert('Application submitted successfully! We will contact you soon.');
    }, 1000);
  };

  // Fee structure display for Mangalmay
  const renderFeeStructure = () => {
    if (isMangalmay) {
      return (
        <div className="space-y-3">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Registration Fee</span>
              <span className="font-bold text-green-700">₹10,000 (One Time)</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">MBA (IIM Certification) - Per Year</span>
              <span className="font-bold text-purple-600">₹3,10,000 (1st) | ₹2,15,000 (2nd)</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold">₹5,25,000 + ₹10,000</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">MBA - Per Year</span>
              <span className="font-bold text-purple-600">₹1,60,000 (1st) | ₹1,49,000 (2nd)</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold">₹3,09,000 + ₹10,000</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">B.Tech Advance - Per Year</span>
              <span className="font-bold text-purple-600">₹1,65,000/year</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-gray-500">Total (4 Years)</span>
              <span className="font-semibold">₹6,60,000 + ₹10,000</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">B.Tech CSE (AI/CS/DS) - Per Year</span>
              <span className="font-bold text-purple-600">₹1,29,000/year</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-gray-500">Total (4 Years)</span>
              <span className="font-semibold">₹5,16,000 + ₹10,000</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">BBA (PLATINA) - Per Year</span>
              <span className="font-bold text-purple-600">₹1,29,000/year</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-gray-500">Total (3 Years)</span>
              <span className="font-semibold">₹3,87,000 + ₹10,000</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">BBA / BCA - Per Year</span>
              <span className="font-bold text-purple-600">₹84,000/year</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-gray-500">Total (3 Years)</span>
              <span className="font-semibold">₹2,52,000 + ₹10,000</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">B.Com - Per Year</span>
              <span className="font-bold text-purple-600">₹55,000/year</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-gray-500">Total (3 Years)</span>
              <span className="font-semibold">₹1,65,000 + ₹10,000</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">B.A.B.Ed - Per Year</span>
              <span className="font-bold text-purple-600">₹1,10,000/year</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-gray-500">Total (4 Years)</span>
              <span className="font-semibold">₹4,40,000 + ₹10,000</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Hostel & Mess Charges</span>
              <span className="font-bold text-blue-700">₹1,15,000/year (Twin Sharing)</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-gray-500">Triple Sharing</span>
              <span className="font-semibold">₹1,00,000/year</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            * University examination fee & enrolment charges to be paid separately as per university guidelines.
          </p>
        </div>
      );
    }
    
    // GN Group fee structure
    return (
      <div className="space-y-3">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Registration Fee</span>
            <span className="font-bold text-green-700">₹10,000 (One Time)</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">B.Tech (AKTU) - Per Year</span>
            <span className="font-bold text-purple-600">₹2,64,000</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Total (4 Years)</span>
            <span className="font-semibold">₹10,56,000 + ₹10,000</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">B.Tech (GGSIPU) - Per Year</span>
            <span className="font-bold text-purple-600">₹3,14,400</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Total (4 Years)</span>
            <span className="font-semibold">₹12,57,600 + ₹10,000</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">MBA - Per Year</span>
            <span className="font-bold text-purple-600">₹1,79,400</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Total (2 Years)</span>
            <span className="font-semibold">₹3,58,800 + ₹10,000</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">BBA / B.Com - Per Year</span>
            <span className="font-bold text-purple-600">₹82,500</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Total (3 Years)</span>
            <span className="font-semibold">₹2,47,500 + ₹10,000</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">BCA - Per Year</span>
            <span className="font-bold text-purple-600">₹95,000</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Total (3 Years)</span>
            <span className="font-semibold">₹2,85,000 + ₹10,000</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">B.Pharm - Per Year</span>
            <span className="font-bold text-purple-600">₹2,46,000</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Total (4 Years)</span>
            <span className="font-semibold">₹9,84,000 + ₹10,000</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">D.Pharm - Per Year</span>
            <span className="font-bold text-purple-600">₹1,00,000</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Total (2 Years)</span>
            <span className="font-semibold">₹2,00,000 + ₹10,000</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">LL.B - Per Year</span>
            <span className="font-bold text-purple-600">₹62,000</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Total (3 Years)</span>
            <span className="font-semibold">₹1,86,000 + ₹10,000</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * University examination fee & enrolment charges to be paid separately as per university guidelines.
        </p>
      </div>
    );
  };

  // Get courses list based on college
  const getCoursesList = () => {
    if (isMangalmay) {
      return [
        'B.Tech Advance',
        'B.Tech CSE (AI/CS/DS)',
        'MBA (IIM Certification)',
        'MBA',
        'BBA (PLATINA)',
        'BBA',
        'BCA',
        'B.Com',
        'B.A.B.Ed'
      ];
    }
    return [
      'B.Tech', 'B.Tech (GGSIPU)', 'B.Tech (LEET)', 'MBA', 'PGDM', 'BBA', 'BCA', 'B.Com', 'B.Pharm', 'D.Pharm', 'LL.B'
    ];
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

                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={handleDownloadBrochure}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Brochure
                  </button>
                </div>

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

                <div className="mb-6">
                  {activeTab === 'about' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">About University</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {college.about || `${college.name} is a premier educational institution in Greater Noida offering diverse programs. With state-of-the-art infrastructure, experienced faculty, and strong industry connections, the institution has consistently delivered excellent academic results and placements.`}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {getCoursesList().map((course: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => handleCourseClick(course)}
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition-all group"
                          >
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-700 group-hover:text-purple-700">{course}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                          </button>
                        ))}
                      </div>
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
                      <button
                        onClick={() => setShowEnquiryForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                      >
                        <Rocket className="w-4 h-4" />
                        Apply Now
                      </button>
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

      <CourseDetailModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onBack={() => setIsCourseModalOpen(false)}
        course={selectedCourse}
        collegeName={college?.name}
      />

      <AnimatePresence>
        {showEnquiryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
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
                <h3 className="text-xl font-bold text-gray-900">Apply to {college.name}</h3>
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
                <select
                  required
                  value={enquiryData.course}
                  onChange={(e) => setEnquiryData({...enquiryData, course: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Course *</option>
                  {getCoursesList().map((course: string, idx: number) => (
                    <option key={idx} value={course}>{course}</option>
                  ))}
                </select>
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
    </>
  );
}