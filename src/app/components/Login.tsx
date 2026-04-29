// src/app/components/Login.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, ArrowRight, CheckCircle, Shield, Users, Award, TrendingUp,
  Star, Lock, X, Sparkles, Crown, Mail, User, MapPin,
  LogIn, UserPlus, Send, AlertCircle, Gift, Zap
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useOffers } from '../hooks/useOffers';

const LOGO_URL = '/logo1.png';
const BACKEND_URL = import.meta.env.DEV
  ? 'http://localhost:5001/api/auth'
  : 'https://dreamzcollege-backend.onrender.com/api/auth';

interface LoginProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLoginSuccess?: () => void;
}

const testimonials = [
  { id: 1, name: "Priya Sharma", course: "B.Tech Computer Science", text: "Dreamz College helped me get admission in my dream college! The counseling was completely free and very helpful.", rating: 5, year: "2024", image: "👩‍🎓" },
  { id: 2, name: "Rahul Verma", course: "MBA Marketing", text: "Thanks to Dreamz College, I got admission in a top B-school. Their expert guidance made the entire process smooth.", rating: 5, year: "2024", image: "👨‍🎓" },
  { id: 3, name: "Neha Gupta", course: "BCA", text: "The college comparison feature helped me choose the best college. Highly recommended for all students!", rating: 5, year: "2024", image: "👩‍🎓" },
  { id: 4, name: "Amit Singh", course: "B.Pharm", text: "Dreamz College provided me with the best counseling. I secured admission in a top pharmacy college.", rating: 5, year: "2024", image: "👨‍🎓" },
  { id: 5, name: "Sneha Patel", course: "BBA", text: "Free expert counseling changed my career path. I'm now studying at one of the best management colleges.", rating: 5, year: "2024", image: "👩‍🎓" }
];

const locations = ["Greater Noida", "Noida", "Delhi", "Ghaziabad", "Lucknow", "Agra", "Meerut", "Other"];

export function Login({ isOpen = true, onClose, onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '';
  
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [signinEmail, setSigninEmail] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Offer related states
  const { offers } = useOffers({ location: 'login_popup', autoFetch: true });
  const [showOffer, setShowOffer] = useState(true);
  const [offerClaimed, setOfferClaimed] = useState(false);
  const loginOffer = offers.find(o => o.locations?.includes('login_popup'));

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearTimeout(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const handleSendSignupOTP = async () => {
    if (!name.trim()) { setError('Please enter your full name'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return; }
    if (!validatePhone(phone)) { setError('Please enter a valid 10-digit mobile number'); return; }
    if (!location) { setError('Please select your location'); return; }

    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await response.json();
      if (data.success) {
        setStep('otp');
        setResendTimer(60);
        setSuccessMessage(`OTP sent to ${email}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  const handleSendSigninOTP = async () => {
    if (!validateEmail(signinEmail)) { setError('Please enter a valid email address'); return; }
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/send-signin-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signinEmail })
      });
      const data = await response.json();
      if (data.success) {
        setStep('otp');
        setResendTimer(60);
        setSuccessMessage(`OTP sent to ${signinEmail}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  const handleVerifySignupOTP = async () => {
    if (!otp || otp.length !== 6) { setError('Please enter 6-digit OTP'); return; }
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, name, phone, location })
      });
      const data = await response.json();
      if (data.success) {
        const userCredential = await signInWithCustomToken(auth, data.token);
        localStorage.setItem('dreamz_user_uid', userCredential.user.uid);
        localStorage.setItem('dreamz_user_email', email);
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          if (onClose) onClose();
          if (onLoginSuccess) onLoginSuccess();
          navigate(returnTo || '/');
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
    setLoading(false);
  };

  const handleVerifySigninOTP = async () => {
    if (!otp || otp.length !== 6) { setError('Please enter 6-digit OTP'); return; }
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/verify-signin-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signinEmail, otp })
      });
      const data = await response.json();
      if (data.success) {
        const userCredential = await signInWithCustomToken(auth, data.token);
        localStorage.setItem('dreamz_user_uid', userCredential.user.uid);
        localStorage.setItem('dreamz_user_email', signinEmail);
        setSuccessMessage('Signed in successfully!');
        setTimeout(() => {
          if (onClose) onClose();
          if (onLoginSuccess) onLoginSuccess();
          navigate(returnTo || '/');
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');
    try {
      const payload = mode === 'signup' ? { email, name, type: 'signup' } : { email: signinEmail, name: 'User', type: 'signin' };
      const response = await fetch(`${BACKEND_URL}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setResendTimer(60);
        setSuccessMessage('OTP resent successfully!');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to resend OTP');
    }
    setLoading(false);
  };

  const handleVerifyOTP = () => {
    if (mode === 'signup') handleVerifySignupOTP();
    else handleVerifySigninOTP();
  };

  const switchMode = () => {
    setMode(mode === 'signup' ? 'signin' : 'signup');
    setStep('form');
    setError('');
    setSuccessMessage('');
    setOtp('');
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setSigninEmail('');
    setShowOffer(true);
    setOfferClaimed(false);
  };

  const handleClaimOffer = () => {
    setOfferClaimed(true);
    if (mode === 'signup') {
      setTimeout(() => {
        const nameInput = document.querySelector('input[placeholder="Enter your full name"]') as HTMLInputElement;
        if (nameInput) nameInput.focus();
      }, 100);
    } else {
      setTimeout(() => {
        const emailInput = document.querySelector('input[placeholder="priya@example.com"]') as HTMLInputElement;
        if (emailInput) emailInput.focus();
      }, 100);
    }
    setTimeout(() => setOfferClaimed(false), 4000);
  };

  const getOfferDiscount = () => {
    if (!loginOffer) return 0;
    return loginOffer.originalFee - loginOffer.discountedFee;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop with unique key */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
      />
      
      {/* Modal with unique key */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-5xl z-50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Mobile friendly */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 lg:-right-12 lg:top-0 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* LEFT SIDE - Branding (Hidden on mobile) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block p-6"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <img src={LOGO_URL} alt="Dreamz College" className="w-12 h-12 object-contain" />
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Dreamz College</h1>
                    <p className="text-xs text-gray-600">Learn from achievers to become one</p>
                  </div>
                </div>

                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{mode === 'signup' ? 'Create Account! 🎓' : 'Welcome Back! 👋'}</h2>
                  <p className="text-sm text-gray-600">{mode === 'signup' ? 'Join thousands of students who found their dream college' : 'Sign in to access personalized college recommendations'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3">
                    <Users className="w-5 h-5 text-purple-600 mb-1" />
                    <div className="text-xl font-bold text-gray-900">25+</div>
                    <div className="text-xs text-gray-600">Partner Colleges</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-3">
                    <Award className="w-5 h-5 text-blue-600 mb-1" />
                    <div className="text-xl font-bold text-gray-900">50K+</div>
                    <div className="text-xs text-gray-600">Students Guided</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mb-1" />
                    <div className="text-xl font-bold text-gray-900">₹1.37Cr</div>
                    <div className="text-xs text-gray-600">Highest Package</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-3">
                    <Shield className="w-5 h-5 text-orange-600 mb-1" />
                    <div className="text-xl font-bold text-gray-900">100%</div>
                    <div className="text-xs text-gray-600">Free Counseling</div>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs text-gray-700">Compare 25+ top colleges in Greater Noida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs text-gray-700">Get free expert counseling for admission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs text-gray-700">100% placement assistance guarantee</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 mt-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={testimonials[currentTestimonial].id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 italic mb-2">"{testimonials[currentTestimonial].text}"</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                          <p className="text-xs text-purple-600">{testimonials[currentTestimonial].course} • {testimonials[currentTestimonial].year}</p>
                        </div>
                        <span className="text-2xl">{testimonials[currentTestimonial].image}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex justify-center gap-1.5 mt-3">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentTestimonial(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          currentTestimonial === idx ? 'w-4 bg-purple-600' : 'w-1.5 bg-purple-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE - FORM - Mobile responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-5 sm:p-6 md:p-8 flex flex-col justify-center max-h-[80vh] overflow-y-auto"
            >
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <img src={LOGO_URL} alt="Dreamz College" className="w-8 h-8 object-contain" />
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Dreamz College</h1>
                  <p className="text-[8px] text-gray-600 text-center">Learn from achievers to become one</p>
                </div>
              </div>

              <div className="max-w-sm mx-auto w-full">
                <div className="text-center mb-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 mb-2"
                  >
                    {mode === 'signup' ? <UserPlus className="w-3 h-3 text-purple-600" /> : <LogIn className="w-3 h-3 text-purple-600" />}
                    <span className="text-[9px] font-semibold text-purple-700 uppercase tracking-wider">
                      {mode === 'signup' ? 'Join Free' : 'Welcome Back'}
                    </span>
                    <Sparkles className="w-2.5 h-2.5 text-purple-500" />
                  </motion.div>
                  <motion.h2 className="text-xl md:text-2xl font-bold mb-0.5">
                    <span className="bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                      {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    </span>
                  </motion.h2>
                  <motion.div className="h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-2 rounded-full w-8" />
                  <motion.p className="text-[11px] text-gray-500">
                    {mode === 'signup' ? 'Fill details to get started' : 'Enter your email to receive OTP'}
                  </motion.p>
                </div>

                {step === 'otp' ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Lock className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Enter OTP</h3>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Enter the 6-digit code sent to <br />
                        <span className="font-medium text-purple-600">{mode === 'signup' ? email : signinEmail}</span>
                      </p>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full text-center text-xl tracking-widest py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoFocus
                      />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        <p className="text-xs text-red-600">{error}</p>
                      </div>
                    )}
                    {successMessage && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        <p className="text-xs text-green-700">{successMessage}</p>
                      </div>
                    )}
                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading || otp.length !== 6}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & {mode === 'signup' ? 'Sign Up' : 'Sign In'}
                          <CheckCircle className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setStep('form');
                          setOtp('');
                          setError('');
                          setSuccessMessage('');
                        }}
                        className="text-xs text-purple-600 font-medium"
                      >
                        ← Edit Email
                      </button>
                      <button
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0}
                        className="text-xs text-purple-600 font-medium disabled:opacity-50"
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-400 text-center">
                      Didn't receive OTP? Check your spam folder
                    </p>
                  </div>
                ) : mode === 'signup' ? (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Mobile Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-500 text-xs">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="Enter your mobile number"
                          className="w-full pl-[68px] pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm appearance-none bg-white"
                        >
                          <option value="">Select your city</option>
                          {locations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        <p className="text-xs text-red-600">{error}</p>
                      </div>
                    )}
                    <button
                      onClick={handleSendSignupOTP}
                      disabled={loading}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="email"
                          value={signinEmail}
                          onChange={(e) => {
                            setSigninEmail(e.target.value);
                            setError('');
                            setSuccessMessage('');
                          }}
                          placeholder="priya@example.com"
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        <p className="text-xs text-red-600">{error}</p>
                      </div>
                    )}
                    <button
                      onClick={handleSendSigninOTP}
                      disabled={loading || !validateEmail(signinEmail)}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Offer Banner - Mobile optimized */}
                {loginOffer && showOffer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mt-3"
                  >
                    <div className="relative bg-gradient-to-r from-red-50 via-orange-50 to-pink-50 rounded-xl p-2.5 border border-red-200 shadow-sm overflow-hidden">
                      <div className="relative flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                            <Gift className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                                LIMITED
                              </span>
                              <span className="text-[7px] text-gray-500">
                                {new Date(loginOffer.validTill).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[11px] font-bold text-gray-800 mt-0.5 line-clamp-1">
                              {loginOffer.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-0.5">
                            <span className="text-[9px] line-through text-gray-400">₹{loginOffer.originalFee.toLocaleString()}</span>
                            <span className="text-sm font-bold text-red-600">₹{loginOffer.discountedFee.toLocaleString()}</span>
                          </div>
                          <p className="text-[7px] font-semibold text-green-600">
                            Save ₹{getOfferDiscount().toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative mt-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-orange-500" />
                          <p className="text-[7px] text-gray-500">Limited seats</p>
                        </div>
                        
                        {offerClaimed ? (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1 bg-green-100 px-1.5 py-0.5 rounded-full"
                          >
                            <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                            <span className="text-[7px] font-semibold text-green-700">
                              Claimed!
                            </span>
                          </motion.div>
                        ) : (
                          <button
                            onClick={handleClaimOffer}
                            className="text-[7px] font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-0.5 rounded-full"
                          >
                            Claim →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="mt-3 text-center">
                  <p className="text-[10px] text-gray-500">
                    {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                    {' '}
                    <button onClick={switchMode} className="text-purple-600 font-medium text-[10px]">
                      {mode === 'signup' ? 'Sign In →' : 'Sign Up →'}
                    </button>
                  </p>
                </div>

                <div className="lg:hidden mt-3 pt-2 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div>
                      <div className="text-xs font-bold text-purple-600">25+</div>
                      <div className="text-[8px] text-gray-500">Colleges</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-600">50K+</div>
                      <div className="text-[8px] text-gray-500">Students</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-green-600">FREE</div>
                      <div className="text-[8px] text-gray-500">Counseling</div>
                    </div>
                  </div>
                </div>

                <p className="text-[7px] text-gray-400 text-center mt-2">
                  By continuing, you agree to Dreamz College's{' '}
                  <a href="/terms-of-service" className="text-purple-600 hover:underline">Terms</a>
                  {' '}and{' '}
                  <a href="/privacy-policy" className="text-purple-600 hover:underline">Privacy</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}