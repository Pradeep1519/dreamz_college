// src/app/components/ApplicationPopup.tsx

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, GraduationCap, Calendar, BookOpen, Phone, Mail, User, Send, Building, Gift, Zap, Sparkles, TrendingUp, Award, Clock, Shield, IndianRupee, ChevronRight, ChevronLeft, Globe, MessageCircle, Monitor, Home, Trophy, Users, Star, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveFullApplication, hasUserAppliedForCourse, saveDraftApplication, updateDraftToSubmitted } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Offer } from '../../lib/offerService';
import confetti from 'canvas-confetti';

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
  'CBSE', 'ICSE', 'UP Board', 'Bihar Board', 'Rajasthan Board', 'MP Board',
  'Haryana Board', 'Punjab Board', 'West Bengal Board', 'Maharashtra Board',
  'Tamil Nadu Board', 'Karnataka Board', 'Other State Board', 'International Board (IB/IGCSE)'
];

const hearAboutOptions = [
  { value: 'google', label: 'Google Search', icon: Globe },
  { value: 'instagram', label: 'Instagram', icon: Users },
  { value: 'facebook', label: 'Facebook', icon: Users },
  { value: 'whatsapp', label: 'WhatsApp Group', icon: MessageCircle },
  { value: 'friend', label: 'Friend/Family', icon: Heart },
  { value: 'teacher', label: 'Teacher/Counselor', icon: Star },
  { value: 'other', label: 'Other', icon: Home }
];

const counselingModes = [
  { value: 'online', label: 'Online (Video Call)', icon: Monitor },
  { value: 'offline', label: 'Offline (Campus Visit)', icon: Building },
  { value: 'phone', label: 'Phone Call', icon: Phone }
];

const getPassingYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(i);
  }
  return years;
};

// Scholarship eligibility checker
const getScholarshipEligibility = (tenthPercent: number, twelfthPercent: number) => {
  const avg = (tenthPercent + twelfthPercent) / 2;
  if (avg >= 90) return { eligible: true, amount: 60000, name: 'Merit Scholarship' };
  if (avg >= 80) return { eligible: true, amount: 40000, name: 'Excellence Scholarship' };
  if (avg >= 70) return { eligible: true, amount: 20000, name: 'Achiever Scholarship' };
  return { eligible: false, amount: 0, name: '' };
};

export function ApplicationPopup({ isOpen, onClose, college, onSuccess }: ApplicationPopupProps) {
  const { user, userData } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  
  // Offer related state
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [loadingOffer, setLoadingOffer] = useState(true);
  const [showOffer, setShowOffer] = useState(true);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [offerApplied, setOfferApplied] = useState(false);

  // New Fields
  const [hearAbout, setHearAbout] = useState('');
  const [counselingMode, setCounselingMode] = useState('');
  const [schoolName10th, setSchoolName10th] = useState('');
  const [schoolName12th, setSchoolName12th] = useState('');
  const [grade10th, setGrade10th] = useState('');
  const [grade12th, setGrade12th] = useState('');

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

  const registrationFee = 10000;

  // Get grade based on percentage
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  };

  // Auto-update grade when percentage changes
  useEffect(() => {
    if (formData.tenthPercentage) {
      const percent = parseFloat(formData.tenthPercentage);
      if (!isNaN(percent)) setGrade10th(getGrade(percent));
    }
  }, [formData.tenthPercentage]);

  useEffect(() => {
    if (formData.twelfthPercentage) {
      const percent = parseFloat(formData.twelfthPercentage);
      if (!isNaN(percent)) setGrade12th(getGrade(percent));
    }
  }, [formData.twelfthPercentage]);

  const getFinalRegistrationFee = () => {
    if (appliedOffer) return appliedOffer.discountedFee;
    return registrationFee;
  };

  // Fetch offer directly
  useEffect(() => {
    const fetchOffer = async () => {
      if (!isOpen) return;
      setLoadingOffer(true);
      try {
        const offersRef = collection(db, 'offers');
        const q = query(
          offersRef,
          where('isActive', '==', true),
          where('locations', 'array-contains', 'apply_button')
        );
        const snapshot = await getDocs(q);
        const today = new Date().toISOString().split('T')[0];
        const validOffers = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(offer => offer.validFrom <= today && offer.validTill >= today);
        
        if (validOffers.length > 0) setSelectedOffer(validOffers[0] as Offer);
      } catch (error) {
        console.error('Error fetching offer:', error);
      } finally {
        setLoadingOffer(false);
      }
    };
    fetchOffer();
  }, [isOpen]);

  // Check if already applied
  useEffect(() => {
    const checkExisting = async () => {
      if (user?.uid && college.id && selectedCourse) {
        const exists = await hasUserAppliedForCourse(user.uid, college.id, selectedCourse);
        setAlreadyApplied(exists);
      }
    };
    if (selectedCourse) checkExisting();
  }, [user?.uid, college.id, selectedCourse]);

  // Save draft when step changes or form data changes
  useEffect(() => {
    const saveDraft = async () => {
      if (!isOpen || !user?.uid) return;
      if (step === 4) return; // Don't save draft on review page
      
      const draftData = {
        userId: user.uid,
        name: userName,
        email: userEmail,
        phone: userPhone,
        collegeId: college.id,
        collegeName: college.name,
        course: selectedCourse,
        step: step,
        tenthBoard: formData.tenthBoard,
        tenthPercentage: formData.tenthPercentage,
        tenthPassingYear: formData.tenthPassingYear,
        twelfthBoard: formData.twelfthBoard,
        twelfthPercentage: formData.twelfthPercentage,
        twelfthPassingYear: formData.twelfthPassingYear,
        hearAbout,
        counselingMode,
        message: formData.message,
        offerId: appliedOffer?.id,
        offerName: appliedOffer?.name,
        originalFee: registrationFee,
        appliedFee: getFinalRegistrationFee(),
        status: 'draft',
        updatedAt: new Date().toISOString()
      };
      
      const id = await saveDraftApplication(draftData, draftId);
      if (id && !draftId) setDraftId(id);
    };
    
    const timeout = setTimeout(() => {
      saveDraft();
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [step, selectedCourse, formData, hearAbout, counselingMode, appliedOffer, isOpen, user?.uid]);

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedCourse('');
      setFormData({
        tenthBoard: '', tenthPercentage: '', tenthPassingYear: '',
        twelfthBoard: '', twelfthPercentage: '', twelfthPassingYear: '', message: '',
      });
      setHearAbout('');
      setCounselingMode('');
      setSchoolName10th('');
      setSchoolName12th('');
      setError('');
      setSuccess(false);
      setAlreadyApplied(false);
      setAppliedOffer(null);
      setShowOffer(true);
      setOfferApplied(false);
      setValidationErrors({});
      setDraftId(null);
    }
  }, [isOpen]);

  const userName = userData?.name || user?.displayName || user?.email?.split('@')[0] || '';
  const userEmail = userData?.email || user?.email || '';
  const userPhone = userData?.phone || user?.phoneNumber || '';

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: false }));
    }
    setError('');
  };

  const handleApplyOffer = () => {
    if (selectedOffer) {
      setAppliedOffer(selectedOffer);
      setOfferApplied(true);
      setShowOffer(false);
      setTimeout(() => setOfferApplied(false), 3000);
    }
  };

  const validateStep = () => {
    const errors: Record<string, boolean> = {};
    
    if (step === 1) {
      if (!selectedCourse) errors.course = true;
      if (!hearAbout) errors.hearAbout = true;
      if (!counselingMode) errors.counselingMode = true;
    } else if (step === 2) {
      if (!formData.tenthBoard) errors.tenthBoard = true;
      if (!formData.tenthPercentage || parseFloat(formData.tenthPercentage) > 100 || parseFloat(formData.tenthPercentage) < 0) errors.tenthPercentage = true;
      if (!formData.tenthPassingYear) errors.tenthPassingYear = true;
    } else if (step === 3) {
      if (!formData.twelfthBoard) errors.twelfthBoard = true;
      if (!formData.twelfthPercentage || parseFloat(formData.twelfthPercentage) > 100 || parseFloat(formData.twelfthPercentage) < 0) errors.twelfthPercentage = true;
      if (!formData.twelfthPassingYear) errors.twelfthPassingYear = true;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError('Please fill all required fields');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger confetti on success
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b']
    });
  };

  // Update draft to submitted
  const updateDraftToSubmittedFunc = async () => {
    if (draftId) {
      await updateDraftToSubmitted(draftId);
    }
  };

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
      formDataToSend.append('hearAbout', data.hearAbout);
      formDataToSend.append('counselingMode', data.counselingMode);
      formDataToSend.append('message', data.message);
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('offerClaimed', data.offerClaimed ? 'Yes' : 'No');
      formDataToSend.append('offerName', data.offerName || 'None');
      formDataToSend.append('discountAmount', data.discountAmount || '0');
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formDataToSend, mode: 'no-cors' });
    } catch (error) {
      console.error('Google Sheets Error:', error);
    }
  };

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

💬 *Heard About:* ${data.hearAbout}
🎯 *Counseling Mode:* ${data.counselingMode}

💰 *Fee Details:*
• Registration Fee: ₹${data.appliedFee?.toLocaleString() || '10,000'}
${data.offerClaimed ? `• Offer Applied: ${data.offerName}
• Saved: ₹${data.discountAmount?.toLocaleString()}` : '• No offer applied'}

📝 *Message:* ${data.message || 'No message'}`;

    window.open(`https://wa.me/918796033021?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async () => {
    // Validate all steps at once
    const step1Valid = selectedCourse && hearAbout && counselingMode;
    const step2Valid = formData.tenthBoard && formData.tenthPercentage && formData.tenthPassingYear;
    const step3Valid = formData.twelfthBoard && formData.twelfthPercentage && formData.twelfthPassingYear;
    
    if (!step1Valid || !step2Valid || !step3Valid) {
      setError('Please complete all sections before submitting');
      if (!step1Valid) setStep(1);
      else if (!step2Valid) setStep(2);
      else if (!step3Valid) setStep(3);
      return;
    }
    
    setLoading(true);
    setError('');

    const finalFee = getFinalRegistrationFee();
    const discountAmount = registrationFee - finalFee;
    const tenthPercent = parseFloat(formData.tenthPercentage);
    const twelfthPercent = parseFloat(formData.twelfthPercentage);
    const scholarship = getScholarshipEligibility(tenthPercent, twelfthPercent);

    const applicationData = {
      userId: user?.uid,
      name: userName,
      email: userEmail,
      phone: userPhone,
      collegeId: college.id,
      collegeName: college.name,
      course: selectedCourse,
      tenthBoard: formData.tenthBoard,
      tenthPercentage: tenthPercent,
      tenthPassingYear: formData.tenthPassingYear,
      twelfthBoard: formData.twelfthBoard,
      twelfthPercentage: twelfthPercent,
      twelfthPassingYear: formData.twelfthPassingYear,
      hearAbout,
      counselingMode,
      message: formData.message,
      applicationType: 'full',
      admissionTimeline: '2026-2027',
      offerClaimed: !!appliedOffer,
      offerId: appliedOffer?.id,
      offerName: appliedOffer?.name,
      originalFee: registrationFee,
      appliedFee: finalFee,
      discountAmount: discountAmount,
      scholarshipEligible: scholarship.eligible,
      scholarshipAmount: scholarship.amount,
      scholarshipName: scholarship.name,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      stepsCompleted: 4,
      draftId: draftId
    };

    try {
      await saveFullApplication(applicationData);
      await updateDraftToSubmittedFunc();
      await sendToGoogleSheets(applicationData);
      sendToWhatsApp(applicationData);
      
      setSuccess(true);
      triggerConfetti();
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (err) {
      console.error('Application error:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const finalFee = getFinalRegistrationFee();
  const hasOffer = selectedOffer !== null;
  const isDiscounted = appliedOffer !== null;
  const tenthPercent = parseFloat(formData.tenthPercentage);
  const twelfthPercent = parseFloat(formData.twelfthPercentage);
  const scholarship = getScholarshipEligibility(tenthPercent, twelfthPercent);

  const totalSteps = 4;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[101] rounded-2xl bg-white shadow-2xl"
          >
            <button
              onClick={onClose}
              className="sticky top-4 right-4 float-right z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="clear-both px-6 pb-6 pt-2">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted! 🎉</h3>
                  {scholarship.eligible && (
                    <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-semibold text-yellow-700">
                        🎓 Congratulations! You are eligible for {scholarship.name} of ₹{scholarship.amount.toLocaleString()}!
                      </p>
                    </div>
                  )}
                  <p className="text-gray-600 mt-2">Our counselor will contact you soon.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-6 mt-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Building className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Apply for Admission</h2>
                    <div className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg inline-block">
                      <p className="text-purple-800 font-semibold text-sm">{college.name}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      {['Personal', '10th Details', '12th Details', 'Review'].map((label, idx) => (
                        <div key={idx} className="text-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-purple-600 text-white ring-4 ring-purple-200' : 'bg-gray-200 text-gray-500'}`}>
                            {step > idx + 1 ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                          </div>
                          <p className={`text-[10px] mt-1 hidden sm:block ${step === idx + 1 ? 'text-purple-600 font-semibold' : 'text-gray-400'}`}>{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                        animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                      />
                    </div>
                  </div>

                  {/* Student Info Card */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" />
                      Student Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 bg-white rounded-lg px-3 py-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{userName || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 bg-white rounded-lg px-3 py-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{userEmail || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 bg-white rounded-lg px-3 py-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{userPhone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Premium Offer Banner (Optional) */}
                  {hasOffer && showOffer && !loadingOffer && !isDiscounted && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                      <div className="relative bg-gradient-to-r from-red-600 via-orange-500 to-pink-600 rounded-xl overflow-hidden shadow-lg">
                        <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
                        <div className="relative p-4">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                <Gift className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-3 h-3 text-yellow-300" />
                                  <span className="text-[10px] font-bold text-yellow-200 uppercase tracking-wider">Limited Time Offer</span>
                                  <Sparkles className="w-3 h-3 text-yellow-300" />
                                </div>
                                <p className="text-sm font-bold text-white mt-0.5">{selectedOffer.name}</p>
                              </div>
                            </div>
                            <div className="text-center md:text-right">
                              <div className="flex items-center gap-2">
                                <span className="text-xs line-through text-white/60">₹{selectedOffer.originalFee.toLocaleString()}</span>
                                <span className="text-2xl font-bold text-white">₹{selectedOffer.discountedFee.toLocaleString()}</span>
                              </div>
                              <p className="text-[10px] text-green-200">Save ₹{(selectedOffer.originalFee - selectedOffer.discountedFee).toLocaleString()}</p>
                            </div>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleApplyOffer} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg font-semibold text-sm">
                              <Zap className="w-4 h-4 text-red-500" />
                              <span className="text-red-600">Claim Offer</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Offer Applied Success Message */}
                  {offerApplied && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="mb-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-semibold text-green-800">Offer Applied Successfully!</p>
                            <p className="text-[10px] text-green-600">You saved ₹{(registrationFee - (appliedOffer?.discountedFee || 0)).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Registration Fee Card */}
                  <div className={`rounded-xl p-4 mb-6 shadow-sm ${isDiscounted ? 'bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-300' : 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 font-semibold">Registration Fee</span>
                        {isDiscounted && (<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-200 rounded-full text-[10px] font-bold text-green-800"><CheckCircle className="w-2.5 h-2.5" />Offer Applied</span>)}
                      </div>
                      {isDiscounted ? (
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-sm line-through text-gray-400">₹{registrationFee.toLocaleString()}</span>
                            <span className="text-2xl font-bold text-green-700">₹{finalFee.toLocaleString()}</span>
                          </div>
                          <p className="text-[10px] text-green-600">Saved ₹{(registrationFee - finalFee).toLocaleString()}</p>
                        </div>
                      ) : hasOffer ? (
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-sm line-through text-gray-400">₹{registrationFee.toLocaleString()}</span>
                            <span className="text-2xl font-bold text-purple-600">₹{selectedOffer!.discountedFee.toLocaleString()}</span>
                          </div>
                          <p className="text-[10px] text-gray-500">Claim offer above to save</p>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-700">₹{registrationFee.toLocaleString()}</span>
                          <p className="text-[10px] text-gray-500 mt-0.5">One Time Payment (Refundable)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scholarship Alert */}
                  {scholarship.eligible && step === 4 && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-800">🎓 Scholarship Available!</p>
                          <p className="text-xs text-yellow-700">You are eligible for {scholarship.name} of ₹{scholarship.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step Content */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course <span className="text-red-500">*</span></label>
                        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition-all ${validationErrors.course ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'}`}>
                          <option value="">Choose a course</option>
                          {college.courses.map((course, idx) => (<option key={idx} value={course}>{course}</option>))}
                        </select>
                        {validationErrors.course && <p className="text-red-500 text-xs mt-1">Please select a course</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us? <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-2">
                          {hearAboutOptions.map(opt => {
                            const Icon = opt.icon;
                            return (
                              <button key={opt.value} type="button" onClick={() => setHearAbout(opt.value)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${hearAbout === opt.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-200'}`}>
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{opt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        {validationErrors.hearAbout && <p className="text-red-500 text-xs mt-1">Please select an option</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Counseling Mode <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-3 gap-2">
                          {counselingModes.map(mode => {
                            const Icon = mode.icon;
                            return (
                              <button key={mode.value} type="button" onClick={() => setCounselingMode(mode.value)} className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${counselingMode === mode.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-200'}`}>
                                <Icon className="w-5 h-5" />
                                <span className="text-xs">{mode.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        {validationErrors.counselingMode && <p className="text-red-500 text-xs mt-1">Please select counseling mode</p>}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-blue-600" /> 10th Details
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Board <span className="text-red-500">*</span></label>
                            <select value={formData.tenthBoard} onChange={(e) => handleChange('tenthBoard', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg bg-white ${validationErrors.tenthBoard ? 'border-red-500' : 'border-gray-200'}`}>
                              <option value="">Select Board</option>
                              {boards.map((board, idx) => (<option key={idx} value={board}>{board}</option>))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Percentage <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <input type="number" step="0.01" placeholder="Percentage %" value={formData.tenthPercentage} onChange={(e) => handleChange('tenthPercentage', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg bg-white ${validationErrors.tenthPercentage ? 'border-red-500' : 'border-gray-200'}`} />
                              {grade10th && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Grade: {grade10th}</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year <span className="text-red-500">*</span></label>
                            <select value={formData.tenthPassingYear} onChange={(e) => handleChange('tenthPassingYear', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg bg-white ${validationErrors.tenthPassingYear ? 'border-red-500' : 'border-gray-200'}`}>
                              <option value="">Passing Year</option>
                              {getPassingYears().map((year, idx) => (<option key={idx} value={year}>{year}</option>))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="bg-green-50/30 rounded-xl p-4 border border-green-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-green-600" /> 12th/Intermediate Details
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Board <span className="text-red-500">*</span></label>
                            <select value={formData.twelfthBoard} onChange={(e) => handleChange('twelfthBoard', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg bg-white ${validationErrors.twelfthBoard ? 'border-red-500' : 'border-gray-200'}`}>
                              <option value="">Select Board</option>
                              {boards.map((board, idx) => (<option key={idx} value={board}>{board}</option>))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Percentage <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <input type="number" step="0.01" placeholder="Percentage %" value={formData.twelfthPercentage} onChange={(e) => handleChange('twelfthPercentage', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg bg-white ${validationErrors.twelfthPercentage ? 'border-red-500' : 'border-gray-200'}`} />
                              {grade12th && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Grade: {grade12th}</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year <span className="text-red-500">*</span></label>
                            <select value={formData.twelfthPassingYear} onChange={(e) => handleChange('twelfthPassingYear', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg bg-white ${validationErrors.twelfthPassingYear ? 'border-red-500' : 'border-gray-200'}`}>
                              <option value="">Passing Year</option>
                              {getPassingYears().map((year, idx) => (<option key={idx} value={year}>{year}</option>))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-5">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">📋 Application Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between py-2 border-b border-white/50"><span className="text-gray-600">Course:</span><span className="font-semibold">{selectedCourse || 'Not selected'}</span></div>
                          <div className="flex justify-between py-2 border-b border-white/50"><span className="text-gray-600">10th Board:</span><span>{formData.tenthBoard || 'Not provided'}</span></div>
                          <div className="flex justify-between py-2 border-b border-white/50"><span className="text-gray-600">10th Percentage:</span><span>{formData.tenthPercentage || 'Not provided'}% {grade10th && `(Grade: ${grade10th})`}</span></div>
                          <div className="flex justify-between py-2 border-b border-white/50"><span className="text-gray-600">12th Board:</span><span>{formData.twelfthBoard || 'Not provided'}</span></div>
                          <div className="flex justify-between py-2 border-b border-white/50"><span className="text-gray-600">12th Percentage:</span><span>{formData.twelfthPercentage || 'Not provided'}% {grade12th && `(Grade: ${grade12th})`}</span></div>
                          <div className="flex justify-between py-2 border-b border-white/50"><span className="text-gray-600">Counseling Mode:</span><span>{counselingMode ? counselingModes.find(m => m.value === counselingMode)?.label : 'Not selected'}</span></div>
                          <div className="flex justify-between py-2 border-b border-white/50"><span className="text-gray-600">Heard About:</span><span>{hearAbout ? hearAboutOptions.find(h => h.value === hearAbout)?.label : 'Not selected'}</span></div>
                          <div className="flex justify-between py-2"><span className="text-gray-600">Registration Fee:</span><span className="font-bold text-green-600">₹{finalFee.toLocaleString()}</span></div>
                          {appliedOffer && <div className="flex justify-between py-2"><span className="text-gray-600">Offer Applied:</span><span className="font-semibold text-purple-600">{appliedOffer.name} (-₹{(registrationFee - finalFee).toLocaleString()})</span></div>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message (Optional)</label>
                        <textarea rows={3} value={formData.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="Any specific questions or requirements?" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl mt-4">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 mt-6">
                    {step > 1 && (
                      <button onClick={prevStep} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                    )}
                    {step < totalSteps ? (
                      <button onClick={nextStep} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition">
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={handleSubmit} disabled={loading || alreadyApplied} className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50">
                        {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : <><Send className="w-5 h-5" /> Submit Application</>}
                      </button>
                    )}
                  </div>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-4 mt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1"><Shield className="w-3 h-3" /><span>100% Secure</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>24/7 Support</span></div>
                    <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /><span>Free Counseling</span></div>
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