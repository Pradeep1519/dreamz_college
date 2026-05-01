// src/counselor/CounselorDashboard.tsx

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Users, Phone, MessageCircle, Calendar, CheckCircle, Clock,
  TrendingUp, Award, Target, LogOut, User, Bell, ChevronRight,
  PhoneCall, Mail, Star, Sparkles, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getCounselorStats, getCounselorById, Counselor } from '../lib/counselorService';
import { getTodayFollowUps, LeadAssignment } from '../lib/leadAssignmentService';
import { MobileBottomNav } from './components/MobileBottomNav';

export function CounselorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [followUps, setFollowUps] = useState<LeadAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 🔥 FIX: Check if user exists
      if (!user || !user.uid) {
        console.error('No user found');
        setLoading(false);
        return;
      }

      // 🔥 FIX: Use authId instead of email
      const counselorsRef = collection(db, 'counselors');
      const q = query(counselorsRef, where('authId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const counselorData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Counselor;
        setCounselor(counselorData);
        
        // Get stats
        const statsData = await getCounselorStats(counselorData.id!);
        setStats(statsData);
        
        // Get today's follow-ups
        const followUpsData = await getTodayFollowUps(counselorData.id!);
        setFollowUps(followUpsData);
      } else {
        console.error('No counselor found for this user');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('counselor_logged_in');
      localStorage.removeItem('counselor_email');
      navigate('/counselor-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:+91${phone}`, '_blank');
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const message = `👋 Hello ${name}! This is ${counselor?.name} from Dreamz College. I'm here to help you with your admission process. Let me know if you have any questions!`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">{greeting}!</p>
            <h1 className="text-xl font-bold">{counselor?.name}</h1>
            <p className="text-xs opacity-80 mt-1">Today, {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/counselor/profile')} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats?.totalLeads || 0}</p>
              <p className="text-xs text-gray-500">Total Leads</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats?.convertedLeads || 0}</p>
              <p className="text-xs text-gray-500">Converted</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats?.todayCalls || 0}</p>
              <p className="text-xs text-gray-500">Today's Calls</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{Math.round(stats?.conversionRate || 0)}%</p>
              <p className="text-xs text-gray-500">Conversion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Target Progress */}
      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 border border-orange-100">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Today's Target</span>
            </div>
            <span className="text-sm font-bold text-orange-600">{stats?.todayCalls || 0}/{stats?.dailyTarget || 10} Calls</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((stats?.todayCalls || 0) / (stats?.dailyTarget || 10)) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((stats?.todayCalls || 0) >= (stats?.dailyTarget || 10)) 
              ? '🎉 Congratulations! Target achieved!' 
              : `🎯 Need ${(stats?.dailyTarget || 10) - (stats?.todayCalls || 0)} more calls to hit target`}
          </p>
        </div>
      </div>

      {/* Follow-ups Today */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Today's Follow-ups
          </h2>
          <button onClick={() => navigate('/counselor/leads')} className="text-sm text-purple-600 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {followUps.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-2" />
            <p className="text-gray-500">No follow-ups scheduled for today!</p>
            <p className="text-xs text-gray-400 mt-1">Enjoy your day 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {followUps.map((followUp) => (
              <div key={followUp.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Lead ID: {followUp.leadId?.slice(-8)}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Follow-up at: {new Date(followUp.followUpDate!).toLocaleTimeString()}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleCall('')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-xl text-sm font-medium"
                      >
                        <Phone className="w-4 h-4" /> Call
                      </button>
                      <button
                        onClick={() => handleWhatsApp('', 'Student')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-xl text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </button>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Performance Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-500">Conversion Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{Math.round(stats?.conversionRate || 0)}%</p>
            <p className="text-xs text-green-600 mt-1">↑ 5% from last week</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-500">Pending Leads</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.pendingLeads || 0}</p>
            <p className="text-xs text-orange-600 mt-1">Needs attention</p>
          </div>
        </div>
      </div>

      {/* Achievement Badge */}
      {stats?.conversionRate >= 70 && (
        <div className="px-4 mt-4 mb-4">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-3 border border-yellow-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-800">🎉 Star Performer!</p>
              <p className="text-xs text-yellow-600">You're in top 10% of counselors</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab="dashboard" />
    </div>
  );
}