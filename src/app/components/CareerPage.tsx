import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, MapPin, Calendar, DollarSign, 
  Clock, Award, ExternalLink, Filter, Search,
  Building2, GraduationCap, Users, TrendingUp,
  X, Phone, Mail, User, MessageCircle, Send, CheckCircle,
  Video, Camera, Edit, Zap, Headphones, Globe, Home
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  workType: 'On-site' | 'Remote' | 'Hybrid';
  type: 'Full Time' | 'Part Time' | 'Internship' | 'Contract';
  category: 'Counseling' | 'Creative' | 'Sales' | 'Other';
  experience: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applyLink: string;
  openings: number;
  featured?: boolean;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwei6HSYNEuzHTWHNUV3bWJLsa5o_7BysoDJx2AAslZ2MFRv5-0a1Jjb3ALiBULuLUR/exec';

const jobs: Job[] = [
  {
    id: 'jd-001',
    title: 'Admission Counselor',
    company: 'Dreamz College (by JuniorDream Pvt Ltd)',
    location: 'Noida, Delhi NCR',
    workType: 'On-site',
    type: 'Full Time',
    category: 'Counseling',
    experience: 'Freshers can apply',
    description: 'We are looking for enthusiastic Admission Counselors to guide students for college admissions. You will handle calls, provide counseling, and help students choose the right career path.',
    requirements: [
      'Excellent communication skills in Hindi & English',
      'Confident & result-oriented personality',
      'Passion for helping students',
      'Freshers are welcome to apply',
      'Basic computer knowledge'
    ],
    postedDate: new Date().toISOString().split('T')[0],
    applyLink: '/career/apply/jd-001',
    openings: 5,
    featured: true
  },
  {
    id: 'jd-002',
    title: 'Content Creator (Reels / Social Media)',
    company: 'Dreamz College (by JuniorDream Pvt Ltd)',
    location: 'Delhi NCR / Remote',
    workType: 'Remote',
    type: 'Full Time',
    category: 'Creative',
    experience: 'Freshers can apply',
    description: 'Create engaging reels and videos for social media platforms. Develop creative content that showcases our college offerings and student success stories.',
    requirements: [
      'Basic video editing skills (CapCut, Premiere Pro, or similar)',
      'Creative mindset with understanding of Instagram trends',
      'Knowledge of social media platforms (Instagram, YouTube, Facebook)',
      'Freshers with portfolio can apply',
      'Self-motivated and able to work independently'
    ],
    postedDate: new Date().toISOString().split('T')[0],
    applyLink: '/career/apply/jd-002',
    openings: 2,
    featured: true
  },
  {
    id: 'jd-003',
    title: 'Telecaller / Admission Executive',
    company: 'Dreamz College (by JuniorDream Pvt Ltd)',
    location: 'Noida, Delhi NCR',
    workType: 'On-site',
    type: 'Full Time',
    category: 'Sales',
    experience: 'Freshers can apply',
    description: 'Handle student calls, explain the admission process, and follow up with prospective students. Convert inquiries into admissions.',
    requirements: [
      'Good communication skills in Hindi & English',
      'Confident speaker with pleasant voice',
      'Basic computer knowledge',
      'Freshers are welcome',
      'Target-oriented mindset'
    ],
    postedDate: new Date().toISOString().split('T')[0],
    applyLink: '/career/apply/jd-003',
    openings: 4,
    featured: true
  }
];

const JobApplicationModal = ({ job, isOpen, onClose }: { job: Job | null; isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    qualification: '',
    portfolio: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = { name: '', phone: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) { newErrors.name = 'Name is required'; isValid = false; }
    if (!formData.phone.trim()) { newErrors.phone = 'Phone number is required'; isValid = false; }
    else if (!validatePhone(formData.phone)) { newErrors.phone = 'Phone number must be exactly 10 digits'; isValid = false; }
    if (!formData.email.trim()) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!validateEmail(formData.email)) { newErrors.email = 'Please enter a valid email address'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) setFormData({ ...formData, phone: value });
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

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918796033021?text=${encodedMessage}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      sendToWhatsApp();
      await submitToGoogleSheets();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', phone: '', email: '', experience: '', qualification: '', portfolio: '', message: '' });
        onClose();
      }, 3000);
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              <p><span className="font-semibold">Experience:</span> {job.experience}</p>
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
                <option value="Graduate (BA/B.Sc/B.Com)">Graduate (BA/B.Sc/B.Com)</option>
                <option value="BCA">BCA</option>
                <option value="B.Tech/B.E.">B.Tech/B.E.</option>
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
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Why should we hire you? (Optional)</label>
              <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tell us about your skills and experience..." />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Application</>}
            </button>
            <p className="text-center text-xs text-gray-400">Your data is safe with us. We'll never share your information.</p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export function CareerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Counseling', 'Creative', 'Sales', 'Other'];
  const workTypes = ['All', 'On-site', 'Remote', 'Hybrid'];

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

  return (
    <>
      <Helmet>
        <title>Career at Dreamz College | Hiring Admission Counselor, Content Creator, Telecaller | JuniorDream</title>
        <meta name="description" content="Join Dreamz College (by JuniorDream Pvt Ltd). Hiring Admission Counselor, Content Creator, and Telecaller in Noida. Freshers can apply. Work from home available for Content Creator role. Apply now!" />
        <meta name="keywords" content="career at dreamz college, admission counselor job, content creator job, telecaller job, noida jobs, fresher jobs, work from home, junior dream careers" />
      </Helmet>
      <div className="space-y-8 pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Join Our Team</h1>
          <p className="text-lg opacity-90">Build your career with Dreamz College</p>
          <p className="text-sm mt-2 opacity-75">3 exciting openings • Freshers welcome • Work from home available</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <Briefcase className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{jobs.length}</div>
            <div className="text-xs text-gray-500">Openings</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <MapPin className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">Noida</div>
            <div className="text-xs text-gray-500">Location</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <Home className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">Remote</div>
            <div className="text-xs text-gray-500">Option Available</div>
          </div>
        </div>

        {/* Featured Jobs */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Current Openings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    {getJobIcon(job.title)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{job.title}</h3>
                  <p className="text-blue-600 font-medium text-center text-sm mb-4">{job.company}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                      {job.workType === 'Remote' ? <Home className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      <span>{job.workType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                      <Users className="w-4 h-4" />
                      <span>{job.openings} {job.openings === 1 ? 'opening' : 'openings'}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <p className="text-xs text-gray-500 text-center">{job.experience}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      setSelectedJob(job);
                      setIsModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Apply Now <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Join Us */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-center mb-6">Why Join Dreamz College?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Growth Opportunities</h3>
              <p className="text-sm text-gray-600">Fast career growth with performance-based promotions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Performance Incentives</h3>
              <p className="text-sm text-gray-600">Attractive salary + performance-based incentives</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Work-Life Balance</h3>
              <p className="text-sm text-gray-600">Flexible work options including work from home</p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <JobApplicationModal
              job={selectedJob}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}