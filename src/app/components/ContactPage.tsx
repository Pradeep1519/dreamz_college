import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, Send, User, MessageCircle, CheckCircle, Sparkles, Shield, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

// Google Apps Script URL - Same as other forms
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDnkO1oYjHUbM1KLDRP8W_-GJ1wOrVPBeKD9jC1jAvqEOd63qmnFO9f6keAD7TFC7B/exec';

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 879 603 3021',
    subtitle: 'Mon-Sat, 9 AM - 8 PM',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    gradient: 'from-blue-500 to-blue-600',
    action: 'tel:+918796033021'
  },
  {
    icon: Mail,
    title: 'Email Us',
    value: 'admissions@dreamzcollege.in',
    subtitle: 'We respond within 24 hours',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    gradient: 'from-purple-500 to-purple-600',
    action: 'mailto:admissions@dreamzcollege.in'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: 'Knowledge Park II',
    subtitle: 'Greater Noida, UP - 201310',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    gradient: 'from-pink-500 to-pink-600',
    action: 'https://maps.google.com/?q=Knowledge+Park+II+Greater+Noida'
  },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
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
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject || 'Not provided');
      formDataToSend.append('message', formData.message || 'No message');
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('source', 'Contact Page');

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors'
      });
      
      console.log('Contact form data sent to Google Sheets');
    } catch (error) {
      console.error('Google Sheets Error:', error);
    }
  };

  const sendToWhatsApp = () => {
    const message = `📬 *Contact Form Submission - Dreamz College*
    
👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email}
📋 *Subject:* ${formData.subject || 'Not provided'}
💬 *Message:* ${formData.message || 'No message'}
⏰ *Time:* ${new Date().toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918796033021?text=${encodedMessage}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      sendToWhatsApp();
      await submitToGoogleSheets();
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Dreamz College - Free Education Counseling | Greater Noida</title>
        <meta name="description" content="Get in touch with Dreamz College team. Call +91 8796033021, email admissions@dreamzcollege.in or visit our office in Knowledge Park II, Greater Noida. Free career guidance available!" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="space-y-8 pt-20 pb-16">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Get in Touch
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              We'd Love to <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Hear From You</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Have questions about colleges, courses, or admissions? Our team is here to help you 24/7.
            </motion.p>
          </div>

          {/* Contact Methods - Enhanced Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.a
                  key={method.title}
                  href={method.action}
                  target={method.title === 'Visit Us' ? '_blank' : undefined}
                  rel={method.title === 'Visit Us' ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <div className={`w-14 h-14 rounded-xl ${method.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${method.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-base font-medium text-purple-600 mb-2">{method.value}</p>
                  <p className="text-sm text-gray-500">{method.subtitle}</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-purple-600">Click to {method.title === 'Call Us' ? 'Call' : method.title === 'Email Us' ? 'Email' : 'Get Directions'} →</span>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Contact Form & Info */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5">
                    <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
                    <p className="text-purple-100 text-sm mt-1">We'll get back to you within 24 hours</p>
                  </div>

                  <div className="p-6">
                    {/* Success Message */}
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="text-green-700 text-sm">✅ Thank you for contacting us! We'll get back to you shortly.</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Error Message */}
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                      >
                        <p className="text-red-700 text-sm">❌ Something went wrong. Please try again.</p>
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.01]' : ''}`}>
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            required
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

                      {/* Subject Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                          placeholder="What's this about?"
                        />
                      </div>

                      {/* Message Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Message
                        </label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                          placeholder="Tell us more about your query..."
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
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-xs text-gray-400">
                        ✓ Your information is safe with us. We'll respond within 24 hours.
                      </p>
                    </form>
                  </div>
                </div>
              </motion.div>

              {/* Info Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                {/* Office Hours */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Office Hours</h3>
                      <div className="space-y-1 text-sm text-gray-600 mt-2">
                        <p>Monday - Friday: 9 AM - 8 PM</p>
                        <p>Saturday: 10 AM - 6 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About JuniorDream */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">About JuniorDream</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    JuniorDream Pvt Ltd is a trusted name in education counseling, helping thousands of students find their dream colleges since 2015.
                  </p>
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Knowledge Park II, Greater Noida
                    </p>
                  </div>
                </div>

                {/* Quick Response Badge */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="font-semibold text-gray-900">Quick Response</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Most queries are answered within <span className="font-semibold text-green-600">2-3 hours</span> during business hours.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">We're online now</span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
                  <div className="flex justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600">Trusted by <span className="font-semibold">50,000+</span> students</p>
                  <Shield className="w-4 h-4 text-green-500 mx-auto mt-2" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}