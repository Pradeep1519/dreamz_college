// src/app/components/HeroSection.tsx

import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Play, Sparkles, Sun, Moon, Cloud, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BookingModal } from './BookingModal';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence } from 'motion/react';

export function HeroSection() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const { user, userData } = useAuth();
  
  const words = [
    { text: "Dream College", gradient: "from-purple-600 to-blue-600" },
    { text: "Dream Career", gradient: "from-blue-600 to-pink-600" },
    { text: "Dream Position", gradient: "from-pink-600 to-orange-600" },
    { text: "Dream Package", gradient: "from-orange-600 to-green-600" },
    { text: "Dream Life", gradient: "from-green-600 to-purple-600" }
  ];

  // Welcome messages with emojis
  const welcomeMessages = [
    { text: "Empowering your educational journey", emoji: "🌟" },
    { text: "Your journey to success starts here", emoji: "🚀" },
    { text: "Ready to build your dream future?", emoji: "💫" },
    { text: "Let's find your perfect college today", emoji: "🎯" },
    { text: "Your dream career is just a step away", emoji: "✨" },
    { text: "Together, let's shape your future", emoji: "🤝" },
    { text: "Your success story begins now", emoji: "📖" },
    { text: "Dream it. Achieve it. Live it.", emoji: "🏆" }
  ];

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", emoji: "🌅", icon: Sun };
    if (hour < 17) return { text: "Good Afternoon", emoji: "☀️", icon: Sun };
    if (hour < 20) return { text: "Good Evening", emoji: "🌇", icon: Cloud };
    return { text: "Good Night", emoji: "🌙", icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  const userName = userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || '';

  // ✅ Typing animation for main heading
  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenWords = 2500;

    const type = () => {
      const currentWord = words[wordIndex].text;
      
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
      } else {
        setText(currentWord.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), delayBetweenWords);
      }
      
      if (isDeleting && text === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const timer = setTimeout(
      type,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words]);

  // ✅ Slow welcome message rotation (10 seconds)
  useEffect(() => {
    if (!user) return; // Only rotate when user is logged in
    
    const interval = setInterval(() => {
      setWelcomeIndex((prev) => (prev + 1) % welcomeMessages.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [user, welcomeMessages.length]);

  const currentWelcome = welcomeMessages[welcomeIndex];

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            {/* ✅ PERSONALIZED GREETING - SMALLER CARD */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mb-5"
              >
                <div className="inline-flex flex-col gap-1.5">
                  {/* Main Greeting Card - Smaller */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="relative overflow-hidden bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-3 border border-purple-200/50 shadow-md max-w-md"
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                    
                    <div className="relative flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-full">
                        <GreetingIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-xs font-medium text-gray-700">
                          {greeting.text}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">🎓</span>
                        <span className="text-base font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                          Namaste, {userName}!
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                      </div>
                    </div>

                    {/* Welcome Message - Slow transition */}
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={welcomeIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.8 }}
                          className="flex items-center gap-1.5"
                        >
                          <span className="text-sm">{currentWelcome.emoji}</span>
                          <span>{currentWelcome.text}</span>
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-sm"
                          >
                            👋
                          </motion.span>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Daily Motivation - Smaller */}
                    <div className="mt-1.5 pt-1.5 border-t border-purple-100/50">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <Heart className="w-2.5 h-2.5 text-red-400" />
                        <span>💡 "Your future is created by what you do today"</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Trust Badge - Always visible */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 flex-wrap mb-4"
            >
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                🎓 India's Trusted Education Partner
              </span>
              
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
              >
                <motion.span
                  animate={{ 
                    backgroundColor: ["#22c55e", "#ffffff", "#22c55e", "#22c55e"],
                    scale: [1, 1.5, 1, 1],
                    opacity: [1, 0.4, 1, 1]
                  }}
                  transition={{ 
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.3, 0.6, 1]
                  }}
                  className="w-3 h-3 rounded-full shadow-lg"
                  style={{ 
                    backgroundColor: "#22c55e",
                    boxShadow: "0 0 15px #22c55e"
                  }}
                />
                <motion.span
                  animate={{ 
                    color: ["#166534", "#22c55e", "#166534", "#166534"],
                    fontWeight: [500, 700, 500, 500]
                  }}
                  transition={{ 
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Admission Open 2026 - 2027
                </motion.span>
              </motion.span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Find Your
              <span className="block mt-2 min-h-[1.2em]">
                <span className={`bg-gradient-to-r ${words[wordIndex].gradient} bg-clip-text text-transparent text-5xl md:text-6xl lg:text-7xl`}>
                  {text}
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block ml-1 text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                >
                  |
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Expert guidance for Indian students after 12th. Choose the right college with verified options in Engineering, Medical, Nursing, Management & more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookingModalOpen(true)}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-2xl hover:shadow-purple-500/50 transition-all"
              >
                Get Free Counseling
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Open video modal');
                }}
                className="flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="w-5 h-5" />
                Watch Video
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200"
            >
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
                <div className="text-sm text-gray-600">Colleges</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">2K+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                <div className="text-sm text-gray-600">Free Guidance</div>
              </div>
            </motion.div>
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756885375569-f04400d99cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHVkZW50JTIwcGxhbm5pbmclMjBjYXJlZXIlMjBlZHVjYXRpb258ZW58MXx8fHwxNzY3NTA1MjU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Students planning career"
                className="w-full h-[600px] object-cover"
              />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -left-8 bottom-20 bg-white rounded-2xl p-6 shadow-2xl max-w-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">98% Success Rate</div>
                  <div className="text-sm text-gray-600">Students placed in top colleges</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}