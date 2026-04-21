import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { saveToGoogleSheets } from '../../lib/googleSheets';

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;  // New prop for successful submission
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

  // Updated courses - Same as CoursesSection on Home Page
  const courses = [
    'Select a course',
    'Engineering',
    'Medical',
    'Nursing',
    'Pharmacy',
    'Management',
    'IT & Computer'
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
        
        // Call onSuccess to mark popup as submitted (will never show again)
        if (onSuccess) {
          onSuccess();
        }
        
        setTimeout(() => {
          setFormData({ name: '', mobile: '', location: '', course: '' });
          setSubmitted(false);
          onClose();
        }, 1500);
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
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    🎓 Get Free Consultation!
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-green-100 text-sm mt-1">
                  Fill the form to get expert guidance
                </p>
              </div>

              {!submitted && !isSubmitting ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number * (10 digits)
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={handleMobileChange}
                      maxLength={10}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter 10-digit mobile number"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.mobile.length}/10 digits
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location / City *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your city/location"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interested Course *
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
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
                    className="relative w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold overflow-hidden group transition-all duration-300 hover:shadow-lg hover:from-green-600 hover:to-green-700"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit & Get Expert Advice
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    📞 We'll contact you within 24 hours. No spam guaranteed!
                  </p>
                </form>
              ) : !submitted && isSubmitting ? (
                <div className="p-8 text-center">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                    <div className="relative w-40 h-40 mx-auto">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-20 bg-blue-100 rounded-lg shadow-lg relative">
                          <div className="absolute top-2 left-2 w-20 h-1 bg-blue-300 rounded"></div>
                          <div className="absolute top-5 left-2 w-20 h-1 bg-blue-300 rounded"></div>
                          <div className="absolute top-8 left-2 w-20 h-1 bg-blue-300 rounded"></div>
                          <div className="absolute bottom-2 left-2 text-xs text-blue-600">📖</div>
                        </div>
                      </div>
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute top-2 left-2 w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-lg">👨‍🎓</span>
                      </motion.div>
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }} className="absolute bottom-2 right-2 w-10 h-10 bg-green-200 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-lg">✏️</span>
                      </motion.div>
                      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} className="absolute top-10 right-4 w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                        <span className="text-sm">💭</span>
                      </motion.div>
                      <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-2 -right-2 text-yellow-500 text-xl">⭐</motion.div>
                      <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute -bottom-2 -left-2 text-yellow-500 text-lg">✨</motion.div>
                    </div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                      <p className="text-gray-700 font-semibold text-lg">Just a moment...</p>
                      <p className="text-sm text-gray-500 mt-2">Making your dream career a reality ✨</p>
                      <div className="flex justify-center space-x-1 mt-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You! 🎉</h3>
                  <p className="text-gray-600">Our expert will contact you soon!</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};