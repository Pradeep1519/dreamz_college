import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ShieldCheck, Award as AwardIcon, Laptop, Flower
} from 'lucide-react';

// Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDnkO1oYjHUbM1KLDRP8W_-GJ1wOrVPBeKD9jC1jAvqEOd63qmnFO9f6keAD7TFC7B/exec';

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-3 text-gray-600 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export function AccurateInstitutePage() {
  const navigate = useNavigate();
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    message: ''
  });

  // College Data from PDF
  const college = {
    id: 'accurate-institute',
    name: 'Accurate Institute of Management and Technology',
    shortName: 'Accurate Institute',
    fullName: 'Accurate Institute of Management and Technology, Greater Noida',
    location: '49, Knowledge Park III, Greater Noida, Uttar Pradesh - 201306',
    rating: 4.2,
    students: '2,500+',
    type: 'Multi-Discipline',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'
    ],
    established: '2006',
    affiliation: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow',
    accreditation: ['AICTE', 'NBA', 'NAAC A Grade', 'ISO 9001:2015'],
    ranking: 'Top 50 B-Schools in India',
    nirfRank: 'Top 200',
    courses: [
      'PGDM (Post Graduate Diploma in Management)',
      'MBA (Master of Business Administration)',
      'B.Tech Computer Science & Engineering',
      'B.Tech Mechanical Engineering',
      'B.Tech Electronics & Communication Engineering',
      'B.Tech Electrical & Electronics Engineering',
      'B.Tech Civil Engineering',
      'B.Pharm (Bachelor of Pharmacy)',
      'D.Pharm (Diploma in Pharmacy)',
      'BBA (Bachelor of Business Administration)',
      'BCA (Bachelor of Computer Applications)'
    ],
    courseDetails: {
      'PGDM': {
        name: 'PGDM (Post Graduate Diploma in Management)',
        duration: '2 Years (Full Time)',
        eligibility: 'Bachelor\'s degree with minimum 50% marks. Valid score in CAT/MAT/CMAT/XAT.',
        fees: '₹5,75,000 (Total)',
        perSemesterFees: '₹1,43,750/semester',
        seats: 120,
        specializations: ['Marketing', 'Finance', 'Human Resource Management', 'Business Analytics', 'Banking', 'International Business', 'Operations & Supply Chain Management'],
        entranceExam: 'CAT/MAT/CMAT/XAT',
        highlights: ['AICTE Approved', 'Industry Focused Curriculum', 'Global Immersion Program', '100% Placement Record']
      },
      'MBA': {
        name: 'MBA (Master of Business Administration)',
        duration: '2 Years (Full Time)',
        eligibility: 'Bachelor\'s degree with minimum 50% marks. UPSEE/CUET qualified.',
        fees: '₹1,54,500/year',
        perSemesterFees: '₹77,250/semester',
        seats: 60,
        specializations: ['Marketing', 'Finance', 'Human Resource Management', 'Information Technology', 'International Business'],
        entranceExam: 'UPSEE/CUET',
        highlights: ['Affiliated to AKTU', 'Industry Oriented Curriculum', 'Case Based Teaching', 'Soft Skill Development']
      },
      'B.Tech CSE': {
        name: 'B.Tech Computer Science & Engineering',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks. JEE Main/UPSEE qualified.',
        fees: '₹1,57,200/semester',
        perSemesterFees: '₹1,57,200/semester',
        totalFees: '₹12,57,600 (Total for 4 years)',
        seats: 120,
        specializations: ['Artificial Intelligence & Machine Learning', 'Data Science', 'Cyber Security', 'Cloud Computing', 'Internet of Things'],
        entranceExam: 'JEE Main/UPSEE',
        highlights: ['NBA Accredited', 'Advanced Computing Labs', 'Industry Certifications', 'Research Opportunities']
      },
      'B.Tech ME': {
        name: 'B.Tech Mechanical Engineering',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks. JEE Main/UPSEE qualified.',
        fees: '₹1,57,200/semester',
        perSemesterFees: '₹1,57,200/semester',
        totalFees: '₹12,57,600 (Total for 4 years)',
        seats: 60,
        specializations: ['Automobile Engineering', 'Production Engineering', 'Thermal Engineering', 'Robotics'],
        entranceExam: 'JEE Main/UPSEE',
        highlights: ['Modern Workshops', 'CAD/CAM Labs', 'Industry Tie-ups with Toyota', 'Research Projects']
      },
      'B.Tech ECE': {
        name: 'B.Tech Electronics & Communication Engineering',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks. JEE Main/UPSEE qualified.',
        fees: '₹1,57,200/semester',
        perSemesterFees: '₹1,57,200/semester',
        totalFees: '₹12,57,600 (Total for 4 years)',
        seats: 60,
        specializations: ['VLSI Design', 'Embedded Systems', 'IoT', 'Communication Systems'],
        entranceExam: 'JEE Main/UPSEE',
        highlights: ['Advanced Electronics Labs', 'PCB Design Lab', 'Robotics Lab', 'Industry Projects']
      },
      'B.Tech EEE': {
        name: 'B.Tech Electrical & Electronics Engineering',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks. JEE Main/UPSEE qualified.',
        fees: '₹1,57,200/semester',
        perSemesterFees: '₹1,57,200/semester',
        totalFees: '₹12,57,600 (Total for 4 years)',
        seats: 60,
        specializations: ['Power Systems', 'Renewable Energy', 'Electric Vehicles', 'Control Systems'],
        entranceExam: 'JEE Main/UPSEE',
        highlights: ['Power System Lab', 'Electrical Machines Lab', 'Renewable Energy Lab', 'Industry Exposure']
      },
      'B.Tech CE': {
        name: 'B.Tech Civil Engineering',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks. JEE Main/UPSEE qualified.',
        fees: '₹1,57,200/semester',
        perSemesterFees: '₹1,57,200/semester',
        totalFees: '₹12,57,600 (Total for 4 years)',
        seats: 60,
        specializations: ['Structural Engineering', 'Transportation Engineering', 'Geotechnical Engineering', 'Environmental Engineering'],
        entranceExam: 'JEE Main/UPSEE',
        highlights: ['Surveying Lab', 'Material Testing Lab', 'CAD Lab', 'Industry Visits']
      },
      'B.Pharm': {
        name: 'Bachelor of Pharmacy',
        duration: '4 Years (8 Semesters)',
        eligibility: '10+2 with PCB/PCM with minimum 45% marks.',
        fees: '₹1,23,000/semester',
        perSemesterFees: '₹1,23,000/semester',
        totalFees: '₹9,84,000 (Total for 4 years)',
        seats: 60,
        specializations: ['Pharmaceutics', 'Pharmacology', 'Pharmaceutical Chemistry', 'Pharmacognosy'],
        entranceExam: 'UPSEE',
        highlights: ['PCI Approved', 'Modern Labs', 'Herbal Garden', 'Industry Training']
      },
      'D.Pharm': {
        name: 'Diploma in Pharmacy',
        duration: '2 Years (4 Semesters)',
        eligibility: '10+2 with PCB/PCM with minimum 50% marks.',
        fees: '₹50,000/semester',
        perSemesterFees: '₹50,000/semester',
        totalFees: '₹2,00,000 (Total for 2 years)',
        seats: 60,
        entranceExam: 'JEECUP',
        highlights: ['PCI Approved', 'Practical Training', 'Hospital Internship']
      },
      'BBA': {
        name: 'Bachelor of Business Administration',
        duration: '3 Years (6 Semesters)',
        eligibility: '10+2 with minimum 45% marks.',
        fees: '₹82,500/year',
        perSemesterFees: '₹41,250/semester',
        totalFees: '₹2,47,500 (Total for 3 years)',
        seats: 120,
        specializations: ['Marketing', 'Finance', 'Human Resource', 'International Business'],
        entranceExam: 'Merit Based',
        highlights: ['Industry Exposure', 'Soft Skills Training', 'Internship Program']
      },
      'BCA': {
        name: 'Bachelor of Computer Applications',
        duration: '3 Years (6 Semesters)',
        eligibility: '10+2 with Mathematics/Computer Science with minimum 45% marks.',
        fees: '₹47,500/semester',
        perSemesterFees: '₹47,500/semester',
        totalFees: '₹2,85,000 (Total for 3 years)',
        seats: 60,
        specializations: ['Web Development', 'Mobile App Development', 'Data Analytics', 'Cyber Security'],
        entranceExam: 'Merit Based',
        highlights: ['Programming Labs', 'Industry Certifications', 'Project Based Learning']
      }
    },
    highestPackage: '₹15 LPA',
    averagePackage: '₹5.8 LPA',
    placementRate: '95%',
    topRecruiters: [
      'Barclays Bank', 'HDFC Bank', 'Indusind Bank', 'Reliance Industries', 'Redington India Ltd',
      'Bose Corp (USA)', 'Kotak Mahindra Bank', 'Jaro Education', 'Dabur', 'Indian Oil', 'ITC',
      'Capital IQ', 'HCL Technologies', 'Coca-Cola', 'Vodafone', 'Yes Bank', 'IBM', 'HP',
      'ICICI Bank', 'Microsoft', 'Wipro', 'TCS', 'Accenture', 'Deloitte', 'KPMG', 'Amazon'
    ],
    facilities: [
      'Smart Classrooms', 'Advanced Computer Labs', 'Digital Library', 'Language Lab',
      'Hostel (Boys & Girls)', 'Sports Complex', 'Wi-Fi Campus', 'Auditorium',
      'Incubation Center', 'Research Labs', 'Cafeteria', 'Transport Facility',
      'Medical Facility', 'Gymnasium', 'Bank/ATM', 'Herbal Garden'
    ],
    contact: {
      phone: '+91-7411003030',
      email: 'admissions@accurate.in',
      website: 'www.accurate.in',
      tollFree: '1800-123-4567',
      helpline: '0120-2322817'
    },
    fees: '₹41,250 - ₹1,57,200/semester',
    reviews: 1250,
    description: 'Accurate Institute of Management and Technology, established in 2006, is a premier educational institution in Greater Noida offering diverse programs in Engineering, Management, Pharmacy, and Computer Applications. With state-of-the-art infrastructure, experienced faculty, and strong industry connections, Accurate has consistently delivered excellent academic results and placement records.',
    specializations: [
      'Computer Science Engineering', 'Mechanical Engineering', 'Electronics & Communication',
      'Civil Engineering', 'Artificial Intelligence & Machine Learning', 'Data Science',
      'Marketing', 'Finance', 'Human Resource', 'Business Analytics', 'Pharmaceutics', 'Pharmacology'
    ],
    brochure: '/brochures/accurate-institute.pdf',
    achievements: [
      'NAAC A Grade Accreditation',
      'NBA Accreditation for B.Tech Programs',
      'Top 50 B-Schools in India',
      'Best Placement Record 2024',
      'AICTE Approved',
      'ISO 9001:2015 Certified'
    ],
    alumniCount: '8,500+',
    facultyCount: '250+',
    globalPrograms: [
      'Global Immersion Program at Nanyang Technological University, Singapore',
      'Study Tour to University of Auckland, New Zealand',
      'International Internship Opportunities',
      'Collaboration with International Universities'
    ],
    faqs: [
      {
        question: 'What is the eligibility for B.Tech at Accurate Institute?',
        answer: 'Candidate must have passed 10+2 with Physics, Chemistry, and Mathematics with minimum 45% marks. JEE Main/UPSEE score is also accepted.'
      },
      {
        question: 'What is the fee structure for B.Tech CSE?',
        answer: 'The fee for B.Tech CSE is ₹1,57,200 per semester. Total fee for 4 years is approximately ₹12.6 Lakhs.'
      },
      {
        question: 'Does Accurate Institute provide hostel facilities?',
        answer: 'Yes, Accurate Institute has separate hostels for boys and girls with AC and Non-AC rooms. Hostel fees range from ₹1,10,000 to ₹1,45,000 per year including mess.'
      },
      {
        question: 'What is the placement record of Accurate Institute?',
        answer: 'Accurate Institute has 95%+ placement record with top recruiters like Barclays, HDFC Bank, Reliance, IBM, and TCS. Highest package is ₹15 LPA, average package is ₹5.8 LPA.'
      },
      {
        question: 'Is Accurate Institute approved by AICTE?',
        answer: 'Yes, Accurate Institute is approved by AICTE, and various programs are accredited by NBA and NAAC A Grade.'
      },
      {
        question: 'What are the specializations available in B.Tech?',
        answer: 'Accurate Institute offers B.Tech in CSE, ME, ECE, EEE, and Civil Engineering with specializations in AI & ML, Data Science, Cyber Security, and IoT.'
      },
      {
        question: 'Does Accurate Institute offer scholarship?',
        answer: 'Yes, merit-based scholarships up to ₹60,000 are available for students with good scores in entrance exams and academics. Scholarships for SC/ST/OBC students are also available as per government norms.'
      },
      {
        question: 'What is the admission process for PGDM?',
        answer: 'Admission to PGDM is based on CAT/MAT/CMAT/XAT scores followed by Group Discussion and Personal Interview. Minimum 50% in graduation required.'
      },
      {
        question: 'What is the Global Immersion Program?',
        answer: 'Accurate Institute offers Global Immersion Program where students visit international universities like Nanyang Technological University (Singapore) and University of Auckland (New Zealand) for cultural and academic exposure.'
      },
      {
        question: 'What is the alumni network strength?',
        answer: 'Accurate Institute has an alumni network of 8,500+ professionals working in top companies across India and abroad.'
      }
    ]
  };

  // Get course details for current selection
  const getCourseDetails = (courseName: string) => {
    const key = Object.keys(college.courseDetails).find(k => 
      courseName.includes(k) || 
      (k === 'B.Tech CSE' && courseName.includes('Computer Science')) ||
      (k === 'B.Tech ME' && courseName.includes('Mechanical')) ||
      (k === 'B.Tech ECE' && courseName.includes('Electronics')) ||
      (k === 'B.Tech EEE' && courseName.includes('Electrical')) ||
      (k === 'B.Tech CE' && courseName.includes('Civil'))
    );
    return key ? college.courseDetails[key as keyof typeof college.courseDetails] : null;
  };

  const submitToGoogleSheets = async (data: any) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('phone', data.phone);
      formDataToSend.append('email', data.email);
      formDataToSend.append('course', data.course);
      formDataToSend.append('message', data.message);
      formDataToSend.append('college', college.name);
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('source', 'Accurate Institute - Apply Now');

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.error('Google Sheets Error:', error);
      return false;
    }
  };

  const handleChatWithExpert = () => {
    const message = `👋 Hello! I'm interested in ${college.name}. Can you guide me about admission process?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '918796033021';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enquiryData.name || !enquiryData.phone || !enquiryData.email || !enquiryData.course) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitToGoogleSheets(enquiryData);

      const message = `📬 *New Application - ${college.name}*
      
👤 *Name:* ${enquiryData.name}
📞 *Phone:* ${enquiryData.phone}
📧 *Email:* ${enquiryData.email}
📚 *Course:* ${enquiryData.course}
💬 *Message:* ${enquiryData.message || 'No message'}
⏰ *Time:* ${new Date().toLocaleString()}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = '918796033021';
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

      setIsSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setIsSuccess(false);
        setShowEnquiryForm(false);
        setEnquiryData({ name: '', phone: '', email: '', course: '', message: '' });
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % college.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + college.gallery.length) % college.gallery.length);
  };

  const facilityIcons: { [key: string]: any } = {
    'Smart Classrooms': GraduationCap,
    'Advanced Computer Labs': Laptop,
    'Digital Library': Library,
    'Language Lab': MessageCircle,
    'Hostel (Boys & Girls)': Home,
    'Sports Complex': Dumbbell,
    'Wi-Fi Campus': Wifi,
    'Auditorium': UsersRound,
    'Incubation Center': Rocket,
    'Research Labs': Microscope,
    'Cafeteria': Coffee,
    'Transport Facility': Bus,
    'Medical Facility': Heart,
    'Gymnasium': Dumbbell,
    'Bank/ATM': Shield,
    'Herbal Garden': Flower
  };

  // Course categories for display
  const engineeringCourses = college.courses.filter(c => 
    c.includes('B.Tech') || c.includes('Computer Science') || c.includes('Mechanical') || 
    c.includes('Electronics') || c.includes('Electrical') || c.includes('Civil')
  );
  
  const managementCourses = college.courses.filter(c => 
    c.includes('PGDM') || c.includes('MBA') || c.includes('BBA')
  );
  
  const pharmacyCourses = college.courses.filter(c => 
    c.includes('Pharm') || c.includes('Pharmacy')
  );
  
  const itCourses = college.courses.filter(c => 
    c.includes('BCA') || c.includes('Computer Applications')
  );

  // ========== STRUCTURED DATA SCHEMA FOR SEO ==========
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": college.name,
    "url": `https://dreamzcollege.in/college/${college.id}`,
    "logo": "https://dreamzcollege.in/logo.png",
    "image": college.image,
    "description": college.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "49, Knowledge Park III",
      "addressLocality": "Greater Noida",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201306",
      "addressCountry": "IN"
    },
    "telephone": college.contact.phone,
    "email": college.contact.email,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": college.rating,
      "reviewCount": college.reviews,
      "bestRating": "5",
      "worstRating": "1"
    },
    "makesOffer": college.courses.slice(0, 8).map(course => ({
      "@type": "Offer",
      "name": course,
      "price": college.fees,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    })),
    "hasCourse": college.courses.slice(0, 8).map(course => ({
      "@type": "Course",
      "name": course,
      "provider": {
        "@type": "CollegeOrUniversity",
        "name": college.name
      }
    })),
    "potentialAction": {
      "@type": "ApplyAction",
      "name": "Apply Now",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://dreamzcollege.in/counseling",
        "inLanguage": "en-IN",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    }
  };
  // ========== END STRUCTURED DATA ==========

  return (
    <>
      <Helmet>
        <title>{college.name} - Fees, Placements, Ranking 2026 | Top College in Greater Noida</title>
        <meta name="description" content={`${college.name} - Explore fees (${college.fees}), placement packages (${college.highestPackage}), courses offered. Get free counseling for 2026 admissions!`} />
        <meta name="keywords" content={`${college.name}, ${college.name} fees, ${college.name} placements, ${college.name} ranking, colleges in Greater Noida, PGDM colleges, B.Tech colleges Greater Noida`} />
        <link rel="canonical" href={`https://dreamzcollege.in/college/${college.id}`} />
        
        {/* Structured Data Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Gallery */}
        <div className="relative h-[70vh] min-h-[600px] w-full group">
          <img 
            src={college.gallery[currentImageIndex]} 
            alt={`${college.name} campus`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          
          {college.gallery.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}
          
          {college.gallery.length > 1 && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {currentImageIndex + 1} / {college.gallery.length}
            </div>
          )}
          
          {college.gallery.length > 0 && (
            <button
              onClick={() => setShowGalleryModal(true)}
              className="absolute bottom-32 right-8 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm flex items-center gap-2 transition-all"
            >
              <ImageIcon className="w-4 h-4" />
              View Gallery
            </button>
          )}
          
          <button
            onClick={() => navigate('/colleges')}
            className="absolute top-24 left-4 md:left-8 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full transition-all flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Colleges</span>
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 py-8 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-purple-600 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                <Crown className="w-4 h-4" />
                {college.type}
              </span>
              {college.nirfRank && (
                <span className="px-4 py-1.5 bg-blue-600 rounded-full text-sm font-medium shadow-lg">
                  NIRF {college.nirfRank}
                </span>
              )}
              <span className="px-4 py-1.5 bg-yellow-600 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                <Star className="w-4 h-4 fill-white" />
                {college.rating} ({college.reviews}+)
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">{college.name}</h1>
            <p className="text-white/90 text-base md:text-lg mb-4 drop-shadow">{college.fullName}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <MapPin className="w-4 h-4" />
                <span>Knowledge Park III, Greater Noida</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Calendar className="w-4 h-4" />
                <span>Est. {college.established}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Users className="w-4 h-4" />
                <span>{college.students}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <img 
              src={college.gallery[currentImageIndex]} 
              alt={`${college.name} campus view ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRightIcon className="w-8 h-8" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {college.gallery.length}
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">4+</div>
              <div className="text-sm text-gray-500">Accreditations</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">{college.alumniCount}</div>
              <div className="text-sm text-gray-500">Alumni Network</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">{college.placementRate}</div>
              <div className="text-sm text-gray-500">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">{college.highestPackage}</div>
              <div className="text-sm text-gray-500">Highest Package</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEnquiryForm(true)}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <Rocket className="w-5 h-5" />
              Apply Now (Free)
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChatWithExpert}
              className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with Expert
            </motion.button>
            
            {college.brochure && (
              <motion.a
                href={college.brochure}
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="w-5 h-5" />
                Brochure
              </motion.a>
            )}
          </div>
        </div>

        {/* Sticky Tabs */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'courses', label: 'Courses & Fees' },
                { id: 'placements', label: 'Placements' },
                { id: 'global', label: 'Global Programs' },
                { id: 'facilities', label: 'Facilities' },
                { id: 'faqs', label: 'FAQs' },
                { id: 'contact', label: 'Contact' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-4 font-medium text-sm whitespace-nowrap transition-all relative ${
                    activeTab === tab.id 
                      ? 'text-purple-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'courses' && (
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {college.courses.length}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-purple-600" />
                      About {college.name}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{college.description}</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Medal className="w-5 h-5 text-purple-600" />
                      Key Achievements
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {college.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <BadgeCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      Accreditations & Approvals
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {college.accreditation.map((acc, i) => (
                        <span key={i} className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                      Specializations Offered
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {college.specializations.map((spec, i) => (
                        <span key={i} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Courses Tab */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  {/* Engineering Programs */}
                  {engineeringCourses.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Cap className="w-5 h-5 text-purple-600" />
                        Engineering Programs
                      </h2>
                      <div className="space-y-4">
                        {engineeringCourses.map((course, i) => {
                          const details = getCourseDetails(course);
                          return (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{course}</h3>
                                <div className="text-right">
                                  <span className="text-purple-600 font-bold block">{details?.perSemesterFees || details?.fees || 'Contact for fee'}</span>
                                  {details?.totalFees && (
                                    <span className="text-xs text-gray-500">({details.totalFees})</span>
                                  )}
                                </div>
                              </div>
                              {details && (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500">Duration:</span>
                                    <p className="font-medium text-gray-800">{details.duration}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Seats:</span>
                                    <p className="font-medium text-gray-800">{details.seats || 'Contact'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Eligibility:</span>
                                    <p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0, 50)}...</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Entrance:</span>
                                    <p className="font-medium text-gray-800">{details.entranceExam}</p>
                                  </div>
                                </div>
                              )}
                              {details?.specializations && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {details.specializations.slice(0, 4).map((spec, j) => (
                                    <span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      {spec}
                                    </span>
                                  ))}
                                  {details.specializations.length > 4 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      +{details.specializations.length - 4}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Management Programs */}
                  {managementCourses.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        Management Programs
                      </h2>
                      <div className="space-y-4">
                        {managementCourses.map((course, i) => {
                          const details = getCourseDetails(course);
                          return (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{course}</h3>
                                <div className="text-right">
                                  <span className="text-purple-600 font-bold block">{details?.perSemesterFees || details?.fees || 'Contact for fee'}</span>
                                  {details?.totalFees && (
                                    <span className="text-xs text-gray-500">({details.totalFees})</span>
                                  )}
                                </div>
                              </div>
                              {details && (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500">Duration:</span>
                                    <p className="font-medium text-gray-800">{details.duration}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Seats:</span>
                                    <p className="font-medium text-gray-800">{details.seats || 'Contact'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Eligibility:</span>
                                    <p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0, 50)}...</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Entrance:</span>
                                    <p className="font-medium text-gray-800">{details.entranceExam}</p>
                                  </div>
                                </div>
                              )}
                              {details?.specializations && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {details.specializations.slice(0, 4).map((spec, j) => (
                                    <span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      {spec}
                                    </span>
                                  ))}
                                  {details.specializations.length > 4 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      +{details.specializations.length - 4}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Pharmacy Programs */}
                  {pharmacyCourses.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-purple-600" />
                        Pharmacy Programs
                      </h2>
                      <div className="space-y-4">
                        {pharmacyCourses.map((course, i) => {
                          const details = getCourseDetails(course);
                          return (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{course}</h3>
                                <div className="text-right">
                                  <span className="text-purple-600 font-bold block">{details?.perSemesterFees || details?.fees || 'Contact for fee'}</span>
                                  {details?.totalFees && (
                                    <span className="text-xs text-gray-500">({details.totalFees})</span>
                                  )}
                                </div>
                              </div>
                              {details && (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500">Duration:</span>
                                    <p className="font-medium text-gray-800">{details.duration}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Seats:</span>
                                    <p className="font-medium text-gray-800">{details.seats || 'Contact'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Eligibility:</span>
                                    <p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0, 50)}...</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Entrance:</span>
                                    <p className="font-medium text-gray-800">{details.entranceExam}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* IT Programs */}
                  {itCourses.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Laptop className="w-5 h-5 text-purple-600" />
                        Computer Application Programs
                      </h2>
                      <div className="space-y-4">
                        {itCourses.map((course, i) => {
                          const details = getCourseDetails(course);
                          return (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{course}</h3>
                                <div className="text-right">
                                  <span className="text-purple-600 font-bold block">{details?.perSemesterFees || details?.fees || 'Contact for fee'}</span>
                                  {details?.totalFees && (
                                    <span className="text-xs text-gray-500">({details.totalFees})</span>
                                  )}
                                </div>
                              </div>
                              {details && (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500">Duration:</span>
                                    <p className="font-medium text-gray-800">{details.duration}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Seats:</span>
                                    <p className="font-medium text-gray-800">{details.seats || 'Contact'}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Eligibility:</span>
                                    <p className="font-medium text-gray-800 text-xs">{details.eligibility.substring(0, 50)}...</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Entrance:</span>
                                    <p className="font-medium text-gray-800">{details.entranceExam}</p>
                                  </div>
                                </div>
                              )}
                              {details?.specializations && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {details.specializations.slice(0, 4).map((spec, j) => (
                                    <span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      {spec}
                                    </span>
                                  ))}
                                  {details.specializations.length > 4 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      +{details.specializations.length - 4}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Fee Note */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Note:</span> Hostel fees: ₹1,10,000 - ₹1,45,000/year. Scholarships available for meritorious students. For exact fee structure, please contact admission office.
                    </p>
                  </div>
                </div>
              )}

              {/* Placements Tab */}
              {activeTab === 'placements' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Placement Highlights</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-xs text-gray-500">Highest Package</div>
                      <div className="font-bold text-xl text-green-600">{college.highestPackage}</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xs text-gray-500">Average Package</div>
                      <div className="font-bold text-xl text-blue-600">{college.averagePackage}</div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-3">Top Recruiters</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {college.topRecruiters.map((company, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {company}
                      </span>
                    ))}
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Placement USPs</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>100% placement assistance with training in aptitude, soft skills, and technical interviews</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Mentor-mentee system for personalized career guidance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Regular mock interviews and group discussion sessions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Industry-oriented training programs and certification courses</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Global Programs Tab */}
              {activeTab === 'global' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    Global Exposure Programs
                  </h2>
                  
                  <div className="space-y-4">
                    {college.globalPrograms.map((program, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-gray-700">{program}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Global Immersion Highlights</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ Visit to Nanyang Technological University, Singapore</li>
                      <li>✓ Educational tour to University of Auckland, New Zealand</li>
                      <li>✓ International internship opportunities</li>
                      <li>✓ Cross-cultural learning experiences</li>
                      <li>✓ Certification from international universities</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Facilities Tab */}
              {activeTab === 'facilities' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    Campus Facilities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {college.facilities.map((facility, i) => {
                      const Icon = facilityIcons[facility] || Building;
                      return (
                        <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Icon className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-700">{facility}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FAQs Tab - Using separate FAQItem component */}
              {activeTab === 'faqs' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {college.faqs.map((faq, index) => (
                      <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>
                  
                  <div className="space-y-3">
                    {college.contact.tollFree && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-500">Toll Free:</span>
                        <a href={`tel:${college.contact.tollFree}`} className="text-purple-600 font-medium">
                          {college.contact.tollFree}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <a href={`tel:${college.contact.phone}`} className="text-gray-900">
                        {college.contact.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <a href={`mailto:${college.contact.email}`} className="text-gray-900 break-all">
                        {college.contact.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <a href={`https://${college.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-purple-600">
                        {college.contact.website}
                      </a>
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Affiliation:</span>
                      <span className="font-medium text-right">{college.affiliation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Established:</span>
                      <span className="font-medium">{college.established}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Students:</span>
                      <span className="font-medium">{college.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Faculty Count:</span>
                      <span className="font-medium">{college.facultyCount}</span>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                    <div className="bg-gray-100 rounded-lg overflow-hidden h-48">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.774123456789!2d77.496123456789!3d28.50123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cea123456789%3A0x123456789!2sAccurate%20Institute%20of%20Management%20and%20Technology!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy"
                        title="Accurate Institute Location"
                      ></iframe>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{college.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-16 space-y-6">
                {/* Free Counseling Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Free Counseling</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span>Application Fee</span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Last Date</span>
                      <span className="font-bold text-blue-600">30 June 2025</span>
                    </div>
                    <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                      <span>Scholarship</span>
                      <span className="font-bold text-purple-600">Upto ₹60,000</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowEnquiryForm(true)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Apply Now (Free)
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">✓ 100% Free | ✓ Expert Guidance | ✓ Quick Response</p>
                  </div>
                </div>

                {/* Quick Facts Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Facts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Established</span>
                      <span className="font-medium">{college.established}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Approvals</span>
                      <span className="font-medium">AICTE, NBA, NAAC</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Student Strength</span>
                      <span className="font-medium">{college.students}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Faculty Members</span>
                      <span className="font-medium">{college.facultyCount}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Alumni Network</span>
                      <span className="font-medium">{college.alumniCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Form Modal */}
        {showEnquiryForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowEnquiryForm(false)}>
            <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Free Application - {college.name}</h3>
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-green-600 font-semibold">Application Submitted Successfully!</p>
                  <p className="text-sm text-gray-500 mt-2">We'll contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Full Name *" 
                    required 
                    value={enquiryData.name} 
                    onChange={(e) => setEnquiryData({...enquiryData, name: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number *" 
                    required 
                    value={enquiryData.phone} 
                    onChange={(e) => setEnquiryData({...enquiryData, phone: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                  <input 
                    type="email" 
                    placeholder="Email *" 
                    required 
                    value={enquiryData.email} 
                    onChange={(e) => setEnquiryData({...enquiryData, email: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                  <select 
                    required 
                    value={enquiryData.course} 
                    onChange={(e) => setEnquiryData({...enquiryData, course: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Course *</option>
                    {college.courses.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                  <textarea 
                    placeholder="Message (Optional)" 
                    value={enquiryData.message} 
                    onChange={(e) => setEnquiryData({...enquiryData, message: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    rows={2} 
                  />
                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Free Application'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowEnquiryForm(false)} 
                      className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}