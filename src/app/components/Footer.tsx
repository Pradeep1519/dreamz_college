import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, MapPin, Facebook, Instagram, Linkedin, 
  MessageCircle, Briefcase, BookOpen, ArrowRight, 
  Send, ChevronRight, Heart, Sparkles, Award, Clock,
  Shield, Star, ChevronUp, GraduationCap, Building2, 
  Landmark, Stethoscope, Pill, Scale, Laptop, Library,
  TrendingUp, DollarSign, Wallet, Newspaper, Calendar, Headphones, ContactIcon
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

// Logo URL from public folder
const LOGO_URL = '/logo1.png';

export function Footer({ onNavigate }: FooterProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (onNavigate) {
        onNavigate('Home');
      }
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowBackToTop(window.scrollY > 500);
    });
  }

  const categoryLinks = [
    { name: 'Engineering Colleges', icon: GraduationCap, path: '/engineering-colleges', color: 'text-blue-500' },
    { name: 'MBA Colleges', icon: Briefcase, path: '/mba-colleges', color: 'text-purple-500' },
    { name: 'Medical Colleges', icon: Stethoscope, path: '/medical-colleges', color: 'text-red-500' },
    { name: 'Nursing Colleges', icon: Heart, path: '/nursing-colleges', color: 'text-pink-500' },
    { name: 'Pharmacy Colleges', icon: Pill, path: '/pharmacy-colleges', color: 'text-green-500' },
    { name: 'Law Colleges', icon: Scale, path: '/law-colleges', color: 'text-amber-500' },
    { name: 'BCA Colleges', icon: Laptop, path: '/bca-colleges', color: 'text-indigo-500' },
    { name: 'BBA Colleges', icon: Building2, path: '/bba-colleges', color: 'text-cyan-500' },
    { name: 'Private Universities', icon: Landmark, path: '/private-universities', color: 'text-orange-500' },
    { name: 'Low Fee Colleges', icon: Wallet, path: '/low-fee-colleges', color: 'text-emerald-500' },
  ];

  // Header se remove kiye gaye links (Footer mein add kiye) - FIXED ICONS
  const removedHeaderLinks = [
    { name: 'Blog', page: 'Blog', icon: Newspaper, color: 'text-purple-400' },  // ← Blog → Newspaper
    { name: 'Career', page: 'Career', icon: Briefcase, color: 'text-blue-400' },
    { name: 'Exams', page: 'Exams', icon: Calendar, color: 'text-green-400' },
    { name: 'Counseling', page: 'Counseling', icon: Headphones, color: 'text-yellow-400' },
    { name: 'Contact', page: 'Contact', icon: ContactIcon, color: 'text-red-400' },  // ← Contact → ContactIcon
  ];

  return (
    <>
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300 overflow-hidden">
        {/* Animated Background Lines */}
        <div className="absolute inset-0 opacity-5">
          <motion.div 
            className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-500/20 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: Math.random() * 1000,
                scale: 0 
              }}
              animate={{ 
                y: [null, -20, 0],
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.8
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Newsletter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 mb-12 border border-purple-500/20"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center">
                  <Send className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Get College Updates</h3>
                  <p className="text-sm text-gray-400">Subscribe for latest admissions & exam alerts</p>
                </div>
              </div>
              
              <form onSubmit={handleSubscribe} className="flex-1 max-w-md">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white text-sm"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    Subscribe
                  </motion.button>
                </div>
                {isSubscribed && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-xs mt-2"
                  >
                    ✓ Thanks for subscribing!
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            
            {/* Column 1: About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <motion.div 
                className="flex items-center gap-2 mb-4 group cursor-pointer"
                onClick={handleLogoClick}
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <img
                    src={LOGO_URL}
                    alt="Dreamz College"
                    className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                </motion.div>
                <motion.div
                  animate={{
                    color: isLogoHovered ? '#a855f7' : '#ffffff'
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-left"
                >
                  <motion.h3 
                    className="font-bold text-base sm:text-lg"
                    animate={{
                      color: isLogoHovered ? '#a855f7' : '#ffffff',
                      scale: isLogoHovered ? 1.02 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Dreamz College
                  </motion.h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    by JuniorDream Pvt Ltd
                  </p>
                </motion.div>
              </motion.div>
              
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                Helping Indian students find their dream colleges since 2015. Expert guidance for Engineering, Medical, Nursing, Management & more.
              </p>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-0.5 text-yellow-500">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <Star className="w-3 h-3 fill-yellow-500" />
                </div>
                <span className="text-gray-500 text-xs">4.9 (2k+ reviews)</span>
              </div>
            </motion.div>

            {/* Column 2: Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Briefcase className="w-4 h-4 text-purple-500" />
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { name: 'About Us', page: 'About' },
                  { name: 'Courses', page: 'Courses' },
                  { name: 'Colleges', page: 'Colleges' },
                ].map((item) => (
                  <motion.li 
                    key={item.name}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <button
                      onClick={() => handleNavigation(item.page)}
                      className="w-full flex items-center justify-between group text-left"
                    >
                      <span className="text-xs sm:text-sm text-gray-400 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Resources (Removed Header Links) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Resources
              </h4>
              <ul className="space-y-2">
                {removedHeaderLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.li 
                      key={item.name}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <button
                        onClick={() => handleNavigation(item.page)}
                        className="w-full flex items-center justify-between group text-left"
                      >
                        <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 group-hover:text-white transition-colors">
                          <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                          {item.name}
                        </span>
                        <ArrowRight className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Column 4: Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Library className="w-4 h-4 text-green-500" />
                Categories
              </h4>
              <ul className="space-y-2">
                {categoryLinks.slice(0, 5).map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.li 
                      key={item.name}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                        {item.name}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Column 5: Contact & Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="w-4 h-4 text-green-500" />
                  Contact Us
                </h4>
                <ul className="space-y-3 text-sm">
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="tel:+918796033021" className="flex items-start gap-3 hover:text-white group text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-gray-800 group-hover:bg-purple-600 flex items-center justify-center transition-colors">
                        <Phone className="w-3 h-3" />
                      </span>
                      <span>+91 879 603 3021</span>
                    </a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="mailto:admissions@dreamzcollege.in" className="flex items-start gap-3 hover:text-white group text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-gray-800 group-hover:bg-purple-600 flex items-center justify-center transition-colors">
                        <Mail className="w-3 h-3" />
                      </span>
                      <span>admissions@dreamzcollege.in</span>
                    </a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="https://wa.me/918796033021" target="_blank" className="flex items-start gap-3 hover:text-white group text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-gray-800 group-hover:bg-green-600 flex items-center justify-center transition-colors">
                        <MessageCircle className="w-3 h-3" />
                      </span>
                      <span>Chat on WhatsApp</span>
                    </a>
                  </motion.li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  Top Exams 2026
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Link to="/exam/jee-main" className="text-xs bg-gray-800 hover:bg-purple-600 px-2 py-1 rounded transition-colors">JEE Main</Link>
                  <Link to="/exam/neet-ug" className="text-xs bg-gray-800 hover:bg-purple-600 px-2 py-1 rounded transition-colors">NEET</Link>
                  <Link to="/exam/cat" className="text-xs bg-gray-800 hover:bg-purple-600 px-2 py-1 rounded transition-colors">CAT</Link>
                  <Link to="/exam/gate" className="text-xs bg-gray-800 hover:bg-purple-600 px-2 py-1 rounded transition-colors">GATE</Link>
                  <Link to="/exam/upsc-cse" className="text-xs bg-gray-800 hover:bg-purple-600 px-2 py-1 rounded transition-colors">UPSC</Link>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  Follow us
                </p>
                <div className="flex items-center gap-2">
                  {[
                    { icon: Facebook, url: 'https://facebook.com/dreamzcollege', color: 'hover:bg-blue-600', label: 'Facebook' },
                    { icon: Instagram, url: 'https://www.instagram.com/_dreamz_college/', color: 'hover:bg-pink-600', label: 'Instagram' },
                    { icon: Linkedin, url: 'https://www.linkedin.com/showcase/113329029/admin/dashboard/', color: 'hover:bg-blue-700', label: 'LinkedIn' },
                  ].map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.button
                        key={social.label}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExternalLink(social.url)}
                        className={`w-8 h-8 rounded-lg bg-gray-800 ${social.color} flex items-center justify-center transition-all`}
                        aria-label={social.label}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              <p className="text-gray-500 text-xs sm:text-sm">
                © 2026 Dreamz College by JuniorDream Pvt Ltd. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNavigation('PrivacyPolicy')}
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 group text-xs sm:text-sm"
              >
                <Shield className="w-3 h-3 group-hover:text-purple-500" />
                Privacy Policy
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNavigation('TermsOfService')}
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 group text-xs sm:text-sm"
              >
                <Clock className="w-3 h-3 group-hover:text-blue-500" />
                Terms of Service
              </motion.button>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBackToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl flex items-center justify-center"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}