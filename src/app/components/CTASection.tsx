// src/app/components/CTASection.tsx

import { motion } from 'motion/react';
import { Phone, MessageCircle, ArrowRight, CheckCircle, ClipboardList, FileText, Upload, CreditCard, GraduationCap, Sparkles, Star, Shield, Gift, Tag, Zap, Crown, TrendingUp, Users, Award } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookingModal } from './BookingModal';
import { useOffers } from '../hooks/useOffers';
import { useNavigate } from 'react-router-dom';

interface CTASectionProps {
  onNavigateToCounseling?: () => void;
  onChatWithExpert?: () => void;
  whatsappNumber?: string;
  whatsappMessage?: string;
  collegeCount?: number;
}

export function CTASection({ 
  onNavigateToCounseling,
  onChatWithExpert,
  whatsappNumber = '918796033021',
  whatsappMessage = 'Hello Dreamz College Team! I need guidance for college admission and course selection.',
  collegeCount = 25
}: CTASectionProps) {

  const navigate = useNavigate();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  
  // Fetch offers for hero banner (CTA section)
  const { offers } = useOffers({ location: 'hero_banner', autoFetch: true });
  const ctaOffer = offers.find(o => o.locations?.includes('hero_banner') && o.isActive === true);

  const journeySteps = [
    { name: "Register", icon: ClipboardList, description: "Create your profile", gradient: "from-purple-500 to-pink-500" },
    { name: "Select Course", icon: GraduationCap, description: "Choose your path", gradient: "from-blue-500 to-cyan-500" },
    { name: "Fill Form", icon: FileText, description: "Complete details", gradient: "from-emerald-500 to-teal-500" },
    { name: "Upload Docs", icon: Upload, description: "Share documents", gradient: "from-orange-500 to-red-500" },
    { name: "Payment", icon: CreditCard, description: "Secure checkout", gradient: "from-indigo-500 to-purple-500" },
    { name: "Admission", icon: CheckCircle, description: "You're in!", gradient: "from-green-500 to-emerald-500" }
  ];

  const handleChatWithExpert = () => {
    if (onChatWithExpert) {
      onChatWithExpert();
    } else {
      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    }
  };

  const handleBookCounseling = () => {
    setIsBookingModalOpen(true);
  };

  const handleModalComplete = () => {
    setIsBookingModalOpen(false);
    if (onNavigateToCounseling) {
      setTimeout(() => {
        onNavigateToCounseling();
      }, 500);
    }
  };

  const handleOfferClick = () => {
    navigate('/colleges');
  };

  return (
    <>
      <section className="py-28 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 overflow-hidden relative">
        {/* Premium Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* 🔥 PREMIUM CTA OFFER BANNER - Animated + Clickable */}
          {ctaOffer && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-10 cursor-pointer"
              onClick={handleOfferClick}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.01, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(168, 85, 247, 0.4)",
                    "0 0 0 25px rgba(168, 85, 247, 0)",
                    "0 0 0 0 rgba(168, 85, 247, 0)"
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-2xl p-[2px] shadow-2xl hover:shadow-purple-500/50 transition-all duration-500"
              >
                <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm rounded-2xl p-5 overflow-hidden">
                  {/* Animated shine */}
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                  
                  <div className="relative flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg"
                      >
                        <Crown className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-[11px] font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-0.5 rounded-full shadow-md"
                          >
                            🔥 EXCLUSIVE OFFER
                          </motion.span>
                          <Tag className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-[9px] text-gray-400">
                            Valid till {new Date(ctaOffer.validTill).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xl font-extrabold text-gray-900 mt-1">
                          {ctaOffer.name}
                        </p>
                        <p className="text-sm text-gray-500 max-w-md">
                          {ctaOffer.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-base line-through text-gray-400">₹{ctaOffer.originalFee?.toLocaleString()}</span>
                        <span className="text-3xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                          ₹{ctaOffer.discountedFee?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <Zap className="w-3.5 h-3.5 text-orange-500" />
                        <p className="text-xs font-bold text-green-600">
                          Save ₹{(ctaOffer.originalFee - ctaOffer.discountedFee).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center">
                            <span className="text-[8px] font-bold text-white">✓</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] text-gray-400">Already claimed by 3,892+ students</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] text-gray-500">Limited seats available</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOfferClick}
                        className="text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1"
                      >
                        Claim Now <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Premium Journey Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full border border-purple-200/50 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Simplified Process
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Your Journey to
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We have simplified the complex admission process into a{' '}
              <span className="font-semibold text-purple-600">seamless, intelligent experience</span>.
            </p>
          </motion.div>

          {/* Premium Journey Steps */}
          <div className="relative mb-24">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300 to-transparent hidden lg:block -translate-y-1/2"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-4">
              {journeySteps.map((step, index) => {
                const Icon = step.icon;
                const isHovered = hoveredStep === index;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    onMouseEnter={() => setHoveredStep(index)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className="relative group cursor-pointer"
                    onClick={() => navigate('/colleges')}
                  >
                    <div className={`
                      relative backdrop-blur-xl rounded-xl p-4 text-center
                      transition-all duration-500
                      ${isHovered ? 'shadow-2xl scale-105 bg-white/60' : 'shadow-md bg-white/40'}
                      border border-white/50
                    `}>
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        className={`
                          absolute -top-3 -right-3 w-7 h-7 rounded-full 
                          bg-gradient-to-r ${step.gradient} 
                          flex items-center justify-center shadow-lg
                          transition-all duration-300
                          ${isHovered ? 'scale-110 rotate-12' : ''}
                        `}
                      >
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </motion.div>
                      
                      <motion.div 
                        className="relative mb-3 flex justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className={`
                          relative w-14 h-14 rounded-xl 
                          bg-gradient-to-r ${step.gradient} 
                          flex items-center justify-center
                          transition-all duration-500
                          ${isHovered ? 'shadow-lg' : 'shadow-sm'}
                        `}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                      </motion.div>
                      
                      <h3 className="font-bold text-gray-900 text-sm mb-1">
                        {step.name}
                      </h3>
                      
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>

                    {index < journeySteps.length - 1 && (
                      <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200">
                          <ArrowRight className="w-2.5 h-2.5 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Premium CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>

              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12 md:p-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white/80 tracking-wide">LIMITED TIME OFFER</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Ready to Find Your
                    <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                      Dream College?
                    </span>
                  </h2>
                  
                  <p className="text-xl text-purple-200/90 mb-8 leading-relaxed">
                    Get free expert guidance from experienced counselors. Book your session now!
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBookCounseling}
                      className="group relative px-8 py-4 bg-white rounded-full font-bold text-purple-700 shadow-2xl hover:shadow-white/30 transition-all overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Book Free Counseling
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleChatWithExpert}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold border-2 border-white/30 hover:bg-white/20 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat with Expert
                    </motion.button>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/20">
                    <div className="grid grid-cols-3 gap-8">
                      <motion.div whileHover={{ y: -5 }} className="text-center">
                        <div className="text-3xl font-bold text-white mb-1 flex items-center justify-center gap-1">
                          100%
                          <Shield className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="text-sm text-purple-300">Free Service</div>
                      </motion.div>
                      <motion.div whileHover={{ y: -5 }} className="text-center">
                        <div className="text-3xl font-bold text-white mb-1 flex items-center justify-center gap-1">
                          24/7
                          <Star className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div className="text-sm text-purple-300">Support</div>
                      </motion.div>
                      <motion.div whileHover={{ y: -5 }} className="text-center">
                        <div className="text-3xl font-bold text-white mb-1 flex items-center justify-center gap-1">
                          {collegeCount}+
                          <GraduationCap className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-sm text-purple-300">Colleges</div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative hidden lg:block"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1653669486393-caa6a09ff771?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb3Vuc2Vsb3IlMjBtZW50b3J8ZW58MXx8fHwxNzY3NTA1MjU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Counselor"
                      className="w-full h-[450px] object-cover"
                    />
                    
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">Trusted by</div>
                          <div className="text-white text-xl font-bold">2,000+ Students</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingComplete={handleModalComplete}
      />
    </>
  );
}