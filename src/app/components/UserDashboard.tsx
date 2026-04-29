// src/app/components/UserDashboard.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Calendar, CheckCircle, Clock, GraduationCap, 
  User, Phone, Mail, MapPin, Edit2, Save, X, 
  Heart, Briefcase, MessageCircle, Bell, TrendingUp,
  Star, Award, FileText, Download, Filter, Search,
  Eye, ChevronRight, Settings, LogOut, Camera,
  Plus, Trash2, ExternalLink, Sparkles, Zap, Target,
  ArrowRight, Crown, Shield, Trophy, Rocket, Gem,
  Building, Users, Globe, Coffee, Medal, Sparkle,
  Gift, HelpCircle, CreditCard, Headphones, Layers,
  Instagram, Facebook, Twitter, Linkedin, Youtube,
  School, GraduationCap as GradCap, Briefcase as BriefcaseIcon, CalendarDays, Clock as ClockIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Application {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  collegeId: string;
  collegeName: string;
  course: string;
  tenthBoard: string;
  tenthPercentage: number;
  tenthPassingYear: string;
  twelfthBoard: string;
  twelfthPercentage: number;
  twelfthPassingYear: string;
  message: string;
  status: string;
  createdAt: string;
  applicationType: string;
}

interface SavedCollege {
  id: string;
  collegeId: string;
  collegeName: string;
  location: string;
  rating: number;
  fee: string;
  image: string;
  savedAt: string;
}

interface CounselingSession {
  id: string;
  date: string;
  time: string;
  counselor: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  topic: string;
  notes?: string;
}

interface PlacementOffer {
  id: string;
  title: string;
  description: string;
  company: string;
  package: string;
  eligibility: string;
  lastDate: string;
  status: 'active' | 'expired' | 'upcoming';
}

const motivationalQuotes = [
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
];

// Sample placement offers data
const placementOffers: PlacementOffer[] = [
  {
    id: '1',
    title: 'Dreamz College Placement Assurance',
    description: 'Guaranteed placement assistance with top companies after course completion.',
    company: 'Multiple Companies',
    package: '₹3.5 LPA - ₹12 LPA',
    eligibility: 'Final Year Students',
    lastDate: '2026-12-31',
    status: 'active'
  },
  {
    id: '2',
    title: 'Software Engineering Placement Drive',
    description: 'Exclusive placement drive for Computer Science students with top MNCs.',
    company: 'TCS, Infosys, Wipro, Amazon',
    package: '₹4 LPA - ₹18 LPA',
    eligibility: 'B.Tech/BE CSE, IT, MCA',
    lastDate: '2026-10-15',
    status: 'active'
  },
  {
    id: '3',
    title: 'Management Trainee Program',
    description: 'MBA students get direct placement opportunities in leading companies.',
    company: 'HDFC Bank, ICICI, Deloitte, KPMG',
    package: '₹6 LPA - ₹15 LPA',
    eligibility: 'MBA/PGDM',
    lastDate: '2026-11-30',
    status: 'active'
  }
];

export function UserDashboard() {
  const { user, userData, setUserData } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [counselingSessions, setCounselingSessions] = useState<CounselingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'counseling' | 'profile' | 'placement'>('applications');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', location: '' });
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [selectedOffer, setSelectedOffer] = useState<PlacementOffer | null>(null);
  const [isPlacementInfoModalOpen, setIsPlacementInfoModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.uid) {
      fetchApplications();
      fetchSavedColleges();
      fetchCounselingSessions();
      loadProfileImage();
      setEditForm({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        location: userData?.location || ''
      });
    }
  }, [user?.uid, userData]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProfileImage = () => {
    const savedImage = localStorage.getItem(`profile_img_${user?.uid}`);
    if (savedImage) setProfileImage(savedImage);
  };

  const fetchApplications = async () => {
    try {
      const inquiriesRef = collection(db, 'inquiries');
      const q = query(inquiriesRef, where('userId', '==', user?.uid), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const apps: Application[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({
          id: doc.id,
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          collegeId: data.collegeId,
          collegeName: data.collegeName || data.college || 'Dreamz College',
          course: data.course,
          tenthBoard: data.tenthBoard || 'N/A',
          tenthPercentage: data.tenthPercentage || 0,
          tenthPassingYear: data.tenthPassingYear || 'N/A',
          twelfthBoard: data.twelfthBoard || 'N/A',
          twelfthPercentage: data.twelfthPercentage || 0,
          twelfthPassingYear: data.twelfthPassingYear || 'N/A',
          message: data.message || '',
          status: data.status || 'pending',
          createdAt: data.createdAt,
          applicationType: data.applicationType || 'basic'
        });
      });
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedColleges = async () => {
    try {
      const savedRef = collection(db, 'saved_colleges');
      const q = query(savedRef, where('userId', '==', user?.uid));
      const snapshot = await getDocs(q);
      const saved: SavedCollege[] = [];
      snapshot.forEach((doc) => {
        saved.push({ id: doc.id, ...doc.data() } as SavedCollege);
      });
      setSavedColleges(saved);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    }
  };

  const fetchCounselingSessions = async () => {
    try {
      const counselingRef = collection(db, 'counseling_sessions');
      const q = query(counselingRef, where('userId', '==', user?.uid));
      const snapshot = await getDocs(q);
      const sessions: CounselingSession[] = [];
      snapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() } as CounselingSession);
      });
      setCounselingSessions(sessions);
    } catch (error) {
      console.error('Error fetching counseling sessions:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const userRef = doc(db, 'users', user?.uid || '');
      await updateDoc(userRef, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        location: editForm.location,
        updatedAt: new Date().toISOString()
      });
      setUserData({ ...userData, ...editForm });
      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleUploadProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_images/${user?.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfileImage(url);
      localStorage.setItem(`profile_img_${user?.uid}`, url);
      showToast('Profile picture updated', 'success');
    } catch (error) {
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveSavedCollege = async (collegeId: string) => {
    try {
      await updateDoc(doc(db, 'saved_colleges', collegeId), { saved: false });
      setSavedColleges(savedColleges.filter(c => c.id !== collegeId));
      showToast('College removed from saved list', 'success');
    } catch (error) {
      showToast('Failed to remove college', 'error');
    }
  };

  const handleBookCounseling = () => {
    window.open('https://wa.me/918796033021?text=I want to book a counseling session with Dreamz College expert', '_blank');
  };

  // 🔥 UPDATED: Show info modal instead of applying directly
  const handlePlacementClick = (offer: PlacementOffer) => {
    setSelectedOffer(offer);
    setIsPlacementInfoModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewed: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: <Clock className="w-3 h-3" />,
      reviewed: <Eye className="w-3 h-3" />,
      accepted: <CheckCircle className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />
    };
    return icons[status] || icons.pending;
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.collegeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalApplications: applications.length,
    savedColleges: savedColleges.length,
    counselingSessions: counselingSessions.length,
    acceptedApplications: applications.filter(a => a.status === 'accepted').length
  };

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          {description && <p className="text-[10px] text-gray-400 mt-1">{description}</p>}
        </div>
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
          <p className="text-xs text-gray-400 mt-1">Dreamz College • Est. 2015</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Toast Notification */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`fixed top-24 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                  toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}
              >
                {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Navigation Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-md border border-gray-100 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700 to-blue-700 px-6 py-2 flex justify-between items-center text-white text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Trusted by 50,000+ Students</span>
                <span className="hidden sm:flex items-center gap-1"><Trophy className="w-3 h-3" /> 94% Placement Rate</span>
                <span className="hidden md:flex items-center gap-1"><Gem className="w-3 h-3" /> NAAC A+ Accredited</span>
              </div>
              <div className="flex items-center gap-3">
                <a href="/contact" className="hover:text-purple-200 transition-colors flex items-center gap-1"><Headphones className="w-3 h-3" /><span className="hidden sm:inline">Support</span></a>
                <a href="/about" className="hover:text-purple-200 transition-colors hidden sm:block">About Us</a>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md"><GraduationCap className="w-5 h-5 text-white" /></div>
                  <div><h1 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">Dreamz College</h1><p className="text-[10px] text-gray-500">Learn from achievers to become one • Est. 2015</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => window.open('https://wa.me/918796033021', '_blank')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"><MessageCircle className="w-3.5 h-3.5" /><span className="hidden sm:inline">WhatsApp</span></button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"><Gift className="w-3.5 h-3.5" /><span className="hidden sm:inline">Offers</span></button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"><Bell className="w-3.5 h-3.5" /><span className="hidden sm:inline">Notifications</span></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 mt-4 pt-3 border-t border-gray-100 text-sm">
                <Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Home</Link>
                <Link to="/colleges" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1"><Building className="w-3.5 h-3.5" /> Colleges</Link>
                <Link to="/courses" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Courses</Link>
                <Link to="/counseling" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> Free Counseling</Link>
                <Link to="/blog" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Blog</Link>
              </div>
              <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-gray-50">
                <a href="#" className="text-gray-400 hover:text-purple-600"><Instagram className="w-3.5 h-3.5" /></a>
                <a href="#" className="text-gray-400 hover:text-purple-600"><Facebook className="w-3.5 h-3.5" /></a>
                <a href="#" className="text-gray-400 hover:text-purple-600"><Twitter className="w-3.5 h-3.5" /></a>
                <a href="#" className="text-gray-400 hover:text-purple-600"><Linkedin className="w-3.5 h-3.5" /></a>
                <a href="#" className="text-gray-400 hover:text-purple-600"><Youtube className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          </motion.div>

          {/* Welcome Card */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 opacity-10"><Building className="w-40 h-40" /></div>
            <div className="absolute bottom-0 left-0 opacity-5"><GraduationCap className="w-32 h-32" /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2"><Crown className="w-5 h-5 text-yellow-400" /><span className="text-xs font-semibold tracking-wider text-yellow-200">STUDENT DASHBOARD</span></div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {userData?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-purple-100 max-w-2xl">Your journey to success continues with Dreamz College — India's trusted education partner since 2015.</p>
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Users className="w-4 h-4" /></div><div><p className="text-xs text-purple-200">Students Guided</p><p className="text-sm font-semibold">50,000+</p></div></div>
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Trophy className="w-4 h-4" /></div><div><p className="text-xs text-purple-200">Placement Rate</p><p className="text-sm font-semibold">94%</p></div></div>
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Building className="w-4 h-4" /></div><div><p className="text-xs text-purple-200">Partner Colleges</p><p className="text-sm font-semibold">25+</p></div></div>
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><CreditCard className="w-4 h-4" /></div><div><p className="text-xs text-purple-200">Scholarships</p><p className="text-sm font-semibold">UPTO ₹60K</p></div></div>
              </div>
            </div>
          </motion.div>

          {/* Motivational Quote Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-100 shadow-sm">
            <div className="flex items-start gap-3"><Sparkle className="w-5 h-5 text-purple-500 mt-0.5" /><div className="flex-1"><p className="text-gray-700 italic">“{currentQuote.quote}”</p><p className="text-xs text-gray-400 mt-1">— {currentQuote.author}</p></div><div className="text-right"><p className="text-xs text-gray-400">Dreamz College</p><p className="text-[10px] text-gray-300">Since 2015</p></div></div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard title="Applications" value={stats.totalApplications} icon={FileText} color="bg-purple-600" description="Total submitted" />
            <StatCard title="Saved Colleges" value={stats.savedColleges} icon={Heart} color="bg-pink-600" description="Your favorites" />
            <StatCard title="Counseling" value={stats.counselingSessions} icon={Calendar} color="bg-blue-600" description="Sessions booked" />
            <StatCard title="Accepted" value={stats.acceptedApplications} icon={Award} color="bg-green-600" description="Applications accepted" />
          </div>

          {/* Company Info Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 mb-6 border border-amber-100">
            <div className="flex items-center justify-between flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-2"><Building className="w-4 h-4 text-amber-600" /><span className="text-amber-800 font-medium">Dreamz College Pvt. Ltd.</span></div>
              <div className="flex items-center gap-3 text-xs text-amber-600"><span>📍 Greater Noida, India</span><span>📧 care@dreamzcollege.in</span><span>📞 +91-8744053232</span></div>
            </div>
          </div>

          {/* Tabs with Placement option */}
          <div className="border-b border-gray-200 mb-6 bg-white/50 backdrop-blur-sm rounded-t-xl px-2">
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: 'applications', label: 'My Applications', icon: FileText },
                { id: 'saved', label: 'Saved Colleges', icon: Heart },
                { id: 'counseling', label: 'Counseling', icon: Calendar },
                { id: 'placement', label: 'Placement', icon: BriefcaseIcon },
                { id: 'profile', label: 'Profile', icon: User }
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative ${activeTab === tab.id ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  <tab.icon className="w-4 h-4" /> {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="dashboardTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Placement Tab - with info popup on click */}
          {activeTab === 'placement' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <BriefcaseIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">🎓 Placement Opportunities</h3>
                    <p className="text-gray-600 mt-1">Exclusive placement offers for Dreamz College students</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ 100+ Companies</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✅ ₹12 LPA Highest Package</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">✅ 94% Placement Record</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Placement Offers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {placementOffers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handlePlacementClick(offer)}
                  >
                    {offer.id === '1' && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2 text-xs font-semibold">
                        ⭐ SPECIAL ANNOUNCEMENT ⭐
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <BriefcaseIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{offer.title}</h3>
                          <p className="text-xs text-gray-500">{offer.company}</p>
                        </div>
                      </div>

                      {/* Main Message */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 mb-3 border border-yellow-200 text-center">
                        <p className="text-sm font-bold text-orange-700 flex items-center justify-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          This opportunity will be available in your final year
                          <Sparkles className="w-4 h-4" />
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 mt-2">{offer.description}</p>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Package:</span>
                          <span className="font-semibold text-green-600">{offer.package}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Eligibility:</span>
                          <span className="text-gray-700">{offer.eligibility}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); handlePlacementClick(offer); }}
                        className="mt-4 w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <BriefcaseIcon className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Placement Statistics */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-purple-600" /> Placement Statistics 2025-26</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-xs text-gray-500">Placement Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">₹12 LPA</div>
                    <div className="text-xs text-gray-500">Highest Package</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">250+</div>
                    <div className="text-xs text-gray-500">Companies Visited</div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">Top Recruiters: TCS, Infosys, Wipro, Amazon, Microsoft, Deloitte, HDFC Bank</p>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search applications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                  <option value="all">All Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Under Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Not Selected</option>
                </select>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><Rocket className="w-10 h-10 text-purple-600" /></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your journey starts here!</h3>
                  <p className="text-gray-500 mb-4">You haven't applied to any colleges yet. Explore and apply to your dream college today!</p>
                  <Link to="/colleges" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">Explore Colleges <ArrowRight className="w-4 h-4" /></Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredApplications.map((app) => (
                    <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer" onClick={() => { setSelectedApplication(app); setIsModalOpen(true); }}>
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center"><GraduationCap className="w-6 h-6 text-purple-600" /></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{app.course}</h3>
                            <p className="text-sm text-gray-500">{app.collegeName}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" /> Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          {app.status === 'pending' ? 'Processing' : app.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-start gap-2"><School className="w-4 h-4 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500">10th</p><p className="text-xs text-gray-700">{app.tenthBoard} • {app.tenthPercentage}% • {app.tenthPassingYear}</p></div></div>
                        <div className="flex items-start gap-2"><GradCap className="w-4 h-4 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500">12th</p><p className="text-xs text-gray-700">{app.twelfthBoard} • {app.twelfthPercentage}% • {app.twelfthPassingYear}</p></div></div>
                      </div>
                      {app.message && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Message</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{app.message}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Colleges Tab */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedColleges.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4"><Heart className="w-10 h-10 text-pink-600" /></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved colleges yet</h3>
                  <p className="text-gray-500 mb-4">Save colleges you're interested in to review them later</p>
                  <Link to="/colleges" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">Browse Colleges <ArrowRight className="w-4 h-4" /></Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedColleges.map((college) => (
                    <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                      <div className="relative h-36 overflow-hidden">
                        <img src={college.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop'} alt={college.collegeName} className="w-full h-full object-cover" />
                        <button onClick={() => handleRemoveSavedCollege(college.id)} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{college.collegeName}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><MapPin className="w-3 h-3" />{college.location}<span className="flex items-center gap-1 ml-2"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{college.rating}</span></div>
                        <p className="text-purple-600 font-semibold text-sm mt-2">{college.fee}</p>
                        <button onClick={() => navigate(`/college/${college.collegeId}`)} className="mt-3 inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium">View Details <ArrowRight className="w-3 h-3" /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Counseling Tab */}
          {activeTab === 'counseling' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div><h3 className="font-semibold text-gray-900">🎓 Need Career Guidance?</h3><p className="text-sm text-gray-600 mt-1">Book a free 1-on-1 counseling session with our expert career advisors</p><p className="text-xs text-green-600 mt-2">✅ 50,000+ students counseled | ✅ 94% satisfaction rate</p></div>
                  <button onClick={handleBookCounseling} className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2 shadow-md"><MessageCircle className="w-4 h-4" /> Book Free Session</button>
                </div>
              </div>

              {counselingSessions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm"><div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-10 h-10 text-blue-600" /></div><h3 className="text-lg font-semibold text-gray-900 mb-2">No counseling sessions booked</h3><p className="text-gray-500">Book a session to get personalized career guidance from our experts</p></div>
              ) : (
                counselingSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div><div><h4 className="font-semibold text-gray-900">{session.topic}</h4><p className="text-sm text-gray-500">with {session.counselor}</p><p className="text-xs text-gray-400 mt-1">{new Date(session.date).toLocaleDateString()} at {session.time}</p></div></div>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}{session.status === 'pending' ? 'Scheduled' : session.status}
                      </span>
                    </div>
                    {session.notes && <p className="mt-3 text-sm text-gray-500 border-t pt-3">{session.notes}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div><h2 className="text-xl font-semibold text-gray-900">Student Profile</h2><p className="text-sm text-gray-500 mt-1">Manage your personal information</p></div>
                  {!isEditing ? <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg"><Edit2 className="w-4 h-4" /> Edit Profile</button> : <div className="flex gap-2"><button onClick={handleSaveProfile} className="px-4 py-2 bg-purple-600 text-white rounded-lg"><Save className="w-4 h-4" /> Save</button><button onClick={() => { setIsEditing(false); setEditForm({ name: userData?.name || '', email: userData?.email || '', phone: userData?.phone || '', location: userData?.location || '' }); }} className="px-4 py-2 bg-gray-100 rounded-lg"><X className="w-4 h-4" /> Cancel</button></div>}
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center overflow-hidden border-4 border-purple-200">
                        {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-purple-600" />}
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 shadow-md"><Camera className="w-4 h-4 text-white" /><input type="file" accept="image/*" onChange={handleUploadProfileImage} className="hidden" disabled={uploading} /></label>
                    </div>
                    {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
                    <p className="text-xs text-gray-400 mt-2">Click camera icon to update photo</p>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>{isEditing ? <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /> : <div className="flex items-center gap-2 text-gray-900"><User className="w-4 h-4 text-gray-400" />{userData?.name || 'Not set'}</div>}</div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>{isEditing ? <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /> : <div className="flex items-center gap-2 text-gray-900"><Mail className="w-4 h-4 text-gray-400" />{userData?.email || 'Not set'}</div>}</div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>{isEditing ? <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /> : <div className="flex items-center gap-2 text-gray-900"><Phone className="w-4 h-4 text-gray-400" />{userData?.phone || 'Not set'}</div>}</div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label>{isEditing ? <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /> : <div className="flex items-center gap-2 text-gray-900"><MapPin className="w-4 h-4 text-gray-400" />{userData?.location || 'Not set'}</div>}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Member Since</span><span className="text-gray-900">2024</span></div>
                  <div className="flex items-center justify-between text-sm mt-2"><span className="text-gray-500">Dreamz College ID</span><span className="text-gray-900 font-mono">DZ-{user?.uid?.slice(-8) || 'XXXX'}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t border-gray-200"><p className="text-xs text-gray-400">© 2024 Dreamz College Pvt. Ltd. — Empowering students since 2015 | All rights reserved.</p></div>
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-5 py-4 flex justify-between items-center"><h3 className="text-lg font-bold">Application Details</h3><button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button></div>
              <div className="p-5 space-y-4">
                <div className="text-center"><div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3"><GraduationCap className="w-8 h-8 text-purple-600" /></div><h4 className="text-xl font-bold">{selectedApplication.course}</h4><p className="text-gray-500">{selectedApplication.collegeName}</p><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedApplication.status)}`}>{getStatusIcon(selectedApplication.status)}{selectedApplication.status === 'pending' ? 'Processing' : selectedApplication.status}</span></div>
                <div className="border-t pt-4"><h5 className="font-semibold mb-2">10th Details</h5><div className="grid grid-cols-3 gap-2 text-sm bg-blue-50 p-3 rounded-lg"><div><span className="text-gray-500">Board</span><p>{selectedApplication.tenthBoard}</p></div><div><span className="text-gray-500">%</span><p>{selectedApplication.tenthPercentage}%</p></div><div><span className="text-gray-500">Year</span><p>{selectedApplication.tenthPassingYear}</p></div></div></div>
                <div><h5 className="font-semibold mb-2">12th Details</h5><div className="grid grid-cols-3 gap-2 text-sm bg-green-50 p-3 rounded-lg"><div><span className="text-gray-500">Board</span><p>{selectedApplication.twelfthBoard}</p></div><div><span className="text-gray-500">%</span><p>{selectedApplication.twelfthPercentage}%</p></div><div><span className="text-gray-500">Year</span><p>{selectedApplication.twelfthPassingYear}</p></div></div></div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm"><span>Applied on</span><span>{new Date(selectedApplication.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex justify-between text-sm mt-2"><span>Application ID</span><span className="font-mono">#{selectedApplication.id?.slice(-8)}</span></div>
                  {selectedApplication.message && <div className="mt-3"><p className="text-sm text-gray-500">Message</p><p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.message}</p></div>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔥 NEW: Placement Info Modal - Shows message about final year */}
      <AnimatePresence>
        {isPlacementInfoModalOpen && selectedOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsPlacementInfoModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><BriefcaseIcon className="w-5 h-5" /> Important Information</h3>
              </div>
              <div className="p-5 text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-10 h-10 text-orange-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Placement Opportunity</h4>
                <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
                  <p className="text-base font-bold text-orange-700 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    You have not taken admission in any course yet
                    <Sparkles className="w-5 h-5" />
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    This placement opportunity will be available to you in the <strong className="text-purple-600">last year of your course</strong>.
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-700">📌 Steps to get placement assistance:</p>
                  <ul className="text-xs text-gray-600 mt-2 space-y-1 text-left">
                    <li>✅ 1. First, apply for admission in your desired college</li>
                    <li>✅ 2. Complete your course successfully</li>
                    <li>✅ 3. In your final year, you'll get placement support</li>
                    <li>✅ 4. Our placement team will help you get placed</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <Link to="/colleges" onClick={() => setIsPlacementInfoModalOpen(false)} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-center">
                    Browse Colleges
                  </Link>
                  <button onClick={() => setIsPlacementInfoModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}