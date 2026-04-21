import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { Navigation } from './components/Navigation';
import { CoursesSection } from './components/CoursesSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { CoursesPage } from './components/CoursesPage';
import { CollegesPage } from './components/CollegesPage';
import { CounselingPage } from './components/CounselingPage';
import { ContactPage } from './components/ContactPage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { HeroSection } from './components/HeroSection';
import { BookingModal } from './components/BookingModal';
import { CareerPage } from './components/CareerPage';
import { ExamPage } from './components/ExamPage';
import { trackPageView } from '../lib/analytics';
import { LeadPopup } from './components/LeadPopup';
import { usePopupTimer } from './hooks/usePopupTimer';
import { EngineeringCollegesPage } from './components/EngineeringCollegesPage';
import { MBACollegesPage } from './components/MBACollegesPage';
import { MedicalCollegesPage } from './components/MedicalCollegesPage';
import { NursingCollegesPage } from './components/NursingCollegesPage';
import { PharmacyCollegesPage } from './components/PharmacyCollegesPage';
import { LawCollegesPage } from './components/LawCollegesPage';
import { BCACollegesPage } from './components/BCACollegesPage';
import { BBACollegesPage } from './components/BBACollegesPage';
import { PrivateUniversitiesPage } from './components/PrivateUniversitiesPage';
import { LowFeeCollegesPage } from './components/LowFeeCollegesPage';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Login } from './components/Login';

// Import Blog Components
import { BlogListPage } from './components/blog/BlogListPage';
import { BlogDetailPage } from './components/blog/BlogDetailPage';

// ========== NEW: Firebase Auth & Course Form Imports ==========
import { AuthProvider } from '../context/AuthContext';
import { CourseFormPage } from './components/CourseFormPage';
import { UserDashboard } from './components/UserDashboard';

// Import all college pages
import { AccurateInstitutePage } from './pages/colleges/AccurateInstitutePage';
import { GNGroupPage } from './pages/colleges/GNGroupPage';
import { MangalmayPage } from './pages/colleges/MangalmayPage';
import { ShardaUniversityPage } from './pages/colleges/ShardaUniversityPage';
import { GalgotiasUniversityPage } from './pages/colleges/GalgotiasUniversityPage';
import { NIETPage } from './pages/colleges/NIETPage';
import { GLBajajPage } from './pages/colleges/GLBajajPage';
import { IIMTGroupPage } from './pages/colleges/IIMTPage';
import { LloydInstitutePage } from './pages/colleges/LloydPage';
import { ITSEngineeringGreaterNoidaPage } from './pages/colleges/ITSEngineeringPage';
import { AmityUniversityPage } from './pages/colleges/AmityUniversityPage';
import { BennettUniversityPage } from './pages/colleges/BennettUniversityPage';
import { DronacharyaGroupPage } from './pages/colleges/DronacharyaPage';
import { NIMTCollegePage } from './pages/colleges/NIMTPage';
import { NoidaInternationalUniversityPage } from './pages/colleges/NoidaInternationalPage';
import { RamEeshInstitutePage } from './pages/colleges/RamEeshPage';
import { UnitedCollegeOfEducationPage } from './pages/colleges/UnitedCollegePage';
import { ITSMohanNagarPage } from './pages/colleges/ITSMohanNagarPage';
import { ITSGhaziabadPage } from './pages/colleges/ITSGhaziabadPage';
import { ITSHealthSciencesPage } from './pages/colleges/ITSHealthSciencesPage';
import { ITSDentalCollegePage } from './pages/colleges/ITSDentalCollegePage';
import { ITSSchoolOfManagementPage } from './pages/colleges/ITSSchoolOfManagementPage';
import { InnovativeGroupPage } from './pages/colleges/InnovativeGroupPage';
import { IshanEducationalPage } from './pages/colleges/IshanPage';
import { JIMSRohiniPage } from './pages/colleges/JIMSPage';
import { KCCInstitutePage } from './pages/colleges/KCCInstitutePage';
import { KCCLegalHigherEducationPage } from './pages/colleges/KCCLegalHigherEducationPage';
import { MetroHealthSciencesPage } from './pages/colleges/MetroCollegePage';
import { GNIOTGroupPage } from './pages/colleges/GNIOTPage';
import { HIMTGroupPage } from './pages/colleges/HIMTPage';
import { GlobalInstitutePage } from './pages/colleges/GlobalInstitutePage';

// ========== SCROLL TO TOP COMPONENT ==========
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);
  
  return null;
}

// ========== WRAPPER FOR ALL PAGES ==========
function PageWrapper({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return <>{children}</>;
}

// ========== APP CONTENT ==========
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('Home');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // ✅ Login Popup State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const { isOpen: isPopupOpen, closePopup, markAsSubmitted } = usePopupTimer(40);

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  // SCROLL TO TOP ON ACTIVE PAGE CHANGE
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  // Update active page based on path
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/') {
      setActivePage('Home');
    } else if (path === '/engineering-colleges') {
      setActivePage('EngineeringColleges');
    } else if (path === '/mba-colleges') {
      setActivePage('MBAColleges');
    } else if (path === '/medical-colleges') {
      setActivePage('MedicalColleges');
    } else if (path === '/nursing-colleges') {
      setActivePage('NursingColleges');
    } else if (path === '/pharmacy-colleges') {
      setActivePage('PharmacyColleges');
    } else if (path === '/law-colleges') {
      setActivePage('LawColleges');
    } else if (path === '/bca-colleges') {
      setActivePage('BCAColleges');
    } else if (path === '/bba-colleges') {
      setActivePage('BBAColleges');
    } else if (path === '/private-universities') {
      setActivePage('PrivateUniversities');
    } else if (path === '/low-fee-colleges') {
      setActivePage('LowFeeColleges');
    } else if (path === '/colleges') {
      setActivePage('Colleges');
    } else if (path === '/courses') {
      setActivePage('Courses');
    } else if (path === '/counseling') {
      setActivePage('Counseling');
    } else if (path === '/contact') {
      setActivePage('Contact');
    } else if (path === '/about') {
      setActivePage('About');
    } else if (path === '/career') {
      setActivePage('Career');
    } else if (path === '/exams') {
      setActivePage('Exams');
    } else if (path === '/privacy-policy') {
      setActivePage('PrivacyPolicy');
    } else if (path === '/terms-of-service') {
      setActivePage('TermsOfService');
    } else if (path === '/blog') {
      setActivePage('Blog');
    } else if (path.startsWith('/blog/')) {
      setActivePage('BlogDetail');
    } else if (path.startsWith('/college/')) {
      setActivePage('CollegeDetails');
    } else if (path.startsWith('/exam/')) {
      setActivePage('ExamDetails');
    } else if (path.startsWith('/career/')) {
      setActivePage('JobDetails');
    } else if (path === '/dashboard') {
      setActivePage('Dashboard');
    }
  }, [location]);

  const handleBookCounseling = () => {
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = () => {
    setTimeout(() => {
      setActivePage('Counseling');
      navigate('/counseling');
    }, 500);
  };

  const handleChatWithExpert = () => {
    const whatsappNumber = '918796033021';
    const whatsappMessage = 'Hello Dreamz College Team! I need guidance for college admission and course selection.';
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleNavigateToBlogDetail = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  // ✅ Login Success Handler
  const handleLoginSuccess = () => {
    console.log('User logged in successfully');
    // Optional: Refresh user state or redirect
  };

  const renderContent = () => {
    switch (activePage) {
      case 'About':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <AboutPage />
            </div>
          </div>
        );
      case 'Courses':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <CoursesPage 
                preSelectedCourse={selectedCourse}
                onBookCounseling={handleBookCounseling}
              />
            </div>
          </div>
        );
      case 'Colleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <CollegesPage />
            </div>
          </div>
        );
      case 'EngineeringColleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <EngineeringCollegesPage />
            </div>
          </div>
        );
      case 'MBAColleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <MBACollegesPage />
            </div>
          </div>
        );
      case 'MedicalColleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <MedicalCollegesPage />
            </div>
          </div>
        );
      case 'NursingColleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <NursingCollegesPage />
            </div>
          </div>
        );
      case 'PharmacyColleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <PharmacyCollegesPage />
            </div>
          </div>
        );
      case 'LawColleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <LawCollegesPage />
            </div>
          </div>
        );
      case 'BCAColleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <BCACollegesPage />
            </div>
          </div>
        );
      case 'BBAColleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <BBACollegesPage />
            </div>
          </div>
        );
      case 'PrivateUniversities':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <PrivateUniversitiesPage />
            </div>
          </div>
        );
      case 'LowFeeColleges':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <LowFeeCollegesPage />
            </div>
          </div>
        );
      case 'Career':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <CareerPage />
            </div>
          </div>
        );
      case 'Exams':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <ExamPage />
            </div>
          </div>
        );
      case 'Blog':
        return (
          <div className="pt-20">
            <BlogListPage onNavigateToBlogDetail={handleNavigateToBlogDetail} />
          </div>
        );
      case 'BlogDetail':
        return null;
      case 'Dashboard':
        return (
          <div className="pt-20">
            <UserDashboard />
          </div>
        );
      case 'CollegeDetails':
      case 'ExamDetails':
      case 'JobDetails':
        return null;
      case 'Counseling':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <CounselingPage />
            </div>
          </div>
        );
      case 'Contact':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <ContactPage />
            </div>
          </div>
        );
      case 'PrivacyPolicy':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <PrivacyPolicyPage />
            </div>
          </div>
        );
      case 'TermsOfService':
        return (
          <div className="pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <TermsOfServicePage />
            </div>
          </div>
        );
      default:
        return (
          <>
            <HeroSection />
            <CoursesSection 
              onCourseClick={(courseTitle) => {
                setSelectedCourse(courseTitle);
              }}
              onNavigateToCourses={() => {
                setActivePage('Courses');
                navigate('/courses');
              }}
            />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection 
              onNavigateToCounseling={() => {
                setActivePage('Counseling');
                navigate('/counseling');
              }}
              onChatWithExpert={handleChatWithExpert}
              whatsappNumber="918796033021"
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navigation 
        activePage={activePage} 
        onPageChange={(page) => {
          setActivePage(page);
          if (page === 'Home') navigate('/');
          else if (page === 'Courses') navigate('/courses');
          else if (page === 'Colleges') navigate('/colleges');
          else if (page === 'Career') navigate('/career');
          else if (page === 'Exams') navigate('/exams');
          else if (page === 'Counseling') navigate('/counseling');
          else if (page === 'Contact') navigate('/contact');
          else if (page === 'About') navigate('/about');
          else if (page === 'Blog') navigate('/blog');
          else if (page === 'Dashboard') navigate('/dashboard');
        }} 
        onBookCounseling={handleBookCounseling}
        onSignIn={() => setIsLoginOpen(true)}  // ✅ NEW: Pass signin handler to Navigation
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.main>
      </AnimatePresence>

      <Footer onNavigate={(page) => {
        setActivePage(page);
        if (page === 'Home') navigate('/');
        else if (page === 'Courses') navigate('/courses');
        else if (page === 'Colleges') navigate('/colleges');
        else if (page === 'Career') navigate('/career');
        else if (page === 'Exams') navigate('/exams');
        else if (page === 'Counseling') navigate('/counseling');
        else if (page === 'Contact') navigate('/contact');
        else if (page === 'About') navigate('/about');
        else if (page === 'Blog') navigate('/blog');
        else if (page === 'Dashboard') navigate('/dashboard');
      }} />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingComplete={handleBookingComplete}
      />

      {/* ✅ Login Popup Modal - Blur Background wala */}
      <Login 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Analytics />
      
      <LeadPopup isOpen={isPopupOpen} onClose={closePopup} onSuccess={markAsSubmitted} />
    </div>
  );
}

// ========== MAIN APP ==========
export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* New Course Form & Dashboard Routes */}
            <Route path="/course/:courseSlug/:courseName" element={<PageWrapper><CourseFormPage /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><UserDashboard /></PageWrapper>} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<PageWrapper><BlogListPage onNavigateToBlogDetail={(slug) => window.location.href = `/blog/${slug}`} /></PageWrapper>} />
            <Route path="/blog/:slug" element={<PageWrapper><BlogDetailPage /></PageWrapper>} />
            
            {/* College Detail Routes */}
            <Route path="/college/accurate-institute" element={<PageWrapper><AccurateInstitutePage /></PageWrapper>} />
            <Route path="/college/gn-group" element={<PageWrapper><GNGroupPage /></PageWrapper>} />
            <Route path="/college/mangalmay" element={<PageWrapper><MangalmayPage /></PageWrapper>} />
            <Route path="/college/sharda-university" element={<PageWrapper><ShardaUniversityPage /></PageWrapper>} />
            <Route path="/college/galgotias-university" element={<PageWrapper><GalgotiasUniversityPage /></PageWrapper>} />
            <Route path="/college/niet" element={<PageWrapper><NIETPage /></PageWrapper>} />
            <Route path="/college/gl-bajaj" element={<PageWrapper><GLBajajPage /></PageWrapper>} />
            <Route path="/college/iimt-group" element={<PageWrapper><IIMTGroupPage /></PageWrapper>} />
            <Route path="/college/lloyd" element={<PageWrapper><LloydInstitutePage /></PageWrapper>} />
            <Route path="/college/its-engineering" element={<PageWrapper><ITSEngineeringGreaterNoidaPage /></PageWrapper>} />
            <Route path="/college/amity-greater-noida" element={<PageWrapper><AmityUniversityPage /></PageWrapper>} />
            <Route path="/college/bennett-university" element={<PageWrapper><BennettUniversityPage /></PageWrapper>} />
            <Route path="/college/dronacharya" element={<PageWrapper><DronacharyaGroupPage /></PageWrapper>} />
            <Route path="/college/nimt-college" element={<PageWrapper><NIMTCollegePage /></PageWrapper>} />
            <Route path="/college/noida-international-university" element={<PageWrapper><NoidaInternationalUniversityPage /></PageWrapper>} />
            <Route path="/college/ram-eesh-institute" element={<PageWrapper><RamEeshInstitutePage /></PageWrapper>} />
            <Route path="/college/united-college-of-education" element={<PageWrapper><UnitedCollegeOfEducationPage /></PageWrapper>} />
            <Route path="/college/its-mohan-nagar" element={<PageWrapper><ITSMohanNagarPage /></PageWrapper>} />
            <Route path="/college/its-ghaziabad" element={<PageWrapper><ITSGhaziabadPage /></PageWrapper>} />
            <Route path="/college/its-health-sciences" element={<PageWrapper><ITSHealthSciencesPage /></PageWrapper>} />
            <Route path="/college/its-dental-college" element={<PageWrapper><ITSDentalCollegePage /></PageWrapper>} />
            <Route path="/college/its-school-of-management" element={<PageWrapper><ITSSchoolOfManagementPage /></PageWrapper>} />
            <Route path="/college/innovative-group" element={<PageWrapper><InnovativeGroupPage /></PageWrapper>} />
            <Route path="/college/ishan-educational" element={<PageWrapper><IshanEducationalPage /></PageWrapper>} />
            <Route path="/college/jims-noida" element={<PageWrapper><JIMSRohiniPage /></PageWrapper>} />
            <Route path="/college/kcc-institute" element={<PageWrapper><KCCInstitutePage /></PageWrapper>} />
            <Route path="/college/kcc-legal-higher-education" element={<PageWrapper><KCCLegalHigherEducationPage /></PageWrapper>} />
            <Route path="/college/metro-college" element={<PageWrapper><MetroHealthSciencesPage /></PageWrapper>} />
            <Route path="/college/gniot" element={<PageWrapper><GNIOTGroupPage /></PageWrapper>} />
            <Route path="/college/himt-college" element={<PageWrapper><HIMTGroupPage /></PageWrapper>} />
            <Route path="/college/global-institute" element={<PageWrapper><GlobalInstitutePage /></PageWrapper>} />
            
            <Route path="/college/:collegeId" element={<PageWrapper><AccurateInstitutePage /></PageWrapper>} />
            
            <Route path="/exam/:examId" element={<PageWrapper><ExamPage /></PageWrapper>} />
            <Route path="/career/:jobId" element={<PageWrapper><CareerPage /></PageWrapper>} />
            <Route path="/engineering-colleges" element={<PageWrapper><EngineeringCollegesPage /></PageWrapper>} />
            <Route path="/mba-colleges" element={<PageWrapper><MBACollegesPage /></PageWrapper>} />
            <Route path="/medical-colleges" element={<PageWrapper><MedicalCollegesPage /></PageWrapper>} />
            <Route path="/nursing-colleges" element={<PageWrapper><NursingCollegesPage /></PageWrapper>} />
            <Route path="/pharmacy-colleges" element={<PageWrapper><PharmacyCollegesPage /></PageWrapper>} />
            <Route path="/law-colleges" element={<PageWrapper><LawCollegesPage /></PageWrapper>} />
            <Route path="/bca-colleges" element={<PageWrapper><BCACollegesPage /></PageWrapper>} />
            <Route path="/bba-colleges" element={<PageWrapper><BBACollegesPage /></PageWrapper>} />
            <Route path="/private-universities" element={<PageWrapper><PrivateUniversitiesPage /></PageWrapper>} />
            <Route path="/low-fee-colleges" element={<PageWrapper><LowFeeCollegesPage /></PageWrapper>} />
            
            {/* ✅ Login route bhi rakha hai (agar direct URL se koi aaye) */}
            <Route path="/login" element={<PageWrapper><Login isOpen={true} onClose={() => window.history.back()} /></PageWrapper>} />

            <Route path="/*" element={<AppContent />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}