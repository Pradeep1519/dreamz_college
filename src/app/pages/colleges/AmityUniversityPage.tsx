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
  Car, Building2, Target,Waves,Radio,Video
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

export function AmityUniversityPage() {
  const navigate = useNavigate();
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enquiryData, setEnquiryData] = useState({ name: '', phone: '', email: '', course: '', message: '' });

  const college = {
    id: 'amity-greater-noida',
    name: 'Amity University',
    fullName: 'Amity University Uttar Pradesh, Noida Campus',
    location: 'Sector-125, Noida, Uttar Pradesh - 201313',
    rating: 4.4,
    students: '30,000+',
    type: 'Multi-Discipline University',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'
    ],
    established: '2005',
    affiliation: 'UGC, NAAC A+',
    accreditation: ['NAAC A+', 'NIRF Rank 86', 'QS Asia Ranking', 'ASIC UK', 'ACBSP', 'IET UK'],
    ranking: 'Top Private University',
    nirfRank: '86',
    courses: [
      'B.Tech Computer Science & Engineering',
      'B.Tech CSE (Artificial Intelligence)',
      'B.Tech CSE (Data Science)',
      'B.Tech CSE (Cyber Security)',
      'B.Tech CSE (Cloud Computing)',
      'B.Tech CSE (Internet of Things)',
      'B.Tech Electronics & Communication',
      'B.Tech Mechanical Engineering',
      'B.Tech Civil Engineering',
      'B.Tech Biotechnology',
      'B.Tech Aerospace Engineering',
      'B.Tech Nuclear Science & Technology',
      'MBA (Master of Business Administration)',
      'MBA (International Business)',
      'BBA (Bachelor of Business Administration)',
      'BCA (Bachelor of Computer Applications)',
      'B.Com (Hons)',
      'B.A. LL.B (Integrated)',
      'BBA LL.B (Integrated)',
      'B.Pharm (Bachelor of Pharmacy)',
      'B.Sc Nursing',
      'B.Des (Fashion Design)',
      'B.Des (Interior Design)',
      'B.Arch (Bachelor of Architecture)',
      'BA (Journalism & Mass Communication)',
      'BA (Psychology)',
      'BA (Economics)',
      'BA (English)',
      'BA (Political Science)',
      'BA (Sociology)'
    ],
    courseDetails: {
      'B.Tech CSE': {
        name: 'B.Tech Computer Science & Engineering',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with PCM with minimum 60% marks. JEE Main/Amity JEE qualified.',
        fees: '₹2,70,000/year',
        perSemesterFees: '₹1,37,500/semester',
        totalFees: '₹10,80,000 (Total for 4 years)',
        seats: 240,
        specializations: ['AI & ML', 'Data Science', 'Cyber Security', 'Cloud Computing', 'IoT', 'Blockchain'],
        entranceExam: 'JEE Main/Amity JEE',
        highlights: ['IET UK Accreditation', 'NBA Accredited', 'Apple iOS Development Centre', 'Advanced Computing Labs']
      },
      'B.Tech CSE AI': {
        name: 'B.Tech CSE (Artificial Intelligence)',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with PCM with minimum 60% marks. JEE Main/Amity JEE qualified.',
        fees: '₹2,80,000/year',
        perSemesterFees: '₹1,42,500/semester',
        totalFees: '₹11,20,000 (Total for 4 years)',
        seats: 120,
        specializations: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Robotics'],
        entranceExam: 'JEE Main/Amity JEE',
        highlights: ['AI Specialization', 'NVIDIA AI Lab', 'Research Opportunities']
      },
      'B.Tech CSE DS': {
        name: 'B.Tech CSE (Data Science)',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with PCM with minimum 60% marks. JEE Main/Amity JEE qualified.',
        fees: '₹3,00,000/year',
        perSemesterFees: '₹1,52,500/semester',
        totalFees: '₹12,00,000 (Total for 4 years)',
        seats: 120,
        specializations: ['Data Analytics', 'Big Data', 'Machine Learning', 'Business Intelligence', 'Python & R'],
        entranceExam: 'JEE Main/Amity JEE',
        highlights: ['Oracle Collaboration', 'Data Science Labs', 'Industry Certifications']
      },
      'B.Tech Aerospace': {
        name: 'B.Tech Aerospace Engineering',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with PCM with minimum 60% marks. JEE Main/Amity JEE qualified.',
        fees: '₹1,90,500/year',
        perSemesterFees: '₹97,500/semester',
        totalFees: '₹7,62,000 (Total for 4 years)',
        seats: 60,
        specializations: ['Aerodynamics', 'Propulsion', 'Avionics', 'Spacecraft Design'],
        entranceExam: 'JEE Main/Amity JEE',
        highlights: ['Aerospace Labs', 'Wind Tunnel Facility', 'Research Opportunities']
      },
      'MBA': {
        name: 'MBA (Master of Business Administration)',
        duration: '2 Years (4 Semesters)',
        eligibility: 'Bachelor\'s degree with minimum 50% marks. CAT/MAT/CMAT/Amity Test qualified.',
        fees: '₹3,96,550/year',
        perSemesterFees: '₹2,00,775/semester',
        totalFees: '₹7,93,100 (Total for 2 years)',
        seats: 360,
        specializations: ['Marketing', 'Finance', 'Human Resource', 'Business Analytics', 'International Business', 'Digital Marketing', 'Operations'],
        entranceExam: 'CAT/MAT/CMAT/Amity Test',
        highlights: ['ACBSP Accredited', 'Industry Focused Curriculum', 'Global Exposure', '100% Placement Assistance']
      },
      'BBA': {
        name: 'Bachelor of Business Administration',
        duration: '3 Years (6 Semesters)',
        eligibility: '10+2 with minimum 50% marks.',
        fees: '₹2,09,000/year',
        perSemesterFees: '₹1,07,000/semester',
        totalFees: '₹6,27,000 (Total for 3 years)',
        seats: 480,
        specializations: ['Marketing', 'Finance', 'Human Resource', 'International Business', 'Business Analytics', 'Digital Marketing'],
        entranceExam: 'Amity Test',
        highlights: ['Industry Exposure', 'Soft Skills Training', 'Internship Program', 'Entrepreneurship Focus']
      },
      'BCA': {
        name: 'Bachelor of Computer Applications',
        duration: '3 Years (6 Semesters)',
        eligibility: '10+2 with Mathematics/Computer Science with minimum 50% marks.',
        fees: '₹1,80,000/year',
        perSemesterFees: '₹92,500/semester',
        totalFees: '₹5,40,000 (Total for 3 years)',
        seats: 240,
        specializations: ['Web Development', 'Mobile App Development', 'Data Analytics', 'Cyber Security'],
        entranceExam: 'Merit Based',
        highlights: ['Programming Labs', 'Industry Certifications', 'Project Based Learning']
      },
      'B.A. LL.B': {
        name: 'B.A. LL.B (Integrated)',
        duration: '5 Years (10 Semesters)',
        eligibility: '10+2 with minimum 50% marks. CLAT/Amity Test qualified.',
        fees: '₹1,86,000/year',
        perSemesterFees: '₹95,500/semester',
        totalFees: '₹9,30,000 (Total for 5 years)',
        seats: 120,
        specializations: ['Criminal Law', 'Corporate Law', 'Constitutional Law', 'Human Rights', 'Intellectual Property'],
        entranceExam: 'CLAT/Amity Test',
        highlights: ['BCI Approved', 'Moot Court', 'Legal Aid Clinic', 'Internship Opportunities']
      },
      'B.Pharm': {
        name: 'Bachelor of Pharmacy',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with PCB/PCM with minimum 60% marks.',
        fees: '₹1,10,000/year',
        perSemesterFees: '₹56,500/semester',
        totalFees: '₹4,40,000 (Total for 4 years)',
        seats: 100,
        specializations: ['Pharmaceutics', 'Pharmacology', 'Pharmaceutical Chemistry', 'Pharmacognosy'],
        entranceExam: 'Amity Test',
        highlights: ['PCI Approved', 'Modern Labs', 'Herbal Garden', 'Industry Training']
      }
    },
    highestPackage: '₹42 LPA',
    averagePackage: '₹6.5 LPA',
    placementRate: '88%',
    topRecruiters: [
      'Microsoft', 'Amazon', 'Google', 'Apple', 'IBM', 'Deloitte', 'KPMG', 'EY', 'PwC',
      'TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant', 'Accenture', 'Tech Mahindra',
      'ICICI Bank', 'HDFC Bank', 'Axis Bank', 'Kotak Mahindra', 'American Express',
      'Cipla', 'Sun Pharma', 'Apollo Hospitals', 'Fortis Healthcare', 'ITC', 'HUL'
    ],
    facilities: [
      'Smart Classrooms', 'Apple iMac Lab', 'NVIDIA AI Lab', 'Digital Library',
      'Hostel', 'Sports Complex', 'Wi-Fi Campus', 'Auditorium', 'Incubation Center',
      'Research Labs', 'Cafeteria', 'Transport Facility', 'Medical Facility',
      'Gymnasium', 'Bank/ATM', 'Moot Court', 'Shooting Range', 'Horse Riding Academy',
      'Swimming Pool', 'Tennis Courts', 'Football Ground', 'Cricket Ground'
    ],
    contact: {
      phone: '0120-2445252',
      email: 'admissions@amity.edu',
      website: 'www.amity.edu',
      tollFree: '1800-123-4567',
      helpline: '0120-4713600'
    },
    fees: '₹56,500 - ₹2,00,775/semester',
    reviews: 1250,
    description: 'Amity University is India\'s leading research and innovation-driven private university, established in 2005. With NAAC A+ accreditation and NIRF Rank 86, Amity offers world-class education across Engineering, Management, Law, Medical, Dental, Pharmacy, Nursing, Design, and Liberal Arts. The university boasts a 60-acre campus with state-of-the-art infrastructure, 4.1 million sq.ft. of buildings, students from 95+ countries, and 300+ global tie-ups with universities like Cambridge, Harvard, and MIT.',
    specializations: [
      'Computer Science', 'AI & ML', 'Data Science', 'Cyber Security', 'Cloud Computing', 'IoT',
      'Marketing', 'Finance', 'Human Resource', 'Business Analytics', 'International Business',
      'Criminal Law', 'Corporate Law', 'Constitutional Law', 'Pharmaceutics', 'Pharmacology'
    ],
    brochure: '/brochures/amity-university.pdf',
    achievements: [
      'NAAC A+ Grade',
      'NIRF Rank 86',
      'QS Asia University Ranking',
      'ASIC UK Accreditation',
      'ACBSP Accreditation for Management',
      'IET UK Accreditation for Engineering',
      'India\'s First ISO Certified Green University',
      '1 Megawatt Rooftop Solar Power Plant',
      'Students from 95+ Countries',
      '607 Patents Filed by Faculty'
    ],
    alumniCount: '60,000+',
    facultyCount: '4,500+',
    globalPrograms: [
      'Credit Transfer Program with UK, USA, Australia, France Universities',
      'Semester Exchange Program with 300+ Global Universities',
      'Study Abroad Program (5 weeks)',
      'International Campuses in London, Dubai, Singapore, New York, Mauritius',
      'Foreign Language Training (French, German, Japanese, Spanish, Chinese)',
      'Global Internship Opportunities',
      'International Conferences & Seminars'
    ],
    faqs: [
      { question: 'What is the eligibility for B.Tech at Amity University?', answer: '10+2 with PCM with minimum 60% marks. JEE Main/Amity JEE score is also accepted.' },
      { question: 'What is the fee structure for B.Tech CSE?', answer: 'B.Tech CSE fee is ₹2,70,000 per year (₹1,37,500 per semester). Total fee for 4 years is approximately ₹10.8 Lakhs.' },
      { question: 'Does Amity University have hostel facilities?', answer: 'Yes, separate hostels for boys and girls with AC and Non-AC rooms. Hostel fees range from ₹94,500 to ₹1,76,500 per year.' },
      { question: 'What is the placement record of Amity University?', answer: '88% placement record with highest package ₹42 LPA and average package ₹6.5 LPA. Top recruiters include Microsoft, Amazon, Google, Deloitte, KPMG.' },
      { question: 'Is Amity University approved by UGC?', answer: 'Yes, Amity University is UGC approved and NAAC A+ accredited. NIRF Rank 86.' },
      { question: 'What are the specializations available in B.Tech?', answer: 'Amity offers B.Tech in CSE, AI, Data Science, Cyber Security, Cloud Computing, IoT, ECE, ME, Civil, Aerospace, Biotechnology, and Nuclear Science.' },
      { question: 'Does Amity University offer scholarship?', answer: 'Yes, merit-based scholarships up to 100% available based on 10+2 marks, JEE Main percentile, or CUET score.' },
      { question: 'What is the admission process for MBA?', answer: 'Admission to MBA is based on CAT/MAT/CMAT/XAT scores followed by Group Discussion and Personal Interview. Minimum 50% in graduation required.' },
      { question: 'Does Amity have international campuses?', answer: 'Yes, Amity has international campuses in London, Dubai, Singapore, New York, Mauritius, South Africa, China, and Romania.' },
      { question: 'What is the global exposure at Amity University?', answer: 'Amity has 300+ international tie-ups with universities in USA, UK, Australia, France, and offers credit transfer, semester exchange, and study abroad programs.' }
    ]
  };

  const getCourseDetails = (courseName: string) => {
    if (courseName.includes('B.Tech CSE') && !courseName.includes('AI') && !courseName.includes('ML') && !courseName.includes('Data')) return college.courseDetails['B.Tech CSE'];
    if (courseName.includes('AI') && !courseName.includes('Data')) return college.courseDetails['B.Tech CSE AI'];
    if (courseName.includes('Data Science')) return college.courseDetails['B.Tech CSE DS'];
    if (courseName.includes('Aerospace')) return college.courseDetails['B.Tech Aerospace'];
    if (courseName.includes('MBA')) return college.courseDetails['MBA'];
    if (courseName.includes('BBA')) return college.courseDetails['BBA'];
    if (courseName.includes('BCA')) return college.courseDetails['BCA'];
    if (courseName.includes('B.A. LL.B')) return college.courseDetails['B.A. LL.B'];
    if (courseName.includes('B.Pharm')) return college.courseDetails['B.Pharm'];
    return null;
  };

  const submitToGoogleSheets = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name); formData.append('phone', data.phone);
      formData.append('email', data.email); formData.append('course', data.course);
      formData.append('message', data.message); formData.append('college', college.name);
      formData.append('timestamp', new Date().toISOString()); formData.append('source', 'Amity University - Apply Now');
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
    'Smart Classrooms': GraduationCap, 'Apple iMac Lab': Laptop, 'NVIDIA AI Lab': Zap,
    'Digital Library': Library, 'Hostel': Home, 'Sports Complex': Dumbbell, 'Wi-Fi Campus': Wifi,
    'Auditorium': UsersRound, 'Incubation Center': Rocket, 'Research Labs': Microscope,
    'Cafeteria': Coffee, 'Transport Facility': Bus, 'Medical Facility': Heart, 'Gymnasium': Dumbbell,
    'Bank/ATM': Shield, 'Moot Court': BookOpen, 'Shooting Range': Target, 'Horse Riding Academy': Car,
    'Swimming Pool': Waves, 'Tennis Courts': Award, 'Football Ground': Building2, 'Cricket Ground': Building2
  };

  const engineeringCourses = college.courses.filter(c => c.includes('B.Tech'));
  const managementCourses = college.courses.filter(c => c.includes('MBA') || c.includes('BBA') || c.includes('B.Com'));
  const itCourses = college.courses.filter(c => c.includes('BCA') || c.includes('MCA'));
  const lawCourses = college.courses.filter(c => c.includes('LL.B'));
  const pharmacyCourses = college.courses.filter(c => c.includes('Pharm'));
  const designCourses = college.courses.filter(c => c.includes('B.Des') || c.includes('B.Arch'));
  const artsCourses = college.courses.filter(c => c.includes('BA') && !c.includes('LL.B') && !c.includes('BBA'));

  return (
    <>
      <Helmet><title>{college.name} - Fees, Placements, Ranking 2026 | Top Private University in Noida</title>
      <meta name="description" content={`${college.name} - Explore fees (${college.fees}), placement packages (${college.highestPackage}), courses offered (B.Tech, MBA, BBA, BCA, LL.B). NAAC A+ | NIRF Rank 86 | 300+ Global Tie-ups. Get free counseling for 2026 admissions!`} /></Helmet>

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
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full"><MapPin className="w-4 h-4" />Sector-125, Noida</div>
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
            <div className="text-center"><div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center"><Award className="w-8 h-8 text-purple-600" /></div><div className="font-bold text-2xl text-gray-900">5+</div><div className="text-sm text-gray-500">Accreditations</div></div>
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
                  {engineeringCourses.length > 0 && (<div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Cap className="w-5 h-5 text-purple-600" /> Engineering Programs</h2><div className="space-y-4">{engineeringCourses.slice(0,8).map((course,i)=>{const details=getCourseDetails(course);return(<div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30"><div className="flex flex-wrap justify-between items-start gap-2 mb-2"><h3 className="font-semibold text-gray-900">{course}</h3><div className="text-right"><span className="text-purple-600 font-bold block">{details?.perSemesterFees || 'Contact'}</span>{details?.totalFees && <span className="text-xs text-gray-500">({details.totalFees})</span>}</div></div>{details && (<div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"><div><span className="text-gray-500">Duration:</span><p className="font-medium text-gray-800">{details.duration}</p></div><div><span className="text-gray-500">Seats:</span><p className="font-medium text-gray-800">{details.seats || 'Contact'}</p></div><div><span className="text-gray-500">Eligibility:</span><p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0,50)}...</p></div><div><span className="text-gray-500">Entrance:</span><p className="font-medium text-gray-800">{details.entranceExam}</p></div></div>)}{details?.specializations && (<div className="mt-3 flex flex-wrap gap-2">{details.specializations.slice(0,4).map((spec,j)=><span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{spec}</span>)}</div>)}</div>)})}</div></div>)}
                  {managementCourses.length > 0 && (<div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-600" /> Management Programs</h2><div className="space-y-4">{managementCourses.map((course,i)=>{const details=getCourseDetails(course);return(<div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30"><div className="flex flex-wrap justify-between items-start gap-2 mb-2"><h3 className="font-semibold text-gray-900">{course}</h3><div className="text-right"><span className="text-purple-600 font-bold block">{details?.perSemesterFees || details?.fees || 'Contact'}</span></div></div>{details && (<div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"><div><span className="text-gray-500">Duration:</span><p className="font-medium text-gray-800">{details.duration}</p></div><div><span className="text-gray-500">Seats:</span><p className="font-medium text-gray-800">{details.seats || 'Contact'}</p></div><div><span className="text-gray-500">Eligibility:</span><p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0,50)}...</p></div><div><span className="text-gray-500">Entrance:</span><p className="font-medium text-gray-800">{details.entranceExam}</p></div></div>)}</div>)})}</div></div>)}
                  {itCourses.length > 0 && (<div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Laptop className="w-5 h-5 text-purple-600" /> IT & Computer Applications</h2><div className="space-y-4">{itCourses.map((course,i)=>{const details=getCourseDetails(course);return(<div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30"><div className="flex flex-wrap justify-between items-start gap-2 mb-2"><h3 className="font-semibold text-gray-900">{course}</h3><div className="text-right"><span className="text-purple-600 font-bold block">{details?.perSemesterFees || 'Contact'}</span></div></div>{details && (<div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"><div><span className="text-gray-500">Duration:</span><p className="font-medium text-gray-800">{details.duration}</p></div><div><span className="text-gray-500">Seats:</span><p className="font-medium text-gray-800">{details.seats || 'Contact'}</p></div><div><span className="text-gray-500">Eligibility:</span><p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0,50)}...</p></div><div><span className="text-gray-500">Entrance:</span><p className="font-medium text-gray-800">{details.entranceExam}</p></div></div>)}</div>)})}</div></div>)}
                  {lawCourses.length > 0 && (<div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-600" /> Law Programs</h2><div className="space-y-4">{lawCourses.map((course,i)=>{const details=getCourseDetails(course);return(<div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30"><div className="flex flex-wrap justify-between items-start gap-2 mb-2"><h3 className="font-semibold text-gray-900">{course}</h3><div className="text-right"><span className="text-purple-600 font-bold block">{details?.perSemesterFees || 'Contact'}</span></div></div>{details && (<div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"><div><span className="text-gray-500">Duration:</span><p className="font-medium text-gray-800">{details.duration}</p></div><div><span className="text-gray-500">Seats:</span><p className="font-medium text-gray-800">{details.seats || 'Contact'}</p></div><div><span className="text-gray-500">Eligibility:</span><p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0,50)}...</p></div><div><span className="text-gray-500">Entrance:</span><p className="font-medium text-gray-800">{details.entranceExam}</p></div></div>)}</div>)})}</div></div>)}
                  <div className="bg-blue-50 rounded-xl p-4"><p className="text-sm text-gray-600"><span className="font-semibold">Note:</span> Hostel fees: ₹94,500 - ₹1,76,500/year. Scholarships available for meritorious students up to 100%. Amity has 11 global campuses across London, Dubai, Singapore, New York, and more.</p></div>
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
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg"><h3 className="font-semibold text-gray-800 mb-2">International Exposure Highlights</h3><ul className="space-y-2 text-sm text-gray-600"><li>✓ Credit Transfer Program with 300+ Global Universities (UK, USA, Australia, France)</li><li>✓ Semester Exchange Program (Zero Tuition Fee)</li><li>✓ International Campuses in London, Dubai, Singapore, New York, Mauritius</li><li>✓ Study Abroad Program (5 weeks)</li><li>✓ Foreign Language Training (French, German, Japanese, Spanish, Chinese)</li></ul></div>
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
                  <div className="mt-6"><h3 className="font-semibold mb-2">Location</h3><div className="bg-gray-100 rounded-lg h-48"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.774!2d77.496!3d28.501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cea123456789%3A0x123456789!2sAmity%20University!5e0!3m2!1sen!2sin!4v1" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" title="Amity University Location"></iframe></div><p className="text-sm text-gray-500 mt-2">{college.location}</p></div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1"><div className="sticky top-16 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border"><h2 className="text-xl font-semibold mb-4">Free Counseling</h2><div className="space-y-3 mb-6"><div className="flex justify-between p-3 bg-green-50 rounded-lg"><span>Application Fee</span><span className="font-bold text-green-600">FREE</span></div><div className="flex justify-between p-3 bg-blue-50 rounded-lg"><span>Last Date</span><span className="font-bold text-blue-600">30 June 2025</span></div><div className="flex justify-between p-3 bg-purple-50 rounded-lg"><span>Scholarship</span><span className="font-bold text-purple-600">Upto 100%</span></div></div><button onClick={()=>setShowEnquiryForm(true)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg">Apply Now (Free)</button><div className="mt-4 text-center"><p className="text-xs text-gray-500">✓ 100% Free | ✓ Expert Guidance | ✓ Quick Response</p></div></div>
              <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-3">Quick Facts</h3><div className="space-y-2 text-sm"><div className="flex justify-between py-2 border-b"><span className="text-gray-500">Established</span><span className="font-medium">{college.established}</span></div><div className="flex justify-between py-2 border-b"><span className="text-gray-500">Approvals</span><span className="font-medium">NAAC A+, UGC, NIRF 86</span></div><div className="flex justify-between py-2 border-b"><span className="text-gray-500">Student Strength</span><span className="font-medium">{college.students}</span></div><div className="flex justify-between py-2 border-b"><span className="text-gray-500">Faculty Members</span><span className="font-medium">{college.facultyCount}</span></div><div className="flex justify-between py-2"><span className="text-gray-500">Alumni Network</span><span className="font-medium">{college.alumniCount}</span></div></div></div>
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