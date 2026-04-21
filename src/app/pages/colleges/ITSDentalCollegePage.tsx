import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Users, Award, ArrowLeft, 
  Phone, Mail, Globe, Calendar, IndianRupee,
  GraduationCap, Building, CheckCircle,
  ExternalLink, BookOpen, Trophy,
  Clock, TrendingUp, Briefcase, Home,
  ChevronRight, Download, Share2, Bookmark, 
  MessageCircle, Sparkles, Rocket,
  BadgeCheck, Medal, Crown, ChevronLeft,
  ChevronRight as ChevronRightIcon, X,
  Image as ImageIcon, Wifi, Coffee, Library, 
  Dumbbell, Bus, Shield, Zap, Heart, 
  GraduationCap as Cap, FlaskConical, Microscope, 
  UsersRound, Check, Info, BarChart, Timer,
  ShieldCheck, Award as AwardIcon, Laptop, Flower,
  Car, Building2, Waves, Radio, BookMarked, CircuitBoard,
  Stethoscope, Activity, Bone
} from 'lucide-react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDnkO1oYjHUbM1KLDRP8W_-GJ1wOrVPBeKD9jC1jAvqEOd63qmnFO9f6keAD7TFC7B/exec';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors">
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && <div className="px-4 pb-3 text-gray-600 text-sm leading-relaxed">{answer}</div>}
    </div>
  );
}

export function ITSDentalCollegePage() {
  const navigate = useNavigate();
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enquiryData, setEnquiryData] = useState({ name: '', phone: '', email: '', course: '', message: '' });

  const college = {
    id: 'its-dental-college',
    name: 'I.T.S Centre for Dental Studies & Research',
    fullName: 'I.T.S Centre for Dental Studies & Research, Muradnagar, Ghaziabad',
    location: 'Delhi-Meerut Road, Muradnagar, Ghaziabad, Uttar Pradesh - 201206',
    rating: 4.3,
    students: '1,500+',
    type: 'Dental Sciences',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
      'https://images.unsplash.com/photo-1629909613654-28e377c37d1e?w=800',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800'
    ],
    established: '2000',
    affiliation: 'CCS University, Meerut | Atal Bihari Vajpayee Medical University, Lucknow',
    accreditation: ['NAAC A Grade', 'DCI', 'ISO 9001:2015'],
    ranking: 'Top Dental College',
    nirfRank: 'Top 50',
    courses: [
      'BDS (Bachelor of Dental Surgery)',
      'MDS (Master of Dental Surgery) - 9 Specializations',
      'MDS in Oral Medicine & Radiology',
      'MDS in Oral & Maxillofacial Surgery',
      'MDS in Prosthodontics',
      'MDS in Conservative Dentistry & Endodontics',
      'MDS in Orthodontics & Dentofacial Orthopedics',
      'MDS in Periodontology',
      'MDS in Pedodontics & Preventive Dentistry',
      'MDS in Oral Pathology & Microbiology',
      'MDS in Community Dentistry'
    ],
    courseDetails: {
      'BDS': {
        name: 'Bachelor of Dental Surgery',
        duration: '5 Years (4 Years + 1 Year Internship)',
        eligibility: '10+2 with PCB with minimum 50% marks. NEET UG qualified.',
        fees: '₹3,65,000/year',
        perSemesterFees: '₹1,82,500/semester',
        totalFees: '₹18,25,000 (Total for 5 years)',
        seats: 100,
        specializations: ['General Dentistry', 'Oral Surgery', 'Orthodontics', 'Periodontics', 'Endodontics', 'Prosthodontics'],
        entranceExam: 'NEET UG',
        highlights: ['DCI Approved', 'NAAC A Grade', '100-bed Hospital', 'Advanced Dental Labs']
      },
      'MDS Oral Medicine': {
        name: 'MDS in Oral Medicine & Radiology',
        duration: '3 Years (6 Semesters)',
        eligibility: 'BDS degree from DCI recognized institute with minimum 50% marks. NEET MDS qualified.',
        fees: '₹7,69,400/year',
        perSemesterFees: '₹3,84,700/semester',
        totalFees: '₹23,08,200 (Total for 3 years)',
        seats: 3,
        specializations: ['Oral Diagnosis', 'Dental Radiology', 'Oral Lesions', 'TMJ Disorders'],
        entranceExam: 'NEET MDS',
        highlights: ['DCI Approved', 'Advanced Radiology Lab', 'Clinical Training']
      },
      'MDS Oral Surgery': {
        name: 'MDS in Oral & Maxillofacial Surgery',
        duration: '3 Years (6 Semesters)',
        eligibility: 'BDS degree from DCI recognized institute with minimum 50% marks. NEET MDS qualified.',
        fees: '₹7,69,400/year',
        perSemesterFees: '₹3,84,700/semester',
        totalFees: '₹23,08,200 (Total for 3 years)',
        seats: 3,
        specializations: ['Dentoalveolar Surgery', 'Maxillofacial Trauma', 'TMJ Surgery', 'Cleft Lip & Palate'],
        entranceExam: 'NEET MDS',
        highlights: ['DCI Approved', 'Operation Theatre', 'Implantology Centre']
      },
      'MDS Prosthodontics': {
        name: 'MDS in Prosthodontics',
        duration: '3 Years (6 Semesters)',
        eligibility: 'BDS degree from DCI recognized institute with minimum 50% marks. NEET MDS qualified.',
        fees: '₹7,69,400/year',
        perSemesterFees: '₹3,84,700/semester',
        totalFees: '₹23,08,200 (Total for 3 years)',
        seats: 3,
        specializations: ['Crown & Bridge', 'Complete Dentures', 'Removable Partial Dentures', 'Implant Prosthodontics'],
        entranceExam: 'NEET MDS',
        highlights: ['DCI Approved', 'Advanced Prosthodontics Lab', 'Implant Centre']
      },
      'MDS Endodontics': {
        name: 'MDS in Conservative Dentistry & Endodontics',
        duration: '3 Years (6 Semesters)',
        eligibility: 'BDS degree from DCI recognized institute with minimum 50% marks. NEET MDS qualified.',
        fees: '₹7,69,400/year',
        perSemesterFees: '₹3,84,700/semester',
        totalFees: '₹23,08,200 (Total for 3 years)',
        seats: 3,
        specializations: ['Root Canal Treatment', 'Restorative Dentistry', 'Aesthetic Dentistry', 'Microscopic Endodontics'],
        entranceExam: 'NEET MDS',
        highlights: ['DCI Approved', 'Operating Microscope', 'Advanced Endodontics Lab']
      },
      'MDS Orthodontics': {
        name: 'MDS in Orthodontics & Dentofacial Orthopedics',
        duration: '3 Years (6 Semesters)',
        eligibility: 'BDS degree from DCI recognized institute with minimum 50% marks. NEET MDS qualified.',
        fees: '₹7,69,400/year',
        perSemesterFees: '₹3,84,700/semester',
        totalFees: '₹23,08,200 (Total for 3 years)',
        seats: 3,
        specializations: ['Fixed Orthodontics', 'Removable Orthodontics', 'Clear Aligners', 'Craniofacial Orthopedics'],
        entranceExam: 'NEET MDS',
        highlights: ['DCI Approved', 'Advanced Orthodontics Lab', 'Cephalometric Analysis']
      },
      'MDS Periodontics': {
        name: 'MDS in Periodontology',
        duration: '3 Years (6 Semesters)',
        eligibility: 'BDS degree from DCI recognized institute with minimum 50% marks. NEET MDS qualified.',
        fees: '₹7,69,400/year',
        perSemesterFees: '₹3,84,700/semester',
        totalFees: '₹23,08,200 (Total for 3 years)',
        seats: 3,
        specializations: ['Periodontal Surgery', 'Dental Implants', 'Laser Periodontics', 'Periodontal Medicine'],
        entranceExam: 'NEET MDS',
        highlights: ['DCI Approved', 'Laser Therapy', 'Implantology Centre']
      }
    },
    highestPackage: '₹15 LPA',
    averagePackage: '₹6 LPA',
    placementRate: '95%',
    topRecruiters: [
      'Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Medanta',
      'Clove Dental', 'Dentistree', 'MyDentalPlan', 'Sabka Dentist',
      'Indian Army Dental Corps', 'Indian Navy Dental Corps',
      'State Health Departments', 'Private Dental Clinics'
    ],
    facilities: [
      'Smart Classrooms', 'Dental Simulation Lab', 'Digital Library', 'Hostel',
      'Sports Complex', 'Wi-Fi Campus', 'Auditorium', 'Seminar Halls',
      'Advanced Dental Labs', 'Cone Beam CT', 'Digital Radiography', 'Laser Therapy Unit',
      'Operating Microscopes', 'Implantology Centre', 'Cafeteria', 'Transport Facility',
      'Medical Facility', 'Gymnasium', 'Bank/ATM', '100-bed Multi-speciality Hospital'
    ],
    contact: {
      phone: '01232-225380',
      email: 'dental@its.edu.in',
      website: 'www.its.edu.in',
      tollFree: '1800-123-4567',
      helpline: '8447753520'
    },
    fees: '₹1,82,500 - ₹3,84,700/semester',
    reviews: 1250,
    description: 'I.T.S Centre for Dental Studies & Research, established in 2000, is a premier dental college with NAAC A Grade accreditation. Recognized by the Dental Council of India (DCI), the institute offers BDS and MDS programs in all 9 specialities. With state-of-the-art infrastructure, advanced dental labs, Cone Beam CT, digital radiography, and a 100-bed multi-speciality hospital, I.T.S Dental College provides exceptional clinical training. The institute has collaborations with Tufts University, USA and University of Leeds, UK for student exchange programs.',
    specializations: [
      'Oral Medicine & Radiology', 'Oral & Maxillofacial Surgery', 'Prosthodontics',
      'Conservative Dentistry & Endodontics', 'Orthodontics', 'Periodontology',
      'Pedodontics', 'Oral Pathology', 'Community Dentistry'
    ],
    brochure: '/brochures/its-dental-college.pdf',
    achievements: [
      'NAAC A Grade Accreditation',
      'DCI Approved',
      'ISO 9001:2015 Certified',
      'A Grade by NAAC',
      'First Private Dental College in North India with Cone Beam CT',
      'Centre for Oral Implantology',
      'Advanced Research Centre',
      'ECHS Dental Clinic',
      'Satellite Clinics Network',
      'White Coat Ceremony - First in North India'
    ],
    alumniCount: '5,000+',
    facultyCount: '150+',
    globalPrograms: [
      'Student Exchange Program with Tufts University, USA',
      'Student Exchange Program with University of Leeds, UK',
      'International Conferences & Seminars',
      'Global Internship Opportunities',
      'International Study Tours'
    ],
    faqs: [
      { question: 'What is the eligibility for BDS at I.T.S Dental College?', answer: '10+2 with PCB with minimum 50% marks. NEET UG qualified as per DCI norms.' },
      { question: 'What is the fee structure for BDS?', answer: 'BDS fee is ₹3,65,000 per year. Total fee for 5 years is approximately ₹18.25 Lakhs (excluding misc. fees).' },
      { question: 'Does I.T.S Dental College have hostel facilities?', answer: 'Yes, separate hostels for boys and girls with AC and Non-AC rooms. Hostel fees range from ₹1,10,000 to ₹1,45,000 per year.' },
      { question: 'What is the placement record of I.T.S Dental College?', answer: '95% placement record with highest package ₹15 LPA and average package ₹6 LPA. Top recruiters include Apollo, Fortis, Clove Dental.' },
      { question: 'Is I.T.S Dental College approved by DCI?', answer: 'Yes, I.T.S Dental College is approved by the Dental Council of India (DCI) and NAAC A Grade accredited.' },
      { question: 'What are the MDS specializations offered?', answer: 'I.T.S offers MDS in all 9 specializations: Oral Medicine, Oral Surgery, Prosthodontics, Endodontics, Orthodontics, Periodontics, Pedodontics, Oral Pathology, and Community Dentistry.' },
      { question: 'Does I.T.S Dental College offer scholarship?', answer: 'Yes, merit-based scholarships available for students with good scores in NEET and qualifying examinations.' },
      { question: 'What is the Cone Beam CT facility?', answer: 'I.T.S was the first private dental college in North India to install Cone Beam CT for advanced 3D imaging and diagnosis.' },
      { question: 'What is the clinical training facility?', answer: 'Students get clinical training at the college\'s 100-bed multi-speciality hospital and satellite clinics in rural areas.' },
      { question: 'What is the alumni network strength?', answer: 'I.T.S Dental College has an alumni network of 5,000+ dental professionals working across India and abroad.' }
    ]
  };

  const getCourseDetails = (courseName: string) => {
    if (courseName.includes('BDS')) return college.courseDetails['BDS'];
    if (courseName.includes('Oral Medicine')) return college.courseDetails['MDS Oral Medicine'];
    if (courseName.includes('Oral & Maxillofacial Surgery')) return college.courseDetails['MDS Oral Surgery'];
    if (courseName.includes('Prosthodontics')) return college.courseDetails['MDS Prosthodontics'];
    if (courseName.includes('Conservative Dentistry') || courseName.includes('Endodontics')) return college.courseDetails['MDS Endodontics'];
    if (courseName.includes('Orthodontics')) return college.courseDetails['MDS Orthodontics'];
    if (courseName.includes('Periodontology')) return college.courseDetails['MDS Periodontics'];
    return null;
  };

  const submitToGoogleSheets = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name); formData.append('phone', data.phone);
      formData.append('email', data.email); formData.append('course', data.course);
      formData.append('message', data.message); formData.append('college', college.name);
      formData.append('timestamp', new Date().toISOString()); formData.append('source', 'I.T.S Dental College - Apply Now');
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formData, mode: 'no-cors' });
      return true;
    } catch (error) { return false; }
  };

  const handleChatWithExpert = () => {
    const message = `👋 Hello! I'm interested in ${college.name}. Can you guide me about admission process?`;
    window.open(`https://wa.me/918796033021?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryData.name || !enquiryData.phone || !enquiryData.email || !enquiryData.course) {
      alert('Please fill all required fields'); return;
    }
    setIsSubmitting(true);
    try {
      await submitToGoogleSheets(enquiryData);
      const message = `📬 *New Application - ${college.name}*\n\n👤 Name: ${enquiryData.name}\n📞 Phone: ${enquiryData.phone}\n📧 Email: ${enquiryData.email}\n📚 Course: ${enquiryData.course}\n💬 Message: ${enquiryData.message || 'No message'}\n⏰ Time: ${new Date().toLocaleString()}`;
      window.open(`https://wa.me/918796033021?text=${encodeURIComponent(message)}`, '_blank');
      setIsSuccess(true);
      setTimeout(() => { setIsSuccess(false); setShowEnquiryForm(false); setEnquiryData({ name: '', phone: '', email: '', course: '', message: '' }); }, 3000);
    } catch (error) { alert('Something went wrong. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % college.gallery.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + college.gallery.length) % college.gallery.length);

  const facilityIcons: { [key: string]: any } = {
    'Smart Classrooms': GraduationCap, 'Dental Simulation Lab': Tooth, 'Digital Library': Library,
    'Hostel': Home, 'Sports Complex': Dumbbell, 'Wi-Fi Campus': Wifi, 'Auditorium': UsersRound,
    'Seminar Halls': UsersRound, 'Advanced Dental Labs': Microscope, 'Cone Beam CT': Zap,
    'Digital Radiography': Zap, 'Laser Therapy Unit': Zap, 'Operating Microscopes': Microscope,
    'Implantology Centre': Tooth, 'Cafeteria': Coffee, 'Transport Facility': Bus,
    'Medical Facility': Heart, 'Gymnasium': Dumbbell, 'Bank/ATM': Shield,
    '100-bed Multi-speciality Hospital': Building2
  };

  const ugCourses = college.courses.filter(c => c.includes('BDS'));
  const pgCourses = college.courses.filter(c => c.includes('MDS'));

  return (
    <>
      <Helmet><title>{college.name} - Fees, Placements, Ranking 2026 | Top Dental College in Delhi NCR</title>
      <meta name="description" content={`${college.name} - Explore fees (${college.fees}), courses offered (BDS, MDS in 9 specializations). NAAC A Grade | DCI Approved | NEET Admission. Get free counseling for 2026 admissions!`} /></Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[600px] w-full group">
          <img src={college.gallery[currentImageIndex]} alt={`${college.name} campus`} className="w-full h-full object-cover transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          {college.gallery.length > 1 && (<><button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"><ChevronLeft className="w-6 h-6" /></button>
          <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"><ChevronRightIcon className="w-6 h-6" /></button></>)}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">{currentImageIndex + 1} / {college.gallery.length}</div>
          <button onClick={() => setShowGalleryModal(true)} className="absolute bottom-32 right-8 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm flex items-center gap-2"><ImageIcon className="w-4 h-4" /> View Gallery</button>
          <button onClick={() => navigate('/colleges')} className="absolute top-24 left-4 md:left-8 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1" /><span className="text-sm">Back to Colleges</span></button>
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 py-8 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-purple-600 rounded-full text-sm font-medium flex items-center gap-1"><Crown className="w-4 h-4" />{college.type}</span>
              {college.nirfRank && <span className="px-4 py-1.5 bg-blue-600 rounded-full text-sm font-medium">NIRF {college.nirfRank}</span>}
              <span className="px-4 py-1.5 bg-yellow-600 rounded-full text-sm font-medium flex items-center gap-1"><Star className="w-4 h-4 fill-white" />{college.rating} ({college.reviews}+)</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">{college.name}</h1>
            <p className="text-white/90 text-base md:text-lg mb-4 drop-shadow">{college.fullName}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full"><MapPin className="w-4 h-4" />Muradnagar, Ghaziabad</div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full"><Calendar className="w-4 h-4" />Est. {college.established}</div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full"><Users className="w-4 h-4" />{college.students}</div>
            </div>
          </div>
        </div>

        {/* Gallery Modal */}
        {showGalleryModal && (<div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"><button onClick={() => setShowGalleryModal(false)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full"><X className="w-6 h-6" /></button><button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full"><ChevronLeft className="w-8 h-8" /></button><img src={college.gallery[currentImageIndex]} alt={`${college.name} campus view`} className="max-h-[90vh] max-w-[90vw] object-contain" /><button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full"><ChevronRightIcon className="w-8 h-8" /></button><div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">{currentImageIndex + 1} / {college.gallery.length}</div></div>)}

        {/* Trust Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center"><div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center"><Award className="w-8 h-8 text-purple-600" /></div><div className="font-bold text-2xl text-gray-900">A Grade</div><div className="text-sm text-gray-500">NAAC Accredited</div></div>
            <div className="text-center"><div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center"><Users className="w-8 h-8 text-blue-600" /></div><div className="font-bold text-2xl text-gray-900">{college.alumniCount}</div><div className="text-sm text-gray-500">Alumni Network</div></div>
            <div className="text-center"><div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center"><Briefcase className="w-8 h-8 text-green-600" /></div><div className="font-bold text-2xl text-gray-900">{college.placementRate}</div><div className="text-sm text-gray-500">Placement Rate</div></div>
            <div className="text-center"><div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center"><TrendingUp className="w-8 h-8 text-orange-600" /></div><div className="font-bold text-2xl text-gray-900">{college.highestPackage}</div><div className="text-sm text-gray-500">Highest Package</div></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowEnquiryForm(true)} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl"><Rocket className="w-5 h-5" /> Apply Now (Free)</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleChatWithExpert} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"><MessageCircle className="w-5 h-5" /> Chat with Expert</motion.button>
          <motion.a href={college.brochure} download whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold shadow-lg hover:shadow-xl"><Download className="w-5 h-5" /> Brochure</motion.a>
        </div>

        {/* Sticky Tabs */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto scrollbar-hide gap-1">
            {['overview', 'courses', 'placements', 'global', 'facilities', 'faqs', 'contact'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-4 font-medium text-sm whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab === 'overview' ? 'Overview' : tab === 'courses' ? 'Courses & Fees' : tab === 'placements' ? 'Placements' : tab === 'global' ? 'Global Programs' : tab === 'facilities' ? 'Facilities' : tab === 'faqs' ? 'FAQs' : 'Contact'}
                {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  <div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Building className="w-5 h-5 text-purple-600" /> About {college.name}</h2><p className="text-gray-600 leading-relaxed">{college.description}</p></div>
                  <div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Medal className="w-5 h-5 text-purple-600" /> Key Achievements</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{college.achievements.map((a,i)=><div key={i} className="flex items-start gap-2"><BadgeCheck className="w-5 h-5 text-green-500 mt-0.5" /><span className="text-gray-700">{a}</span></div>)}</div></div>
                  <div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-purple-600" /> Accreditations & Approvals</h2><div className="flex flex-wrap gap-2">{college.accreditation.map((a,i)=><span key={i} className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">{a}</span>)}</div></div>
                  <div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-purple-600" /> Specializations Offered</h2><div className="flex flex-wrap gap-2">{college.specializations.map((s,i)=><span key={i} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">{s}</span>)}</div></div>
                </>
              )}

              {/* Courses Tab */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  {ugCourses.length > 0 && (<div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Tooth className="w-5 h-5 text-purple-600" /> Undergraduate Program</h2><div className="space-y-4">{ugCourses.map((course,i)=>{const details=getCourseDetails(course);return(<div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30"><div className="flex flex-wrap justify-between items-start gap-2 mb-2"><h3 className="font-semibold text-gray-900">{course}</h3><div className="text-right"><span className="text-purple-600 font-bold block">{details?.perSemesterFees || 'Contact'}</span>{details?.totalFees && <span className="text-xs text-gray-500">({details.totalFees})</span>}</div></div>{details && (<div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"><div><span className="text-gray-500">Duration:</span><p className="font-medium text-gray-800">{details.duration}</p></div><div><span className="text-gray-500">Seats:</span><p className="font-medium text-gray-800">{details.seats || 'Contact'}</p></div><div><span className="text-gray-500">Eligibility:</span><p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0,50)}...</p></div><div><span className="text-gray-500">Entrance:</span><p className="font-medium text-gray-800">{details.entranceExam}</p></div></div>)}{details?.specializations && (<div className="mt-3 flex flex-wrap gap-2">{details.specializations.slice(0,4).map((spec,j)=><span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{spec}</span>)}</div>)}</div>)})}</div></div>)}
                  {pgCourses.length > 0 && (<div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-purple-600" /> Postgraduate Programs (MDS)</h2><div className="space-y-4">{pgCourses.map((course,i)=>{const details=getCourseDetails(course);return(<div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30"><div className="flex flex-wrap justify-between items-start gap-2 mb-2"><h3 className="font-semibold text-gray-900">{course}</h3><div className="text-right"><span className="text-purple-600 font-bold block">{details?.perSemesterFees || 'Contact'}</span></div></div>{details && (<div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"><div><span className="text-gray-500">Duration:</span><p className="font-medium text-gray-800">{details.duration}</p></div><div><span className="text-gray-500">Seats:</span><p className="font-medium text-gray-800">{details.seats || 'Contact'}</p></div><div><span className="text-gray-500">Eligibility:</span><p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0,50)}...</p></div><div><span className="text-gray-500">Entrance:</span><p className="font-medium text-gray-800">{details.entranceExam}</p></div></div>)}</div>)})}</div></div>)}
                  <div className="bg-blue-50 rounded-xl p-4"><p className="text-sm text-gray-600"><span className="font-semibold">Note:</span> Hostel fees: ₹1,10,000 - ₹1,45,000/year. I.T.S Dental College has collaborations with Tufts University, USA and University of Leeds, UK for student exchange programs.</p></div>
                </div>
              )}

              {/* Placements Tab */}
              {activeTab === 'placements' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Placement Highlights</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6"><div className="text-center p-4 bg-green-50 rounded-lg"><div className="text-xs text-gray-500">Highest Package</div><div className="font-bold text-xl text-green-600">{college.highestPackage}</div></div><div className="text-center p-4 bg-blue-50 rounded-lg"><div className="text-xs text-gray-500">Average Package</div><div className="font-bold text-xl text-blue-600">{college.averagePackage}</div></div></div>
                  <h3 className="font-semibold text-lg mb-3">Top Recruiters</h3><div className="flex flex-wrap gap-2 mb-6">{college.topRecruiters.map((c,i)=><span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">{c}</span>)}</div>
                  <div className="bg-purple-50 rounded-lg p-4"><h4 className="font-semibold text-gray-800 mb-2">Placement USPs</h4><ul className="space-y-2 text-sm"><li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />100% placement assistance with training in aptitude, soft skills, and technical interviews</li><li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />Mentor-mentee system for personalized career guidance</li><li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />Regular mock interviews and group discussion sessions</li></ul></div>
                </div>
              )}

              {/* Global Programs Tab */}
              {activeTab === 'global' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-purple-600" /> Global Exposure Programs</h2>
                  <div className="space-y-4">{college.globalPrograms.map((program,i)=><div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"><div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0"><Globe className="w-5 h-5 text-purple-600" /></div><div><p className="text-gray-700">{program}</p></div></div>)}</div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg"><h3 className="font-semibold text-gray-800 mb-2">International Exposure Highlights</h3><ul className="space-y-2 text-sm text-gray-600"><li>✓ Student Exchange Program with Tufts University, USA</li><li>✓ Student Exchange Program with University of Leeds, UK</li><li>✓ International Conferences & Seminars</li><li>✓ Global Internship Opportunities</li></ul></div>
                </div>
              )}

              {/* Facilities Tab */}
              {activeTab === 'facilities' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Building className="w-5 h-5 text-purple-600" /> Campus Facilities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{college.facilities.map((f,i)=>{const Icon=facilityIcons[f]||Building;return(<div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"><Icon className="w-4 h-4 text-purple-600" /><span className="text-sm text-gray-700">{f}</span></div>)})}</div>
                </div>
              )}

              {/* FAQs Tab */}
              {activeTab === 'faqs' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-600" /> Frequently Asked Questions</h2>
                  <div className="space-y-3">{college.faqs.map((f,i)=><FAQItem key={i} question={f.question} answer={f.answer} />)}</div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                  <div className="space-y-3">
                    {college.contact.tollFree && (<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Phone className="w-5 h-5 text-purple-600" /><span className="text-gray-500">Toll Free:</span><a href={`tel:${college.contact.tollFree}`} className="text-purple-600 font-medium">{college.contact.tollFree}</a></div>)}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Phone className="w-5 h-5 text-purple-600" /><a href={`tel:${college.contact.phone}`} className="text-gray-900">{college.contact.phone}</a></div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Mail className="w-5 h-5 text-purple-600" /><a href={`mailto:${college.contact.email}`} className="text-gray-900 break-all">{college.contact.email}</a></div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><Globe className="w-5 h-5 text-purple-600" /><a href={`https://${college.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-purple-600">{college.contact.website}</a></div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="flex justify-between"><span className="text-gray-600">Affiliation:</span><span className="font-medium text-right">{college.affiliation}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Established:</span><span className="font-medium">{college.established}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Total Students:</span><span className="font-medium">{college.students}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Faculty Count:</span><span className="font-medium">{college.facultyCount}</span></div>
                  </div>
                  <div className="mt-6"><h3 className="font-semibold mb-2">Location</h3><div className="bg-gray-100 rounded-lg h-48"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.774!2d77.496!3d28.501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDMwJzAzLjYiTiA3N8KwMjknMzQuNyJF!5e0!3m2!1sen!2sin!4v1" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" title="I.T.S Dental College Location"></iframe></div><p className="text-sm text-gray-500 mt-2">{college.location}</p></div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1"><div className="sticky top-16 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border"><h2 className="text-xl font-semibold mb-4">Free Counseling</h2><div className="space-y-3 mb-6"><div className="flex justify-between p-3 bg-green-50 rounded-lg"><span>Application Fee</span><span className="font-bold text-green-600">FREE</span></div><div className="flex justify-between p-3 bg-blue-50 rounded-lg"><span>Last Date</span><span className="font-bold text-blue-600">30 June 2025</span></div><div className="flex justify-between p-3 bg-purple-50 rounded-lg"><span>Scholarship</span><span className="font-bold text-purple-600">Upto ₹60,000</span></div></div><button onClick={()=>setShowEnquiryForm(true)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg">Apply Now (Free)</button><div className="mt-4 text-center"><p className="text-xs text-gray-500">✓ 100% Free | ✓ Expert Guidance | ✓ Quick Response</p></div></div>
              <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-3">Quick Facts</h3><div className="space-y-2 text-sm"><div className="flex justify-between py-2 border-b"><span className="text-gray-500">Established</span><span className="font-medium">{college.established}</span></div><div className="flex justify-between py-2 border-b"><span className="text-gray-500">Approvals</span><span className="font-medium">DCI, NAAC A Grade</span></div><div className="flex justify-between py-2 border-b"><span className="text-gray-500">Student Strength</span><span className="font-medium">{college.students}</span></div><div className="flex justify-between py-2 border-b"><span className="text-gray-500">Faculty Members</span><span className="font-medium">{college.facultyCount}</span></div><div className="flex justify-between py-2"><span className="text-gray-500">Alumni Network</span><span className="font-medium">{college.alumniCount}</span></div></div></div>
            </div></div>
          </div>
        </div>

        {/* Modal */}
        {showEnquiryForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowEnquiryForm(false)}>
            <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Free Application - {college.name}</h3>
              {isSuccess ? (<div className="text-center py-8"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div><p className="text-green-600 font-semibold">Application Submitted!</p><p className="text-sm text-gray-500 mt-2">We'll contact you soon.</p></div>) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3">
                  <input type="text" placeholder="Full Name *" required value={enquiryData.name} onChange={(e)=>setEnquiryData({...enquiryData,name:e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                  <input type="tel" placeholder="Phone Number *" required value={enquiryData.phone} onChange={(e)=>setEnquiryData({...enquiryData,phone:e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="email" placeholder="Email *" required value={enquiryData.email} onChange={(e)=>setEnquiryData({...enquiryData,email:e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <select required value={enquiryData.course} onChange={(e)=>setEnquiryData({...enquiryData,course:e.target.value})} className="w-full px-4 py-2 border rounded-lg"><option value="">Select Course *</option>{college.courses.map((c,i)=><option key={i} value={c}>{c}</option>)}</select>
                  <textarea placeholder="Message (Optional)" value={enquiryData.message} onChange={(e)=>setEnquiryData({...enquiryData,message:e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows={2} />
                  <div className="flex gap-2"><button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold">{isSubmitting ? 'Submitting...' : 'Submit'}</button><button type="button" onClick={()=>setShowEnquiryForm(false)} className="flex-1 py-2 bg-gray-100 rounded-lg font-semibold">Cancel</button></div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}