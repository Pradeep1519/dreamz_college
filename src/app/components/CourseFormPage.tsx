import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Phone, Mail, User, Calendar, MapPin, GraduationCap, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { auth, db, hasUserSubmittedForCourse, saveInquiry, getUserInquiries } from '../../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function CourseFormPage() {
  const { courseSlug, courseName } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    state: '',
    course: courseName || '',
    courseSlug: courseSlug || '',
    specialization: '',
    qualification: '',
    passingYear: '',
  });
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user already submitted for this course
  useEffect(() => {
    const checkExisting = async () => {
      const savedPhone = localStorage.getItem('dreamz_user_phone');
      if (savedPhone && courseSlug) {
        const exists = await hasUserSubmittedForCourse(savedPhone, courseSlug);
        setAlreadySubmitted(exists);
        if (exists) {
          setFormData(prev => ({ ...prev, phone: savedPhone }));
        }
      }
    };
    checkExisting();
  }, [courseSlug]);

  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateName = (name: string) => name.trim().length >= 2;

  const handleSendOTP = async () => {
    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Enter valid 10-digit number' });
      return;
    }
    setLoading(true);
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      const result = await signInWithPhoneNumber(auth, `+91${formData.phone}`, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep(2);
    } catch (error) {
      console.error(error);
      setErrors({ phone: 'Failed to send OTP. Try again.' });
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Enter 6-digit OTP' });
      return;
    }
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      localStorage.setItem('dreamz_user_phone', formData.phone);
      setStep(3);
    } catch (error) {
      setErrors({ otp: 'Invalid OTP. Try again.' });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveInquiry({
        ...formData,
        phoneNumber: formData.phone,
        timestamp: new Date().toISOString(),
      });
      // Save user to Firestore
      const userRef = doc(db, 'users', formData.phone);
      await setDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      setStep(4);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error(error);
      alert('Submission failed. Try again.');
    }
    setLoading(false);
  };

  if (alreadySubmitted) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Applied! 🎉</h2>
          <p className="text-gray-600 mb-4">
            You have already submitted an inquiry for <strong>{courseName}</strong>.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-purple-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="text-center mb-6">
            <GraduationCap className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900">Apply for {courseName}</h1>
            <p className="text-gray-500 text-sm">Fill your details to get personalized guidance</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {['Verify', 'Details', 'Submit'].map((label, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step > idx ? 'bg-purple-600 text-white' : step === idx + 1 ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-500'}`}>
                  {step > idx ? '✓' : idx + 1}
                </div>
                <span className="text-xs mt-1 text-gray-500">{label}</span>
              </div>
            ))}
          </div>

          <div id="recaptcha-container"></div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="9876543210" className="w-full pl-9 pr-3 py-2 border rounded-lg" />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <button onClick={handleSendOTP} disabled={loading} className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP *</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.slice(0, 6))} placeholder="123456" className="w-full px-3 py-2 border rounded-lg text-center text-2xl tracking-widest" />
                {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
              </div>
              <button onClick={handleVerifyOTP} disabled={loading} className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Specialization (if any)</label><input type="text" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <button type="submit" disabled={loading} className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Application</>}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Application Submitted! 🎉</h2>
              <p className="text-gray-600 mt-2">Our counselor will contact you soon.</p>
              <p className="text-gray-400 text-sm mt-4">Redirecting to dashboard...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}