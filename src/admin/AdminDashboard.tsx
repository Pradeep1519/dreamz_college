// src/admin/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Building, BookOpen, BarChart3, 
  Phone, FileText, Settings, Bell, 
  Shield, LogOut, Menu, X, Home,
  ChevronDown, ChevronRight, Sparkles, Crown
} from 'lucide-react';
import { UserManagement } from './components/UserManagement';
import { CollegeManagement } from './components/CollegeManagement';
import { CourseManagement } from './components/CourseManagement';
import { AnalyticsReports } from './components/AnalyticsReports';
import { LeadManagement } from './components/LeadManagement';
import { ContentManagement } from './components/ContentManagement';
import { Settings as SettingsComponent } from './components/Settings';
import { Notifications } from './components/Notifications';

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

  useEffect(() => {
    const email = localStorage.getItem('admin_email') || 'Admin';
    setAdminEmail(email);
    setAdminName(email.split('@')[0]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');
    window.location.href = '/admin-login';
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">Loading...</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Colleges</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">Loading...</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">Loading...</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">Loading...</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-orange-600" />
                  </div>
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
                <button onClick={() => setActiveTab('courses')} className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
                  <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Add Course</p>
                </button>
                <button onClick={() => setActiveTab('notifications')} className="p-4 bg-orange-50 rounded-xl text-center hover:bg-orange-100 transition-colors">
                  <Bell className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Send Notification</p>
                </button>
              </div>
            </div>

            {/* Tip of the Day */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">💡 Pro Tip</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Use the sidebar to navigate between different management sections. 
                    You can manage users, colleges, courses, leads, and more from one place!
                  </p>
                </div>
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