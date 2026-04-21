import { Helmet } from 'react-helmet-async';
import { MessageCircle, Phone, Send, CheckCircle, User, Mail, Calendar, Clock, Briefcase, GraduationCap, Sparkles, ArrowRight, Shield, Star, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface CounselingFormData {
  name: string;
  phone: string;
  email: string;
  course: string;
  counselingType: string;
  preferredTime: string;
  studentStatus: string;
  message: string;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDnkO1oYjHUbM1KLDRP8W_-GJ1wOrVPBeKD9jC1jAvqEOd63qmnFO9f6keAD7TFC7B/exec';

export function CounselingPage() {
  const [formData, setFormData] = useState<CounselingFormData>({
    name: '',
    phone: '',
    email: '',
    course: '',
    counselingType: 'Chat',
    preferredTime: 'Morning (9 AM - 12 PM)',
    studentStatus: '12th Pass',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = { name: '', phone: '', email: '' };
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

    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  };

  const submitToGoogleSheets = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email || 'Not provided');
      formDataToSend.append('course', formData.course || 'Not selected');
      formDataToSend.append('counselingType', formData.counselingType);
      formDataToSend.append('preferredTime', formData.preferredTime);
      formDataToSend.append('studentStatus', formData.studentStatus);
      formDataToSend.append('message', formData.message || 'No message');
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('source', 'Counseling Page');

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors'
      });
      
      console.log('Counseling data sent to Google Sheets');
    } catch (error) {
      console.error('Google Sheets Error:', error);
    }
  };

  const sendToWhatsApp = () => {
    const message = `🎓 *Dreamz College - Counseling Request*
    
👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email || 'Not provided'}
📚 *Course Interested:* ${formData.course || 'Not selected'}
💬 *Counseling Type:* ${formData.counselingType}
⏰ *Preferred Time:* ${formData.preferredTime}
🎯 *Status:* ${formData.studentStatus}
📝 *Message:* ${formData.message || 'No message'}
⏰ *Time:* ${new Date().toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '918796033021';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      sendToWhatsApp();
      await submitToGoogleSheets();
      setIsSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          course: '',
          counselingType: 'Chat',
          preferredTime: 'Morning (9 AM - 12 PM)',
          studentStatus: '12th Pass',
          message: ''
        });
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const counselingOptions = [
    {
      icon: MessageCircle,
      title: 'Chat Counseling',
      description: 'Instant messaging with experts',
      availability: 'Available 24/7',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      type: 'Chat'
    },
    {
      icon: Phone,
      title: 'Voice Call Counseling',
      description: 'Personalized 1-on-1 call',
      availability: 'Mon-Sat, 9 AM - 8 PM',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      type: 'Voice Call'
    }
  ];

  const timeSlots = [
    'Morning (9 AM - 12 PM)',
    'Afternoon (12 PM - 3 PM)',
    'Evening (3 PM - 6 PM)',
    'Night (6 PM - 9 PM)'
  ];

  const studentStatuses = [
    '12th Pass',
    '12th Appearing',
    'Graduate',
    'Working Professional',
    'Parent'
  ];

  const courseOptions = [
    'Select a course',
    'Engineering (B.Tech)',
    'Medical (MBBS/BDS)',
    'Management (MBA/BBA)',
    'Pharmacy (B.Pharm)',
    'Law (LL.B/BA LLB)',
    'Nursing (B.Sc Nursing)',
    'IT & Computer (BCA/MCA)',
    'Commerce (B.Com/M.Com)',
    'Design & Arts',
    'Other'
  ];

  return (
    <>
      <Helmet>
        <title>Free Career Counseling 2026 - Expert Guidance for College Admissions | Dreamz College</title>
        <meta name="description" content="Get 100% free expert career counseling for college admissions 2026. Chat or voice call with experienced counselors. Choose the right college and course for your dream career!" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="space-y-8 pt-20 pb-16">
          {/* Header Section */}
          <div className="text-center max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
            >
              <Sparkles className="w-4 h-4" />
              100% Free Service
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            >
              Free Expert{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Career Counseling
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Get personalized guidance from experienced education counselors. 
              Choose the right college and course for your dream career.
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mt-6"
            >
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-gray-600">4.9 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">50,000+ Students</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">100% Free</span>
              </div>
            </motion.div>
          </div>

          {/* Counseling Options - 2 Options (Chat & Voice Call) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
            {counselingOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setFormData({ ...formData, counselingType: option.type })}
                  className={`relative bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                    formData.counselingType === option.type 
                      ? 'border-purple-500 shadow-xl ring-2 ring-purple-200' 
                      : 'border-gray-200 shadow-md hover:shadow-lg'
                  }`}
                >
                  {formData.counselingType === option.type && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                  <div className={`w-14 h-14 rounded-xl ${option.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${option.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{option.availability}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Booking Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto px-4"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5">
                <h2 className="text-2xl font-bold text-white">Book Your Free Session</h2>
                <p className="text-purple-100 text-sm mt-1">Fill the form below to get expert guidance</p>
              </div>

              <div className="p-6">
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent! 🎉</h3>
                    <p className="text-gray-600">Our expert counselor will contact you within 24 hours.</p>
                    <p className="text-sm text-purple-600 mt-4">Check your WhatsApp for confirmation</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className={`relative transition-all duration-200 ${focusedField === 'name' ? 'transform scale-[1.01]' : ''}`}>
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full pl-9 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            errors.name ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className={`relative transition-all duration-200 ${focusedField === 'phone' ? 'transform scale-[1.01]' : ''}`}>
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          onChange={handlePhoneChange}
                          className={`w-full pl-9 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            errors.phone ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      <p className="text-gray-400 text-xs mt-1">Enter exactly 10 digits (e.g., 9876543210)</p>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.01]' : ''}`}>
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-9 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            errors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Student Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <GraduationCap className="w-4 h-4 inline mr-1" />
                        Student Status
                      </label>
                      <select
                        value={formData.studentStatus}
                        onChange={(e) => setFormData({ ...formData, studentStatus: e.target.value })}
                        className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {studentStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    {/* Course Interest */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <Briefcase className="w-4 h-4 inline mr-1" />
                        Course Interest
                      </label>
                      <select
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {courseOptions.map(course => (
                          <option key={course} value={course === 'Select a course' ? '' : course}>
                            {course}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Preferred Time Slot
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>

                    {/* Counseling Type Display */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Selected Counseling Type</p>
                          <p className="text-lg font-semibold text-purple-600">{formData.counselingType}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          {formData.counselingType === 'Chat' ? (
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Phone className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Click on any option above to change</p>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message (Optional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Tell us about your career goals or any specific questions..."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Booking Your Session...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Get Free Counseling
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>

                    <div className="text-center">
                      <p className="text-xs text-gray-400">
                        ✓ 100% Free | ✓ Expert Guidance | ✓ Quick Response within 24 hours
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-gray-400">Your data is safe with us</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}