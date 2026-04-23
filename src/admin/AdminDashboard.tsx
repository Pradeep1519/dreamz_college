// src/admin/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Building, BookOpen, BarChart3, 
  Phone, FileText, Settings, Bell, 
  Shield, LogOut, Menu, X, Home,
  ChevronDown, ChevronRight, Sparkles, Crown,
  TrendingUp, Calendar, CheckCircle, Clock, Eye, XCircle
} from 'lucide-react';
import { UserManagement } from './components/UserManagement';
import { CollegeManagement } from './components/CollegeManagement';
import { CourseManagement } from './components/CourseManagement';
import { AnalyticsReports } from './components/AnalyticsReports';
import { LeadManagement } from './components/LeadManagement';
import { ContentManagement } from './components/ContentManagement';
import { Settings as SettingsComponent } from './components/Settings';
import { Notifications } from './components/Notifications';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

type TabId = 'overview' | 'users' | 'colleges' | 'courses' | 'analytics' | 'leads' | 'content' | 'settings' | 'notifications';

interface Tab {
  id: TabId;
  label: string;
  icon: any;
  description: string;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Home, description: 'Dashboard home' },
  { id: 'users', label: 'User Management', icon: Users, description: 'Manage users, edit, block, delete' },
  { id: 'colleges', label: 'College Management', icon: Building, description: 'Add, edit, delete colleges' },
  { id: 'courses', label: 'Course Management', icon: BookOpen, description: 'Manage courses and fees' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'View charts and reports' },
  { id: 'leads', label: 'Lead Management', icon: Phone, description: 'Track student inquiries' },
  { id: 'content', label: 'Content', icon: FileText, description: 'Manage blogs, testimonials, banners' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Configure platform settings' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Send push/email/SMS' }
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('admin_email') || 'Admin';
    setAdminEmail(email);
    setAdminName(email.split('@')[0]);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      // Get users count
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const totalUsers = usersSnapshot.size;

      // Get colleges count
      const collegesRef = collection(db, 'colleges');
      const collegesSnapshot = await getDocs(collegesRef);
      const totalColleges = collegesSnapshot.size;

      // Get inquiries/applications
      const inquiriesRef = collection(db, 'inquiries');
      const inquiriesSnapshot = await getDocs(inquiriesRef);
      const applications = inquiriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalApplications = applications.length;
      const pendingApplications = applications.filter(a => a.status === 'pending').length;
      const reviewedApplications = applications.filter(a => a.status === 'reviewed').length;
      const acceptedApplications = applications.filter(a => a.status === 'accepted').length;
      const rejectedApplications = applications.filter(a => a.status === 'rejected').length;

      // Today's applications
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayApplications = applications.filter(a => {
        const date = new Date(a.createdAt);
        return date >= today;
      }).length;

      // This week's applications
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekApplications = applications.filter(a => {
        const date = new Date(a.createdAt);
        return date >= weekAgo;
      }).length;

      setStats({
        totalUsers,
        totalColleges,
        totalCourses: 0, // Will be fetched from courses collection
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
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');
    window.location.href = '/admin-login';
  };

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
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
      case 'content':
        return <ContentManagement />;
      case 'settings':
        return <SettingsComponent />;
      case 'notifications':
        return <Notifications />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Welcome back, {adminName}!</h1>
              </div>
              <p className="text-purple-100">Here's what's happening with your platform today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-purple-600" />
              <StatCard title="Total Colleges" value={stats.totalColleges} icon={Building} color="bg-blue-600" />
              <StatCard title="Total Applications" value={stats.totalApplications} icon={FileText} color="bg-green-600" />
              <StatCard title="Today's Apps" value={stats.todayApplications} icon={Calendar} color="bg-orange-600" />
            </div>

            {/* Application Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.pendingApplications}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Reviewed</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.reviewedApplications}</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Accepted</p>
                    <p className="text-2xl font-bold text-green-700">{stats.acceptedApplications}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-700">{stats.rejectedApplications}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => setActiveTab('users')} className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Manage Users</p>
                </button>
                <button onClick={() => setActiveTab('colleges')} className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
                  <Building className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Add College</p>
                </button>
                <button onClick={() => setActiveTab('leads')} className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
                  <Phone className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">View Applications</p>
                </button>
                <button onClick={() => setActiveTab('notifications')} className="p-4 bg-orange-50 rounded-xl text-center hover:bg-orange-100 transition-colors">
                  <Bell className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Send Notification</p>
                </button>
              </div>
            </div>

            {/* Recent Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Applications this week</span>
                    <span className="font-semibold text-purple-600">{stats.weekApplications}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Applications today</span>
                    <span className="font-semibold text-blue-600">{stats.todayApplications}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Total registered users</span>
                    <span className="font-semibold text-green-600">{stats.totalUsers}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">💡 <span>Use "Lead Management" to review student applications</span></li>
                  <li className="flex items-start gap-2">💡 <span>Update application status to keep students informed</span></li>
                  <li className="flex items-start gap-2">💡 <span>Export data as CSV for offline analysis</span></li>
                  <li className="flex items-start gap-2">💡 <span>Send notifications to engage with students</span></li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || Home;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Dreamz College Admin</h1>
                  <p className="text-xs text-gray-500">{adminEmail}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed lg:relative z-10 bg-white border-r border-gray-200 w-72 min-h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-4">
            <div className="mb-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-xl">
                <ActiveIcon className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
                </span>
              </div>
            </div>
            
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : ''}`} />
                    <span className="text-sm font-medium flex-1">{tab.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-purple-400" />}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700">Admin Access</span>
                </div>
                <p className="text-[10px] text-gray-500">Full system access granted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}