// src/app/components/CareerPage.tsx

import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, MapPin, Building2, Home, Users, Award, TrendingUp,
  X, Phone, Mail, User, Send, CheckCircle,
  Video, Camera, Headphones, GraduationCap,
  Calendar, Clock, ExternalLink, Search, Filter,
  FileText, Upload, Loader2, Sparkles
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  workType: 'On-site' | 'Remote' | 'Hybrid';
  type: 'Full Time' | 'Part Time' | 'Internship' | 'Contract' | 'Freelance' | 'Temporary';
  category: string;
  experience: string;
  description: string;
  requirements: string[];
  openings: number;
  requireResume: boolean;
  status: string;
  createdAt: string;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwei6HSYNEuzHTWHNUV3bWJLsa5o_7BysoDJx2AAslZ2MFRv5-0a1Jjb3ALiBULuLUR/exec';

const JobApplicationModal = ({ job, isOpen, onClose }: { job: Job | null; isOpen: boolean; onClose: () => void }) => {
  const { user, userData } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    qualification: '',
    portfolio: '',
    message: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({ name: '', phone: '', email: '', resume: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || user.displayName || '',
        email: userData.email || user.email || '',
        phone: userData.phone || user.phoneNumber || ''
      }));
    }
  }, [user, userData]);

  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = { name: '', phone: '', email: '', resume: '' };
    let isValid = true;
    if (!formData.name.trim()) { newErrors.name = 'Name is required'; isValid = false; }
    if (!formData.phone.trim()) { newErrors.phone = 'Phone number is required'; isValid = false; }
    else if (!validatePhone(formData.phone)) { newErrors.phone = 'Phone number must be exactly 10 digits'; isValid = false; }
    if (!formData.email.trim()) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!validateEmail(formData.email)) { newErrors.email = 'Please enter a valid email address'; isValid = false; }
    if (job?.requireResume && !resumeFile) { newErrors.resume = 'Please upload your resume/CV'; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) setFormData({ ...formData, phone: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type.includes('word') || file.type.includes('document')) {
        setResumeFile(file);
        setErrors(prev => ({ ...prev, resume: '' }));
      } else {
        setErrors(prev => ({ ...prev, resume: 'Please upload PDF or DOC file' }));
      }
    }
  };

  const uploadResume = async (): Promise<string> => {
    if (!resumeFile) return '';
    const storageRef = ref(storage, `job_resumes/${job?.id}/${Date.now()}_${resumeFile.name}`);
    await uploadBytes(storageRef, resumeFile);
    return await getDownloadURL(storageRef);
  };

  const submitToGoogleSheets = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('job_title', job?.title || '');
      formDataToSend.append('job_id', job?.id || '');
      formDataToSend.append('company', job?.company || '');
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('qualification', formData.qualification);
      formDataToSend.append('portfolio', formData.portfolio);
      formDataToSend.append('message', formData.message || 'No message');
      formDataToSend.append('timestamp', new Date().toISOString());
      formDataToSend.append('source', 'Career Page - Job Application');
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formDataToSend, mode: 'no-cors' });
      return true;
    } catch (error) { return false; }
  };

  const sendToWhatsApp = () => {
    const message = `📋 *New Job Application - Dreamz College*
    
🎯 *Position:* ${job?.title}
📍 *Location:* ${job?.location}
🏢 *Work Type:* ${job?.workType}

👤 *Applicant Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email}
🎓 *Qualification:* ${formData.qualification || 'Not provided'}
💼 *Experience:* ${formData.experience || 'Not provided'}
🔗 *Portfolio:* ${formData.portfolio || 'Not provided'}
💬 *Message:* ${formData.message || 'No message'}
⏰ *Applied on:* ${new Date().toLocaleString()}`;
    window.open(`https://wa.me/918796033021?text=${encodeURIComponent(message)}`, '_blank');
  };

  const submitApplication = async () => {
    try {
      let resumeUrl = '';
      if (resumeFile) {
        resumeUrl = await uploadResume();
      }
      
      const readableId = `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-6)}`;
      const applicationRef = doc(db, 'job_applications', readableId);
      await setDoc(applicationRef, {
        jobId: job!.id,
        jobTitle: job!.title,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        qualification: formData.qualification,
        experience: formData.experience,
        portfolio: formData.portfolio,
        message: formData.message,
        resumeUrl,
        status: 'pending',
        appliedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error saving application:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setUploading(true);
    try {
      await submitApplication();
      sendToWhatsApp();
      await submitToGoogleSheets();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', phone: '', email: '', experience: '', qualification: '', portfolio: '', message: '' });
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
      }, 3000);
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <button onClick={onClose} className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          <h2 className="text-2xl font-bold mb-1">Apply for {job.title}</h2>
          <p className="text-white/90 text-sm">{job.company}</p>
          <p className="text-white/80 text-xs mt-1">{job.location} • {job.workType}</p>
        </div>
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Sent!</h3>
            <p className="text-gray-600">We'll review your application and contact you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p><span className="font-semibold">Position:</span> {job.title}</p>
              <p><span className="font-semibold">Location:</span> {job.location}</p>
              <p><span className="font-semibold">Work Type:</span> {job.workType}</p>
              <p><span className="font-semibold">Experience:</span> {job.experience || 'Freshers can apply'}</p>
              <p><span className="font-semibold">Openings:</span> {job.openings}</p>
            </div>
            
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your full name" /></div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="tel" required value={formData.phone} onChange={handlePhoneChange} className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="10-digit mobile number" maxLength={10} /></div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="your@email.com" /></div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
              <select value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select qualification</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Diploma">Diploma</option>
                <option value="Graduate">Graduate (BA/B.Sc/B.Com)</option>
                <option value="BCA">BCA</option>
                <option value="B.Tech">B.Tech/B.E.</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select experience</option>
                <option value="Fresher">Fresher (No experience)</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-2 years">1-2 years</option>
                <option value="2-3 years">2-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
            
            {job.title.includes('Content Creator') && (
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Portfolio / Social Media Handle (Optional)</label>
                <div className="relative"><Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Instagram handle or portfolio link" /></div>
              </div>
            )}
            
            {/* 🔥 NEW: Resume Upload Section */}
            {job.requireResume && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV <span className="text-red-500">*</span></label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${errors.resume ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-400'}`}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    {resumeFile ? (
                      <>
                        <FileText className="w-10 h-10 text-green-600" />
                        <p className="text-sm font-medium text-gray-700">{resumeFile.name}</p>
                        <p className="text-xs text-gray-500">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700">Click to upload resume</p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                      </>
                    )}
                  </label>
                </div>
                {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
              </div>
            )}
            
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Why should we hire you? (Optional)</label>
              <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tell us about your skills and experience..." />
            </div>
            
            <button type="submit" disabled={isSubmitting || uploading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting || uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> {uploading ? 'Uploading...' : 'Submitting...'}</> : <><Send className="w-4 h-4" /> Submit Application</>}
            </button>
            <p className="text-center text-xs text-gray-400">Your data is safe with us. We'll never share your information.</p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export function CareerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Counseling', 'Creative', 'Sales', 'Other', 'Engineering', 'Medical', 'Nursing', 'Pharmacy', 'Management', 'IT & Computer', 'Law', 'Commerce', 'Education', 'Marketing', 'HR', 'Finance'];
  const workTypes = ['All', 'On-site', 'Remote', 'Hybrid'];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobsRef = collection(db, 'jobs');
      const q = query(jobsRef, where('status', '==', 'active'));
      const snapshot = await getDocs(q);
      const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[];
      jobsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesWorkType = selectedWorkType === 'All' || job.workType === selectedWorkType;
    return matchesSearch && matchesCategory && matchesWorkType;
  });

  const getJobIcon = (title: string) => {
    if (title.includes('Counselor')) return <GraduationCap className="w-12 h-12 text-blue-500" />;
    if (title.includes('Content')) return <Video className="w-12 h-12 text-purple-500" />;
    if (title.includes('Telecaller')) return <Headphones className="w-12 h-12 text-green-500" />;
    return <Briefcase className="w-12 h-12 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Career at Dreamz College | Hiring Now | JuniorDream</title>
        <meta name="description" content="Join Dreamz College team. We're hiring various positions in Noida. Freshers can apply. Work from home available." />
      </Helmet>
      <div className="space-y-8 pt-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Join Our Team</h1>
          <p className="text-lg opacity-90">Build your career with Dreamz College</p>
          <p className="text-sm mt-2 opacity-75">{jobs.length} active openings • Freshers welcome • Work from home available</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center"><Briefcase className="w-6 h-6 text-blue-600 mx-auto mb-2" /><div className="text-2xl font-bold">{jobs.length}</div><div className="text-xs text-gray-500">Openings</div></div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center"><MapPin className="w-6 h-6 text-green-600 mx-auto mb-2" /><div className="text-2xl font-bold">Noida</div><div className="text-xs text-gray-500">Location</div></div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center"><Home className="w-6 h-6 text-purple-600 mx-auto mb-2" /><div className="text-2xl font-bold">Remote</div><div className="text-xs text-gray-500">Option Available</div></div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search jobs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
          <div className="flex gap-2"><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border rounded-lg"><option value="All">All Categories</option>{categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select><select value={selectedWorkType} onChange={(e) => setSelectedWorkType(e.target.value)} className="px-3 py-2 border rounded-lg"><option value="All">All Types</option>{workTypes.filter(w => w !== 'All').map(w => <option key={w} value={w}>{w}</option>)}</select></div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl"><Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No active job openings at the moment.</p><p className="text-sm text-gray-400 mt-1">Check back later for opportunities!</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                <div className="p-6">
                  <div className="flex justify-center mb-4">{getJobIcon(job.title)}</div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{job.title}</h3>
                  <p className="text-blue-600 font-medium text-center text-sm mb-4">{job.company}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 justify-center"><MapPin className="w-4 h-4" /><span>{job.location}</span></div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">{job.workType === 'Remote' ? <Home className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}<span>{job.workType}</span></div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 justify-center"><Users className="w-4 h-4" /><span>{job.openings} {job.openings === 1 ? 'opening' : 'openings'}</span></div>
                    {job.requireResume && <div className="flex items-center gap-2 text-xs text-purple-600 justify-center"><FileText className="w-3 h-3" /> Resume Required</div>}
                  </div>
                  <div className="border-t border-gray-100 pt-3 mb-3"><p className="text-xs text-gray-500 text-center">{job.experience || 'Freshers can apply'}</p></div>
                  <button onClick={() => { setSelectedJob(job); setIsModalOpen(true); }} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">Apply Now <ExternalLink className="w-3 h-3" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-center mb-6">Why Join Dreamz College?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><TrendingUp className="w-6 h-6 text-blue-600" /></div><h3 className="font-semibold mb-1">Growth Opportunities</h3><p className="text-sm text-gray-600">Fast career growth with performance-based promotions</p></div>
            <div className="text-center"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3"><Award className="w-6 h-6 text-purple-600" /></div><h3 className="font-semibold mb-1">Performance Incentives</h3><p className="text-sm text-gray-600">Attractive salary + performance-based incentives</p></div>
            <div className="text-center"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><GraduationCap className="w-6 h-6 text-green-600" /></div><h3 className="font-semibold mb-1">Work-Life Balance</h3><p className="text-sm text-gray-600">Flexible work options including work from home</p></div>
          </div>
        </div>

        <AnimatePresence>{isModalOpen && (<JobApplicationModal job={selectedJob} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />)}</AnimatePresence>
      </div>
    </>
  );
}