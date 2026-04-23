// src/app/components/ApplicationPopup.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, GraduationCap, Calendar, BookOpen, Phone, Mail, User, Send, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveFullApplication, hasUserAppliedForCourse } from '../../lib/firebase';

interface ApplicationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  college: {
    id: string;
    name: string;
    courses: string[];
  };
  onSuccess?: () => void;
}

// Boards list
const boards = [
  'CBSE',
  'ICSE',
  'UP Board',
  'Bihar Board',
  'Rajasthan Board',
  'MP Board',
  'Haryana Board',
  'Punjab Board',
  'West Bengal Board',
  'Maharashtra Board',
  'Tamil Nadu Board',
  'Karnataka Board',
  'Other State Board',
  'International Board (IB/IGCSE)'
];

// Passing years (last 10 years)
const getPassingYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear; i++) {
    years.push(i);
  }
  return years;
};

export function ApplicationPopup({ isOpen, onClose, college, onSuccess }: ApplicationPopupProps) {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  // Form Data
  const [formData, setFormData] = useState({
    tenthBoard: '',
    tenthPercentage: '',
    tenthPassingYear: '',
    twelfthBoard: '',
    twelfthPercentage: '',
    twelfthPassingYear: '',
    message: '',
  });

  // Check if already applied for this course
  useEffect(() => {
    const checkExisting = async () => {
      if (user?.uid && college.id && selectedCourse) {
        const exists = await hasUserAppliedForCourse(user.uid, college.id, selectedCourse);
        setAlreadyApplied(exists);
      }
    };
    if (selectedCourse) {
      checkExisting();
    }
  }, [user?.uid, college.id, selectedCourse]);

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCourse('');
      setFormData({
        tenthBoard: '',
        tenthPercentage: '',
        tenthPassingYear: '',
        twelfthBoard: '',
        twelfthPercentage: '',
        twelfthPassingYear: '',
        message: '',
      });
      setError('');
      setSuccess(false);
      setAlreadyApplied(false);
    }
  }, [isOpen]);

  const userName = userData?.name || user?.displayName || user?.email?.split('@')[0] || '';
  const userEmail = userData?.email || user?.email || '';
  const userPhone = userData?.phone || user?.phoneNumber || '';

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return false;
    }
    if (alreadyApplied) {
      setError('You have already applied for this course');
      return false;
    }
    if (!formData.tenthBoard) {
      setError('Please select 10th board');
      return false;
    }
    if (!formData.tenthPercentage || parseFloat(formData.tenthPercentage) > 100 || parseFloat(formData.tenthPercentage) < 0) {
      setError('Please enter valid 10th percentage (0-100)');
      return false;
    }
    if (!formData.tenthPassingYear) {
      setError('Please select 10th passing year');
      return false;
    }
    if (!formData.twelfthBoard) {
      setError('Please select 12th board');
      return false;
    }
    if (!formData.twelfthPercentage || parseFloat(formData.twelfthPercentage) > 100 || parseFloat(formData.twelfthPercentage) < 0) {
      setError('Please enter valid 12th percentage (0-100)');
      return false;
    }
    if (!formData.twelfthPassingYear) {
      setError('Please select 12th passing year');
      return false;
    }
    return true;
  };

  // Send to Google Sheets
  const sendToGoogleSheets = async (data: any) => {
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDnkO1oYjHUbM1KLDRP8W_-GJ1wOrVPBeKD9jC1jAvqEOd63qmnFO9f6keAD7TFC7B/exec';
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('phone', data.phone);
      formDataToSend.append('email', data.email);
      formDataToSend.append('college', data.collegeName);
      formDataToSend.append('course', data.course);
      formDataToSend.append('tenthBoard', data.tenthBoard);
      formDataToSend.append('tenthPercentage', data.tenthPercentage);
      formDataToSend.append('tenthYear', data.tenthPassingYear);
      formDataToSend.append('twelfthBoard', data.twelfthBoard);
      formDataToSend.append('twelfthPercentage', data.twelfthPercentage);
      formDataToSend.append('twelfthYear', data.twelfthPassingYear);
      formDataToSend.append('message', data.message);
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('source', 'ApplicationPopup');

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors'
      });
      
      console.log('Data sent to Google Sheets');
    } catch (error) {
      console.error('Google Sheets Error:', error);
    }
  };

  // Send WhatsApp message
  const sendToWhatsApp = (data: any) => {
    const message = `🏫 *Dreamz College - New Application*
    
🎓 *College:* ${data.collegeName}
📚 *Course:* ${data.course}
👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email}

📊 *10th Details:*
• Board: ${data.tenthBoard}
• Percentage: ${data.tenthPercentage}%
• Year: ${data.tenthPassingYear}

📊 *12th Details:*
• Board: ${data.twelfthBoard}
• Percentage: ${data.twelfthPercentage}%
• Year: ${data.twelfthPassingYear}

📝 *Message:* ${data.message || 'No message'}
⏰ *Time:* ${new Date().toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '918796033021';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    const applicationData = {
      userId: user?.uid,
      name: userName,
      email: userEmail,
      phone: userPhone,
      collegeId: college.id,
      collegeName: college.name,
      course: selectedCourse,
      tenthBoard: formData.tenthBoard,
      tenthPercentage: parseFloat(formData.tenthPercentage),
      tenthPassingYear: formData.tenthPassingYear,
      twelfthBoard: formData.twelfthBoard,
      twelfthPercentage: parseFloat(formData.twelfthPercentage),
      twelfthPassingYear: formData.twelfthPassingYear,
      message: formData.message,
      applicationType: 'full',
      admissionTimeline: '2026-2027'
    };

    try {
      // 1. Save to Firebase
      await saveFullApplication(applicationData);
      
      // 2. Send to Google Sheets
      await sendToGoogleSheets(applicationData);
      
      // 3. Send to WhatsApp
      sendToWhatsApp(applicationData);
      
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
      
    } catch (err) {
      console.error('Application error:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[101] rounded-2xl bg-white shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="sticky top-4 right-4 float-right z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="clear-both px-6 pb-6 pt-2">
              {/* Success Message */}
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600">Your application has been received successfully.</p>
                  <p className="text-sm text-gray-400 mt-2">Our team will contact you soon.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-6 mt-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Apply for Admission</h2>
                    <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                      <p className="text-purple-800 font-semibold">{college.name}</p>
                    </div>
                  </div>

                  {/* Student Info (Read-only) */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{userName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{userEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{userPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-5">
                    {/* Course Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Course <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Choose a course</option>
                        {college.courses.map((course, idx) => (
                          <option key={idx} value={course}>{course}</option>
                        ))}
                      </select>
                      {alreadyApplied && selectedCourse && (
                        <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          You have already applied for this course
                        </p>
                      )}
                    </div>

                    {/* 10th Details */}
                    <div className="bg-blue-50/30 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        10th Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select
                          value={formData.tenthBoard}
                          onChange={(e) => handleChange('tenthBoard', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="">Select Board</option>
                          {boards.map((board, idx) => (
                            <option key={idx} value={board}>{board}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Percentage %"
                          value={formData.tenthPercentage}
                          onChange={(e) => handleChange('tenthPercentage', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                        <select
                          value={formData.tenthPassingYear}
                          onChange={(e) => handleChange('tenthPassingYear', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="">Passing Year</option>
                          {getPassingYears().map((year, idx) => (
                            <option key={idx} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 12th Details */}
                    <div className="bg-green-50/30 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        12th Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select
                          value={formData.twelfthBoard}
                          onChange={(e) => handleChange('twelfthBoard', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="">Select Board</option>
                          {boards.map((board, idx) => (
                            <option key={idx} value={board}>{board}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Percentage %"
                          value={formData.twelfthPercentage}
                          onChange={(e) => handleChange('twelfthPercentage', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                        <select
                          value={formData.twelfthPassingYear}
                          onChange={(e) => handleChange('twelfthPassingYear', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="">Passing Year</option>
                          {getPassingYears().map((year, idx) => (
                            <option key={idx} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Message (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Any specific questions or requirements?"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading || alreadyApplied}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : alreadyApplied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Already Applied
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}