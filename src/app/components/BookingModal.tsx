import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Mail, User, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete?: () => void;
}

export function BookingModal({ isOpen, onClose, onBookingComplete }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate phone number - exactly 10 digits
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Submit to Google Sheets
  const submitToGoogleSheets = async () => {
    try {
      // Google Apps Script URL - ISSE BADALNA HOGA
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzDnkO1oYjHUbM1KLDRP8W_-GJ1wOrVPBeKD9jC1jAvqEOd63qmnFO9f6keAD7TFC7B/exec';
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email || 'Not provided');
      formDataToSend.append('course', formData.course || 'Not selected');
      formDataToSend.append('message', formData.message || 'No message');
      formDataToSend.append('timestamp', new Date().toISOString());

      await fetch(scriptURL, {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors' // Important for Google Sheets
      });
      
      console.log('Data sent to Google Sheets');
    } catch (error) {
      console.error('Google Sheets Error:', error);
      // Don't block user if sheets fail
    }
  };

  // Send WhatsApp message - UPDATED NUMBER
  const sendToWhatsApp = () => {
    const message = `🏫 *Dreamz College - Counseling Request*
    
👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email || 'Not provided'}
📚 *Course Interested:* ${formData.course || 'Not selected'}
💬 *Message:* ${formData.message || 'No message'}
⏰ *Time:* ${new Date().toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '918796033021'; // 👈 YOUR NUMBER (87960 33021)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. WhatsApp pe bhejo
      sendToWhatsApp();

      // 2. Google Sheets me save karo
      await submitToGoogleSheets();

      // Success!
      setIsSuccess(true);
      setIsSubmitting(false);

      // 3 seconds baad modal close karo
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
        setFormData({
          name: '',
          phone: '',
          email: '',
          course: '',
          message: ''
        });
        onClose();
        if (onBookingComplete) onBookingComplete();
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  // Phone number input handler - only numbers, max 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold mb-1">Free Counseling</h2>
            <p className="text-white/90 text-sm">Get expert guidance for your career</p>
          </div>

          {/* Success Message */}
          {isSuccess ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-gray-600">Our counselor will contact you soon.</p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name Field - Mandatory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone Field - Mandatory, 10 digits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  Enter exactly 10 digits (e.g., 9876543210)
                </p>
              </div>

              {/* Email Field - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Course Interested - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Interested (Optional)
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a course</option>
                  <option value="Engineering">Engineering (B.Tech)</option>
                  <option value="Medical">Medical (MBBS)</option>
                  <option value="Management">Management (MBA/BBA)</option>
                  <option value="Pharmacy">Pharmacy (B.Pharm)</option>
                  <option value="Law">Law (LL.B)</option>
                  <option value="Nursing">Nursing</option>
                  <option value="IT">IT & Computer (BCA)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Any specific questions?"
                />
              </div>

              {/* Info Text */}
              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                <p className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  You'll receive confirmation on WhatsApp within 24 hours
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </button>

              {/* Note */}
              <p className="text-center text-xs text-gray-400">
                Your data is safe with us. We'll never share your information.
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}