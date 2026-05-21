// src/app/components/LeadPopup.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { saveToGoogleSheets } from '../../lib/googleSheets';
import { X, User, Phone, MapPin, GraduationCap, Send, CheckCircle, Loader2, Sparkles, Crown, Gift } from 'lucide-react';

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LeadPopup: React.FC<LeadPopupProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    course: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const courses = [
    'Select a course',
    'Engineering (B.Tech)',
    'Medical (MBBS/BDS)',
    'Nursing (B.Sc)',
    'Pharmacy (B.Pharm)',
    'Management (BBA/MBA)',
    'IT & Computer (BCA/MCA)',
    'Law (BA LLB/LLB)',
    'Commerce (B.Com/M.Com)'
  ];

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setFormData({ ...formData, mobile: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.location.trim()) {
      alert('Please enter your location');
      return;
    }
    if (!formData.course || formData.course === 'Select a course') {
      alert('Please select a course');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const saved = await saveToGoogleSheets(formData);
      
      if (saved) {
        setSubmitted(true);
        
        if (onSuccess) {
          onSuccess();
        }
        
        setTimeout(() => {
          setFormData({ name: '', mobile: '', location: '', course: '' });
          setSubmitted(false);
          onClose();
        }, 2000);
      } else {
        alert('Failed to save. Please check your connection and try again.');
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Premium Header - Company Theme */}
              <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 px-6 py-5 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/30 blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/30 blur-2xl"></div>
                </div>
                
                {/* Sparkle animations */}
                <motion.div
                  animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-2 right-12 text-white/30"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-2 left-10 text-white/30"
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Dreamz College
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-purple-100 text-xs">Learn from achievers</p>
                        <div className="w-1 h-1 rounded-full bg-purple-300"></div>
                        <p className="text-purple-100 text-xs">to become one</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-1.5 backdrop-blur"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative mt-3 flex items-center gap-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-yellow-300" />
                    <span className="text-[10px] font-semibold text-yellow-200 tracking-wider">FREE CONSULTATION</span>
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
                
                <p className="relative text-purple-100 text-xs mt-2 text-center">
                  Fill the form to get expert career guidance
                </p>
              </div>

              {!submitted && !isSubmitting ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-500" />
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+91</span>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={handleMobileChange}
                        maxLength={10}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                        placeholder="9876543210"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.mobile.length}/10 digits
                    </p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      Location / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                      placeholder="e.g., Greater Noida, Delhi"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-500" />
                      Interested Course <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white cursor-pointer"
                      required
                    >
                      {courses.map((course, index) => (
                        <option key={index} value={course === 'Select a course' ? '' : course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="relative w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit & Get Expert Advice
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </button>

                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] text-gray-400">100% Free</span>
                    </div>
                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] text-gray-400">Expert Guidance</span>
                    </div>
                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span className="text-[10px] text-gray-400">No Spam</span>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 text-center">
                    📞 We'll contact you within 24 hours
                  </p>
                </form>
              ) : !submitted && isSubmitting ? (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-lg flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                      </div>
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md"
                      >
                        <span className="text-sm">🎓</span>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                        className="absolute -bottom-2 -left-2 w-7 h-7 bg-green-400 rounded-full flex items-center justify-center shadow-md"
                      >
                        <span className="text-xs">📚</span>
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-white font-semibold text-lg">Just a moment...</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Connecting you with the best career experts ✨</p>
                      <div className="flex justify-center space-x-1.5 mt-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Thank You! 🎉</h3>
                  <p className="text-gray-600 dark:text-gray-400">Our admission expert will contact you soon!</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Your journey to success begins now</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};