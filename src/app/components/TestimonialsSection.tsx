// src/app/components/TestimonialsSection.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, Award, GraduationCap, Users, Heart, CheckCircle, Compass, Target, Rocket, Sparkles } from 'lucide-react';
import { testimonials } from '../data/testimonialData';

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [selectedTestimonial, setSelectedTestimonial] = useState<number | null>(null);

  // Responsive cards count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxIndex = testimonials.length - visibleCards;
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index * visibleCards);
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + visibleCards);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + visibleCards < testimonials.length;
  const totalDots = Math.ceil(testimonials.length / visibleCards);
  const currentDot = Math.floor(currentIndex / visibleCards);

  // Stats Data - Inspirational (No Numbers)
  const statsData = [
    {
      icon: Compass,
      title: "Start Your Journey",
      subtitle: "Find your path",
      gradient: "from-purple-50 to-white",
      border: "border-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Target,
      title: "Choose Wisely",
      subtitle: "Make informed decisions",
      gradient: "from-blue-50 to-white",
      border: "border-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Rocket,
      title: "Grow With Us",
      subtitle: "Build your future",
      gradient: "from-green-50 to-white",
      border: "border-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Sparkles,
      title: "Achieve Dreams",
      subtitle: "Success guaranteed",
      gradient: "from-orange-50 to-white",
      border: "border-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-5"
          >
            <Heart className="w-4 h-4 text-purple-500 fill-purple-100" />
            <span>Student Love Stories</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Don't Just Take Our Word For It
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Hear from students who found their dream colleges and careers with Dreamz College
          </motion.p>
        </div>

        {/* Stats Row - Inspirational (No Numbers) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 md:mb-16"
        >
          {statsData.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`text-center p-4 rounded-xl bg-gradient-to-br ${stat.gradient} border ${stat.border} group cursor-pointer`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform ${stat.iconColor}`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-sm md:text-base font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                {stat.title}
              </div>
              <div className="text-[10px] md:text-xs text-gray-400 mt-1">
                {stat.subtitle}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {visibleCards < testimonials.length && (
            <>
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                  canGoPrev 
                    ? 'hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white cursor-pointer opacity-100' 
                    : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                  canGoNext 
                    ? 'hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white cursor-pointer opacity-100' 
                    : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="wait">
              {visibleTestimonials.map((testimonial, idx) => (
                <motion.div
                  key={`${testimonial.id}-${currentIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ 
                    duration: 0.4,
                    delay: idx * 0.1,
                    ease: "easeOut"
                  }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative">
                    {/* Quote Icon */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <Quote className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex gap-0.5 md:gap-1 mb-3 md:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 md:w-4 md:h-4 ${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Feedback */}
                    <p className={`text-gray-600 text-xs md:text-sm leading-relaxed mb-4 md:mb-5 transition-all duration-300 ${
                      selectedTestimonial === idx ? 'line-clamp-none' : 'line-clamp-3'
                    }`}>
                      "{testimonial.feedback}"
                    </p>

                    {testimonial.feedback.length > 150 && selectedTestimonial !== idx && (
                      <button 
                        className="text-purple-500 text-xs font-medium mb-3 hover:text-purple-600 transition-colors"
                        onClick={() => setSelectedTestimonial(idx)}
                      >
                        Read more →
                      </button>
                    )}

                    {/* Achievement Badge */}
                    {testimonial.achievement && (
                      <div className="flex items-center gap-1 md:gap-2 mb-3 md:mb-4">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                        <span className="text-[10px] md:text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                          {testimonial.achievement}
                        </span>
                      </div>
                    )}

                    {/* Student Info */}
                    <div className="flex items-center gap-3 md:gap-4 pt-3 border-t border-gray-100">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-base md:text-lg group-hover:text-purple-600 transition-colors">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">
                          {testimonial.course}
                        </p>
                        <p className="text-[11px] md:text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <GraduationCap className="w-3 h-3" />
                          {testimonial.college.split(',')[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        {totalDots > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentDot === idx
                    ? 'w-8 bg-purple-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full px-4 py-2 md:px-6 md:py-3 border border-purple-100">
            <Heart className="w-4 h-4 md:w-5 md:h-5 text-purple-600 fill-purple-100" />
            <span className="text-xs md:text-sm text-gray-700">
              Your Dream <span className="font-bold text-purple-600">College</span> Awaits
            </span>
            <div className="w-px h-4 md:h-6 bg-purple-200"></div>
            <span className="text-xs md:text-sm text-gray-700">
              Let's Make It <span className="font-bold text-blue-600">Happen</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}