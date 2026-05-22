// src/admin/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Building, BookOpen, BarChart3, 
  Phone, FileText, Settings, Bell, 
  Shield, LogOut, Menu, X, Home,
  ChevronDown, ChevronRight, Sparkles, Crown,
  TrendingUp, Calendar, CheckCircle, Clock, Eye, XCircle,
  Tag, UserCog, Briefcase
} from 'lucide-react';
import { UserManagement } from './components/UserManagement';
import { CollegeManagement } from './components/CollegeManagement';
import { CourseManagement } from './components/CourseManagement';
import { AnalyticsReports } from './components/AnalyticsReports';
import { LeadManagement } from './components/LeadManagement';
import { ContentManagement } from './components/ContentManagement';
import { Settings as SettingsComponent } from './components/Settings';
import { Notifications } from './components/Notifications';
import { OffersManagement } from './components/OffersManagement';
import { CounselorManagement } from './components/CounselorManagement';
import { JobManagement } from './components/JobManagement';
import { JobApplications } from './components/JobApplications';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

type TabId = 'overview' | 'users' | 'colleges' | 'courses' | 'analytics' | 'leads' | 'content' | 'settings' | 'notifications' | 'offers' | 'counselors' | 'jobs' | 'job-applications';

interface Tab {
  id: TabId;
  label: string;
  icon: any;
  description: string;
  mobileLabel?: string;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Home, description: 'Dashboard home', mobileLabel: 'Home' },
  { id: 'users', label: 'User Management', icon: Users, description: 'Manage users', mobileLabel: 'Users' },
  { id: 'colleges', label: 'College Management', icon: Building, description: 'Manage colleges', mobileLabel: 'Colleges' },
  { id: 'courses', label: 'Course Management', icon: BookOpen, description: 'Manage courses', mobileLabel: 'Courses' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Analytics', mobileLabel: 'Stats' },
  { id: 'leads', label: 'Lead Management', icon: Phone, description: 'Student inquiries', mobileLabel: 'Leads' },
  { id: 'counselors', label: 'Counselors', icon: UserCog, description: 'Manage counselors', mobileLabel: 'Counselors' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, description: 'Manage job postings', mobileLabel: 'Jobs' },
  { id: 'job-applications', label: 'Job Applications', icon: FileText, description: 'View job applications', mobileLabel: 'Apps' },
  { id: 'content', label: 'Content', icon: FileText, description: 'Manage content', mobileLabel: 'Content' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Settings', mobileLabel: 'Settings' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Send notifications', mobileLabel: 'Alerts' },
  { id: 'offers', label: 'Offers', icon: Tag, description: 'Manage offers & discounts', mobileLabel: 'Offers' }
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [adminEmail, setAdminEmail] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalColleges: 0,
    totalCourses: 0,
    totalApplications: 0,
    pendingApplications: 0,
    reviewedApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    todayApplications: 0,
    weekApplications: 0
  });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const email = localStorage.getItem('admin_email') || 'Admin';
    setAdminEmail(email);
    setAdminName(email.split('@')[0]);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const totalUsers = usersSnapshot.size;

      const collegesRef = collection(db, 'colleges');
      const collegesSnapshot = await getDocs(collegesRef);
      const totalColleges = collegesSnapshot.size;

      const inquiriesRef = collection(db, 'inquiries');
      const inquiriesSnapshot = await getDocs(inquiriesRef);
      const applications = inquiriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalApplications = applications.length;
      const pendingApplications = applications.filter(a => a.status === 'pending').length;
      const reviewedApplications = applications.filter(a => a.status === 'reviewed').length;
      const acceptedApplications = applications.filter(a => a.status === 'accepted').length;
      const rejectedApplications = applications.filter(a => a.status === 'rejected').length;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayApplications = applications.filter(a => {
        const date = new Date(a.createdAt);
        return date >= today;
      }).length;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekApplications = applications.filter(a => {
        const date = new Date(a.createdAt);
        return date >= weekAgo;
      }).length;

      setStats({
        totalUsers,
        totalColleges,
        totalCourses: 0,
        totalApplications,
        pendingApplications,
        reviewedApplications,
        acceptedApplications,
        rejectedApplications,
        todayApplications,
        weekApplications
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');
    window.location.href = '/admin-login';
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'colleges':
        return <CollegeManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'leads':
        return <LeadManagement />;
      case 'counselors':
        return <CounselorManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'job-applications':
        return <JobApplications />;
      case 'content':
        return <ContentManagement />;
      case 'settings':
        return <SettingsComponent />;
      case 'notifications':
        return <Notifications />;
      case 'offers':
        return <OffersManagement />;
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <Shield className="w-5 h-5 sm:w-8 sm:h-8" />
                <h1 className="text-lg sm:text-2xl font-bold">Welcome back, {adminName}!</h1>
              </div>
              <p className="text-purple-100 text-xs sm:text-sm">Here's what's happening with your platform today.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-purple-600" />
              <StatCard title="Colleges" value={stats.totalColleges} icon={Building} color="bg-blue-600" />
              <StatCard title="Applications" value={stats.totalApplications} icon={FileText} color="bg-green-600" />
              <StatCard title="Today's Apps" value={stats.todayApplications} icon={Calendar} color="bg-orange-600" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs sm:text-sm text-yellow-600">Pending</p><p className="text-xl sm:text-2xl font-bold text-yellow-700">{stats.pendingApplications}</p></div>
                  <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs sm:text-sm text-blue-600">Reviewed</p><p className="text-xl sm:text-2xl font-bold text-blue-700">{stats.reviewedApplications}</p></div>
                  <Eye className="w-5 h-5 sm:w-8 sm:h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs sm:text-sm text-green-600">Accepted</p><p className="text-xl sm:text-2xl font-bold text-green-700">{stats.acceptedApplications}</p></div>
                  <CheckCircle className="w-5 h-5 sm:w-8 sm:h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-red-100">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs sm:text-sm text-red-600">Rejected</p><p className="text-xl sm:text-2xl font-bold text-red-700">{stats.rejectedApplications}</p></div>
                  <XCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3">
                <button onClick={() => setActiveTab('users')} className="p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl text-center hover:bg-purple-100 transition-colors">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Users</p>
                </button>
                <button onClick={() => setActiveTab('colleges')} className="p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl text-center hover:bg-blue-100 transition-colors">
                  <Building className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Colleges</p>
                </button>
                <button onClick={() => setActiveTab('leads')} className="p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl text-center hover:bg-green-100 transition-colors">
                  <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Leads</p>
                </button>
                <button onClick={() => setActiveTab('counselors')} className="p-3 sm:p-4 bg-pink-50 rounded-lg sm:rounded-xl text-center hover:bg-pink-100 transition-colors">
                  <UserCog className="w-4 h-4 sm:w-6 sm:h-6 text-pink-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Counselors</p>
                </button>
                <button onClick={() => setActiveTab('jobs')} className="p-3 sm:p-4 bg-indigo-50 rounded-lg sm:rounded-xl text-center hover:bg-indigo-100 transition-colors">
                  <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Jobs</p>
                </button>
                <button onClick={() => setActiveTab('offers')} className="p-3 sm:p-4 bg-orange-50 rounded-lg sm:rounded-xl text-center hover:bg-orange-100 transition-colors">
                  <Tag className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Offers</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  Recent Activity
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-xs sm:text-sm text-gray-600">This week</span>
                    <span className="font-semibold text-purple-600 text-sm sm:text-base">{stats.weekApplications}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-xs sm:text-sm text-gray-600">Today</span>
                    <span className="font-semibold text-blue-600 text-sm sm:text-base">{stats.todayApplications}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs sm:text-sm text-gray-600">Total Users</span>
                    <span className="font-semibold text-green-600 text-sm sm:text-base">{stats.totalUsers}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  Quick Tips
                </h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-start gap-2">💡 <span>Review student applications</span></li>
                  <li className="flex items-start gap-2">💡 <span>Update application statuses</span></li>
                  <li className="flex items-start gap-2">💡 <span>Assign leads to counselors</span></li>
                  <li className="flex items-start gap-2">💡 <span>Create new job postings</span></li>
                  <li className="flex items-start gap-2">💡 <span>Create special offers for students</span></li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || Home;
  const activeLabel = tabs.find(t => t.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100">
                {sidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-semibold text-gray-900 text-sm sm:text-base">Dreamz College Admin</h1>
                  <p className="text-[10px] sm:text-xs text-gray-500">{adminEmail}</p>
                </div>
                <div className="block sm:hidden">
                  <p className="font-semibold text-gray-900 text-sm">Admin</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="block md:hidden bg-purple-50 px-2 py-1 rounded-lg">
                <span className="text-xs font-medium text-purple-600">{activeLabel}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative">
        {sidebarOpen && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-30 transition-opacity" onClick={() => setSidebarOpen(false)} />
        )}
        
        <div className={`fixed lg:relative z-30 bg-white border-r border-gray-200 w-64 sm:w-72 min-h-screen transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-3 sm:p-4">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-purple-50 rounded-xl">
                <ActiveIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-purple-700 truncate">{activeLabel}</span>
              </div>
            </div>
            
            <nav className="space-y-0.5 sm:space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); if (isMobile) setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all text-left ${
                      isActive ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-purple-600' : ''}`} />
                    <span className="text-xs sm:text-sm font-medium flex-1">{tab.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-2 sm:p-3">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  <span className="text-[10px] sm:text-xs font-semibold text-purple-700">Admin Access</span>
                </div>
                <p className="text-[8px] sm:text-[10px] text-gray-500">Full system access granted</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-3 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}