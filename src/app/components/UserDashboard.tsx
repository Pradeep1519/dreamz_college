// src/app/components/UserDashboard.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserInquiries, db } from '../../lib/firebase';
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
  Instagram, Facebook, Twitter, Linkedin, Youtube
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, getDocs, query, where, addDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

// Motivational quotes array
const motivationalQuotes = [
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Your education is a dress rehearsal for a life that is yours to lead.", author: "Nora Ephron" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Strive for progress, not perfection.", author: "Unknown" }
];

export function UserDashboard() {
  const { user, userData, setUserData } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [counselingSessions, setCounselingSessions] = useState<CounselingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'counseling' | 'profile'>('applications');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  // Change quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userData) {
      fetchAllData();
      loadProfileImage();
    }
  }, [userData]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProfileImage = () => {
    const savedImage = localStorage.getItem(`profile_img_${userData?.uid}`);
    if (savedImage) setProfileImage(savedImage);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      if (userData?.phone) {
        const apps = await getUserInquiries(userData.phone);
        setInquiries(apps);
      }

      const savedRef = collection(db, 'saved_colleges');
      const savedQuery = query(savedRef, where('userId', '==', userData?.uid));
      const savedSnapshot = await getDocs(savedQuery);
      const savedList: SavedCollege[] = [];
      savedSnapshot.forEach((doc) => {
        savedList.push({ id: doc.id, ...doc.data() } as SavedCollege);
      });
      setSavedColleges(savedList);

      const counselingRef = collection(db, 'counseling_sessions');
      const counselingQuery = query(counselingRef, where('userId', '==', userData?.uid));
      const counselingSnapshot = await getDocs(counselingQuery);
      const counselingList: CounselingSession[] = [];
      counselingSnapshot.forEach((doc) => {
        counselingList.push({ id: doc.id, ...doc.data() } as CounselingSession);
      });
      setCounselingSessions(counselingList);

      setEditForm({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        location: userData?.location || ''
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const userRef = doc(db, 'users', userData?.uid);
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
      const storageRef = ref(storage, `profile_images/${userData?.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfileImage(url);
      localStorage.setItem(`profile_img_${userData?.uid}`, url);
      showToast('Profile picture updated', 'success');
    } catch (error) {
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveSavedCollege = async (collegeId: string) => {
    try {
      await deleteDoc(doc(db, 'saved_colleges', collegeId));
      setSavedColleges(savedColleges.filter(c => c.id !== collegeId));
      showToast('College removed from saved list', 'success');
    } catch (error) {
      showToast('Failed to remove college', 'error');
    }
  };

  const handleBookCounseling = () => {
    window.open('https://wa.me/918796033021?text=I want to book a counseling session with Dreamz College expert', '_blank');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      confirmed: <CheckCircle className="w-3 h-3" />,
      completed: <Award className="w-3 h-3" />,
      cancelled: <X className="w-3 h-3" />
    };
    return icons[status as keyof typeof icons] || icons.pending;
  };

  const filteredApplications = inquiries.filter(app => {
    const matchesSearch = app.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.college?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalApplications: inquiries.length,
    savedColleges: savedColleges.length,
    counselingSessions: counselingSessions.length,
    completedApplications: inquiries.filter(i => i.status === 'completed').length
  };

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
    >
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

          {/* ========== PREMIUM NAVIGATION HEADER ========== */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 mb-6 overflow-hidden"
          >
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-purple-700 to-blue-700 px-6 py-2 flex justify-between items-center text-white text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Trusted by 50,000+ Students
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  94% Placement Rate
                </span>
                <span className="hidden md:flex items-center gap-1">
                  <Gem className="w-3 h-3" />
                  NAAC A+ Accredited
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a href="/contact" className="hover:text-purple-200 transition-colors flex items-center gap-1">
                  <Headphones className="w-3 h-3" />
                  <span className="hidden sm:inline">Support</span>
                </a>
                <a href="/about" className="hover:text-purple-200 transition-colors hidden sm:block">About Us</a>
              </div>
            </div>

            {/* Main Header */}
            <div className="px-6 py-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                      Dreamz College
                    </h1>
                    <p className="text-[10px] text-gray-500">Learn from achievers to become one • Est. 2015</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.open('https://wa.me/918796033021', '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors">
                    <Gift className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Offers</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors">
                    <Bell className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Notifications</span>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-wrap gap-6 mt-4 pt-3 border-t border-gray-100 text-sm">
                <Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  Home
                </Link>
                <Link to="/colleges" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  Colleges
                </Link>
                <Link to="/courses" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Courses
                </Link>
                <Link to="/counseling" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Free Counseling
                </Link>
                <Link to="/blog" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Blog
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-gray-50">
                <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* ========== WELCOME CARD ========== */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-2xl"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 opacity-10">
              <Building className="w-40 h-40" />
            </div>
            <div className="absolute bottom-0 left-0 opacity-5">
              <GraduationCap className="w-32 h-32" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
              <Sparkles className="w-60 h-60" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-semibold tracking-wider text-yellow-200">STUDENT DASHBOARD</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {userData?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-purple-100 max-w-2xl">
                Your journey to success continues with Dreamz College — India's trusted education partner since 2015.
              </p>
              
              {/* Quick Stats Row */}
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">Students Guided</p>
                    <p className="text-sm font-semibold">50,000+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">Placement Rate</p>
                    <p className="text-sm font-semibold">94%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">Partner Colleges</p>
                    <p className="text-sm font-semibold">25+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">Scholarships</p>
                    <p className="text-sm font-semibold">UPTO ₹60K</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Motivational Quote Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-100 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Sparkle className="w-5 h-5 text-purple-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-700 italic">“{currentQuote.quote}”</p>
                <p className="text-xs text-gray-400 mt-1">— {currentQuote.author}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Dreamz College</p>
                <p className="text-[10px] text-gray-300">Since 2015</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard title="Applications" value={stats.totalApplications} icon={FileText} color="bg-purple-600" description="Total submitted" />
            <StatCard title="Saved Colleges" value={stats.savedColleges} icon={Heart} color="bg-pink-600" description="Your favorites" />
            <StatCard title="Counseling" value={stats.counselingSessions} icon={Calendar} color="bg-blue-600" description="Sessions booked" />
            <StatCard title="Completed" value={stats.completedApplications} icon={Award} color="bg-green-600" description="Applications done" />
          </div>

          {/* Company Info Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 mb-6 border border-amber-100">
            <div className="flex items-center justify-between flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800 font-medium">Dreamz College Pvt. Ltd.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-amber-600">
                <span>📍 Greater Noida, India</span>
                <span>📧 care@dreamzcollege.in</span>
                <span>📞 +91-8744053232</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6 bg-white/50 backdrop-blur-sm rounded-t-xl px-2">
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: 'applications', label: 'My Applications', icon: FileText },
                { id: 'saved', label: 'Saved Colleges', icon: Heart },
                { id: 'counseling', label: 'Counseling', icon: Calendar },
                { id: 'profile', label: 'Profile', icon: User }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.id ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="dashboardTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Under Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Not Selected</option>
                </select>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your journey starts here!</h3>
                  <p className="text-gray-500 mb-4">You haven't applied to any colleges yet. Explore and apply to your dream college today!</p>
                  <Link to="/colleges" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Explore Colleges <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <>
                  {filteredApplications.map((inquiry) => (
                    <motion.div
                      key={inquiry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedApplication(inquiry);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{inquiry.course}</h3>
                            <p className="text-sm text-gray-500">{inquiry.college || 'Dreamz College'}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              Applied on {new Date(inquiry.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status || 'pending')}`}>
                            {getStatusIcon(inquiry.status || 'pending')}
                            {inquiry.status === 'pending' ? 'Processing' : inquiry.status || 'Processing'}
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Export Applications
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Saved Colleges Tab */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedColleges.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved colleges yet</h3>
                  <p className="text-gray-500 mb-4">Save colleges you're interested in to review them later</p>
                  <Link to="/colleges" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Browse Colleges <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedColleges.map((college) => (
                    <motion.div
                      key={college.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={college.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop'}
                          alt={college.collegeName}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveSavedCollege(college.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{college.collegeName}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          {college.location}
                          <span className="flex items-center gap-1 ml-2">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {college.rating}
                          </span>
                        </div>
                        <p className="text-purple-600 font-semibold text-sm mt-2">{college.fee}</p>
                        <button
                          onClick={() => navigate(`/college/${college.collegeId}`)}
                          className="mt-3 inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Details <ArrowRight className="w-3 h-3" />
                        </button>
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
                  <div>
                    <h3 className="font-semibold text-gray-900">🎓 Need Career Guidance?</h3>
                    <p className="text-sm text-gray-600 mt-1">Book a free 1-on-1 counseling session with our expert career advisors</p>
                    <p className="text-xs text-green-600 mt-2">✅ 50,000+ students counseled | ✅ 94% satisfaction rate</p>
                  </div>
                  <button
                    onClick={handleBookCounseling}
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Book Free Session
                  </button>
                </div>
              </div>

              {counselingSessions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No counseling sessions booked</h3>
                  <p className="text-gray-500">Book a session to get personalized career guidance from our experts</p>
                </div>
              ) : (
                counselingSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{session.topic}</h4>
                          <p className="text-sm text-gray-500">with {session.counselor}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(session.date).toLocaleDateString()} at {session.time}
                          </p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        {session.status === 'pending' ? 'Scheduled' : session.status}
                      </span>
                    </div>
                    {session.notes && (
                      <p className="mt-3 text-sm text-gray-500 border-t pt-3">{session.notes}</p>
                    )}
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
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Student Profile</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            name: userData?.name || '',
                            email: userData?.email || '',
                            phone: userData?.phone || '',
                            location: userData?.location || ''
                          });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center overflow-hidden border-4 border-purple-200">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-purple-600" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-md">
                        <Camera className="w-4 h-4 text-white" />
                        <input type="file" accept="image/*" onChange={handleUploadProfileImage} className="hidden" disabled={uploading} />
                      </label>
                    </div>
                    {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
                    <p className="text-xs text-gray-400 mt-2">Click camera icon to update photo</p>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-gray-900">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{userData?.name || 'Not set'}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-gray-900">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{userData?.email || 'Not set'}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-gray-900">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{userData?.phone || 'Not set'}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            placeholder="e.g., Greater Noida"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-gray-900">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{userData?.location || 'Not set'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Member Since */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Member Since</span>
                        <span className="text-gray-900">2024</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-500">Dreamz College ID</span>
                        <span className="text-gray-900 font-mono text-xs">DZ-{userData?.uid?.slice(-8) || 'XXXX'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              © 2024 Dreamz College Pvt. Ltd. — Empowering students since 2015 | All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedApplication.course}</h4>
                  <p className="text-gray-500 text-sm">{selectedApplication.college || 'Dreamz College'}</p>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Application ID</span>
                    <span className="font-medium text-gray-900 font-mono">#{selectedApplication.id?.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Applied on</span>
                    <span className="text-gray-900">{new Date(selectedApplication.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status || 'pending')}`}>
                      {getStatusIcon(selectedApplication.status || 'pending')}
                      {selectedApplication.status === 'pending' ? 'Processing' : selectedApplication.status || 'Processing'}
                    </span>
                  </div>
                  {selectedApplication.specialization && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Specialization</span>
                      <span className="text-gray-900">{selectedApplication.specialization}</span>
                    </div>
                  )}
                  {selectedApplication.message && (
                    <div>
                      <span className="text-gray-500">Message</span>
                      <p className="text-gray-700 text-sm mt-1 bg-gray-50 p-3 rounded-lg">{selectedApplication.message}</p>
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 text-center mt-2">
                  <p className="text-xs text-purple-700">Our team will contact you within 24-48 hours regarding your application</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}