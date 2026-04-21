// src/app/components/Navigation.tsx

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Phone, Menu, X, ChevronDown, GraduationCap, Briefcase, Microscope, Scale, Heart, Laptop, Search, ChevronRight, Sparkles, Trophy, Target, Zap, User, LogOut, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookingModal } from './BookingModal';
import { Login } from './Login';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface NavigationProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

// ✅ Admin emails list
const ADMIN_EMAILS = [
  'Juniordream2025@gmail.com',        // 🔴 CHANGE KARO - Apna email daalo
  'admin@dreamzcollege.in',
  'juniotdream3021@gmail.com'
];

const explorePrograms = {
  ugPrograms: [
    { label: 'Engineering (B.Tech)', icon: Laptop, path: '/colleges?course=btech', description: '4 Years • Full Time' },
    { label: 'Management (BBA)', icon: Briefcase, path: '/colleges?course=bba', description: '3 Years • Full Time' },
    { label: 'Computer Applications (BCA)', icon: GraduationCap, path: '/colleges?course=bca', description: '3 Years • Full Time' },
    { label: 'Commerce (B.Com)', icon: Scale, path: '/colleges?course=bcom', description: '3 Years • Full Time' },
    { label: 'Law (BA LLB)', icon: Scale, path: '/colleges?course=law', description: '5 Years • Integrated' },
    { label: 'Nursing (B.Sc)', icon: Heart, path: '/colleges?course=nursing', description: '4 Years • Full Time' },
    { label: 'Pharmacy (B.Pharm)', icon: Microscope, path: '/colleges?course=pharmacy', description: '4 Years • Full Time' },
  ],
  pgPrograms: [
    { label: 'MBA (Master of Business)', icon: Briefcase, path: '/colleges?course=mba', description: '2 Years • Full Time' },
    { label: 'MCA (Computer Applications)', icon: GraduationCap, path: '/colleges?course=mca', description: '2 Years • Full Time' },
    { label: 'M.Tech (Engineering)', icon: Laptop, path: '/colleges?course=mtech', description: '2 Years • Full Time' },
    { label: 'LLM (Law)', icon: Scale, path: '/colleges?course=llm', description: '2 Years • Full Time' },
    { label: 'M.Sc Nursing', icon: Heart, path: '/colleges?course=msc-nursing', description: '2 Years • Full Time' },
    { label: 'M.Pharm', icon: Microscope, path: '/colleges?course=mpharm', description: '2 Years • Full Time' },
  ],
  diplomaPrograms: [
    { label: 'Polytechnic Diploma', icon: Laptop, path: '/colleges?course=polytechnic', description: '3 Years • Full Time' },
    { label: 'D.Pharm (Pharmacy)', icon: Microscope, path: '/colleges?course=dpharm', description: '2 Years • Full Time' },
    { label: 'GNM (Nursing)', icon: Heart, path: '/colleges?course=gnm', description: '3.5 Years • Full Time' },
  ],
  otherPrograms: [
    { label: 'Online Programs', icon: Laptop, path: '/colleges?course=online', description: 'Flexible Learning' },
    { label: 'Executive Education', icon: Briefcase, path: '/colleges?course=executive', description: 'For Working Professionals' },
  ],
};

const LOGO_URL = '/logo1.png';

const PremiumTag = ({ text, variant }: { text: string; variant: 'purple' | 'blue' | 'green' | 'orange' | 'pink' }) => {
  const variants = {
    purple: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-purple-500/30',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-blue-500/30',
    green: 'bg-gradient-to-r from-green-500 to-green-700 text-white shadow-green-500/30',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-orange-500/30',
    pink: 'bg-gradient-to-r from-pink-500 to-pink-700 text-white shadow-pink-500/30',
  };
  
  const icons = {
    purple: <Sparkles className="w-2.5 h-2.5" />,
    blue: <Target className="w-2.5 h-2.5" />,
    green: <Zap className="w-2.5 h-2.5" />,
    orange: <Trophy className="w-2.5 h-2.5" />,
    pink: <Heart className="w-2.5 h-2.5" />,
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${variants[variant]} shadow-md`}>
      {icons[variant]}
      {text}
    </span>
  );
};

export function Navigation({ activePage, onPageChange }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (window.scrollY > 20) {
      setHasScrolled(true);
    }
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 10) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
    
    const scrollDifference = Math.abs(latest - lastScrollY);
    
    if (latest > lastScrollY && scrollDifference > 1 && latest > 50) {
      setIsVisible(false);
    } 
    else if (latest < lastScrollY && scrollDifference > 1) {
      setIsVisible(true);
    }
    
    setLastScrollY(latest);
  });

  const handleNavigation = (pageId: string, path: string) => {
    if (location.pathname === path) {
      return;
    }
    onPageChange(pageId);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onPageChange('Home');
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  const handleBookingComplete = () => {
    setTimeout(() => {
      onPageChange('Counseling');
      navigate('/counseling');
    }, 500);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSignIn = () => {
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    console.log('User logged in successfully');
  };

  const isAdmin = user && ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');

  return (
    <>
      <motion.nav 
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: 1
        }}
        transition={{ 
          type: "tween",
          duration: 0.15,
          ease: "easeOut"
        }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          hasScrolled 
            ? 'bg-white/95 shadow-lg' 
            : 'bg-white/90 shadow-md'
        } border-b border-gray-200/20 backdrop-blur-sm`}
      >
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600"
          animate={{ scaleX: hasScrolled ? 1 : 0.4 }}
          transition={{ duration: 0.1 }}
          style={{ originX: 0 }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* LOGO SECTION */}
            <motion.div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0"
              onClick={handleLogoClick}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <motion.img
                src={LOGO_URL}
                alt="Dreamz College"
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              />
              <div className="flex flex-col">
                <motion.h1 
                  className="text-xs sm:text-sm md:text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%' }}
                  transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0 }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  Dreamz College
                </motion.h1>
                <p className="text-[5px] sm:text-[7px] md:text-[9px] text-gray-500 font-medium whitespace-nowrap">
                  Learn from achievers to become one
                </p>
              </div>
            </motion.div>

            {/* DESKTOP SEARCH BAR */}
            <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses, colleges, exams..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              
              {/* DESKTOP DROPDOWN */}
              <div className="hidden lg:block relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isDropdownOpen 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>Explore Programs</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-[900px] xl:w-[1000px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="grid grid-cols-4 gap-4 p-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <GraduationCap className="w-4 h-4 text-purple-600" />
                            <h4 className="font-bold text-gray-800 text-sm">UG Programs</h4>
                            <PremiumTag text="After 12th" variant="purple" />
                          </div>
                          <ul className="space-y-2">
                            {explorePrograms.ugPrograms.map((program, idx) => (
                              <motion.li
                                key={idx}
                                whileHover={{ x: 5 }}
                                className="cursor-pointer"
                                onClick={() => {
                                  handleNavigation(program.label, program.path);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <div className="flex items-center justify-between group">
                                  <div className="flex items-center gap-2">
                                    <program.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-600" />
                                    <span className="text-xs text-gray-700 group-hover:text-purple-600 transition-colors">
                                      {program.label}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-purple-500" />
                                </div>
                                <p className="text-[10px] text-gray-400 ml-5">{program.description}</p>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            <h4 className="font-bold text-gray-800 text-sm">PG Programs</h4>
                            <PremiumTag text="After Graduation" variant="blue" />
                          </div>
                          <ul className="space-y-2">
                            {explorePrograms.pgPrograms.map((program, idx) => (
                              <motion.li
                                key={idx}
                                whileHover={{ x: 5 }}
                                className="cursor-pointer"
                                onClick={() => {
                                  handleNavigation(program.label, program.path);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <div className="flex items-center justify-between group">
                                  <div className="flex items-center gap-2">
                                    <program.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600" />
                                    <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors">
                                      {program.label}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500" />
                                </div>
                                <p className="text-[10px] text-gray-400 ml-5">{program.description}</p>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <Laptop className="w-4 h-4 text-green-600" />
                            <h4 className="font-bold text-gray-800 text-sm">Diploma Programs</h4>
                            <PremiumTag text="After 10th/12th" variant="green" />
                          </div>
                          <ul className="space-y-2 mb-4">
                            {explorePrograms.diplomaPrograms.map((program, idx) => (
                              <motion.li
                                key={idx}
                                whileHover={{ x: 5 }}
                                className="cursor-pointer"
                                onClick={() => {
                                  handleNavigation(program.label, program.path);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <div className="flex items-center justify-between group">
                                  <div className="flex items-center gap-2">
                                    <program.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-600" />
                                    <span className="text-xs text-gray-700 group-hover:text-green-600 transition-colors">
                                      {program.label}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-green-500" />
                                </div>
                                <p className="text-[10px] text-gray-400 ml-5">{program.description}</p>
                              </motion.li>
                            ))}
                          </ul>
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <GraduationCap className="w-4 h-4 text-orange-600" />
                            <h4 className="font-bold text-gray-800 text-sm">Other Programs</h4>
                            <PremiumTag text="Special" variant="orange" />
                          </div>
                          <ul className="space-y-2">
                            {explorePrograms.otherPrograms.map((program, idx) => (
                              <motion.li
                                key={idx}
                                whileHover={{ x: 5 }}
                                className="cursor-pointer"
                                onClick={() => {
                                  handleNavigation(program.label, program.path);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <div className="flex items-center justify-between group">
                                  <div className="flex items-center gap-2">
                                    <program.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-600" />
                                    <span className="text-xs text-gray-700 group-hover:text-orange-600 transition-colors">
                                      {program.label}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-orange-500" />
                                </div>
                                <p className="text-[10px] text-gray-400 ml-5">{program.description}</p>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-l border-gray-100 pl-4">
                          <div className="mb-4">
                            <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-purple-600" />
                              Top Universities
                            </h4>
                            <ul className="space-y-1">
                              <li className="text-xs text-gray-600 hover:text-purple-600 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-purple-50">AKTU, Lucknow</li>
                              <li className="text-xs text-gray-600 hover:text-purple-600 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-purple-50">CCSU, Meerut</li>
                              <li className="text-xs text-gray-600 hover:text-purple-600 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-purple-50">GGSIPU, Delhi</li>
                              <li className="text-xs text-gray-600 hover:text-purple-600 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-purple-50">UPBTE, Lucknow</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SIGN IN / USER MENU */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-gray-700 rounded-full font-medium text-xs md:text-sm shadow-sm hover:shadow-md transition-all"
                    >
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="max-w-[80px] truncate">{userData?.name?.split(' ')[0] || 'User'}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </motion.button>
                    
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{userData?.email || user?.phoneNumber}</p>
                          </div>
                          
                          {/* ✅ Admin Panel Link - Only for admin */}
                          {isAdmin && (
                            <button
                              onClick={() => {
                                navigate('/admin/dashboard');
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2 border-b border-gray-100"
                            >
                              <Shield className="w-4 h-4" />
                              Admin Panel
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              navigate('/dashboard');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <User className="w-4 h-4" />
                            Dashboard
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignIn}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </motion.button>
                )}
              </div>

              {/* FREE COUNSELING BUTTON */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsBookingModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium text-xs md:text-sm shadow-md hover:shadow-lg transition-shadow whitespace-nowrap"
              >
                <Phone className="w-3 h-3 md:w-4 md:h-4" />
                <span>Free Counseling</span>
              </motion.button>

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-100 flex items-center justify-center"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="lg:hidden mt-3 py-3 border-t border-gray-200 bg-white rounded-b-2xl shadow-lg"
              >
                <div className="flex flex-col max-h-[70vh] overflow-y-auto">
                  
                  {/* Mobile user section */}
                  {user ? (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">👋 Namaste, {userData?.name?.split(' ')[0]}</p>
                      <div className="flex flex-col gap-2 mt-2">
                        {/* ✅ Admin Panel Link in Mobile Menu */}
                        {isAdmin && (
                          <button
                            onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }}
                            className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg text-sm flex items-center justify-center gap-2"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </button>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm">Dashboard</button>
                          <button onClick={handleLogout} className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-sm">Sign Out</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <button onClick={() => { handleSignIn(); setIsMobileMenuOpen(false); }} className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm">Sign In / Sign Up</button>
                    </div>
                  )}
                  
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                      className="w-full px-5 py-3 text-left flex items-center justify-between text-gray-700 font-medium"
                    >
                      <span>Explore Programs</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isMobileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50"
                        >
                          <div className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <GraduationCap className="w-4 h-4 text-purple-600" />
                              <p className="text-xs font-semibold text-purple-600">UG Programs</p>
                              <PremiumTag text="After 12th" variant="purple" />
                            </div>
                            {explorePrograms.ugPrograms.map((program, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  handleNavigation(program.label, program.path);
                                  setIsMobileDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center gap-2 rounded-lg"
                              >
                                <program.icon className="w-4 h-4" />
                                {program.label}
                              </button>
                            ))}
                            
                            <div className="flex items-center gap-2 mb-2 mt-3">
                              <Briefcase className="w-4 h-4 text-blue-600" />
                              <p className="text-xs font-semibold text-blue-600">PG Programs</p>
                              <PremiumTag text="After Graduation" variant="blue" />
                            </div>
                            {explorePrograms.pgPrograms.map((program, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  handleNavigation(program.label, program.path);
                                  setIsMobileDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2 rounded-lg"
                              >
                                <program.icon className="w-4 h-4" />
                                {program.label}
                              </button>
                            ))}
                            
                            <div className="flex items-center gap-2 mb-2 mt-3">
                              <Laptop className="w-4 h-4 text-green-600" />
                              <p className="text-xs font-semibold text-green-600">Diploma Programs</p>
                              <PremiumTag text="After 10th/12th" variant="green" />
                            </div>
                            {explorePrograms.diplomaPrograms.map((program, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  handleNavigation(program.label, program.path);
                                  setIsMobileDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors flex items-center gap-2 rounded-lg"
                              >
                                <program.icon className="w-4 h-4" />
                                {program.label}
                              </button>
                            ))}
                            
                            <div className="flex items-center gap-2 mb-2 mt-3">
                              <GraduationCap className="w-4 h-4 text-orange-600" />
                              <p className="text-xs font-semibold text-orange-600">Other Programs</p>
                              <PremiumTag text="Special" variant="orange" />
                            </div>
                            {explorePrograms.otherPrograms.map((program, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  handleNavigation(program.label, program.path);
                                  setIsMobileDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2 rounded-lg"
                              >
                                <program.icon className="w-4 h-4" />
                                {program.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="border-t border-gray-100 my-2"></div>
                  
                  <button
                    onClick={() => {
                      setIsBookingModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="mx-4 my-2 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Book Free Counseling</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingComplete={handleBookingComplete}
      />

      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}