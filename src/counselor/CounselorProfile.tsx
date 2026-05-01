// src/counselor/CounselorProfile.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, Mail, Phone, Award, Target, Calendar, Edit2, Save, X,
  Star, Users, TrendingUp, CheckCircle, Clock, LogOut,
  Shield, Lock, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut, updatePassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MobileBottomNav } from './components/MobileBottomNav';

export function CounselorProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [counselor, setCounselor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    qualification: '',
    experience: 0,
    languages: [] as string[]
  });

  useEffect(() => {
    fetchCounselorData();
  }, [user]);

  const fetchCounselorData = async () => {
    setLoading(true);
    try {
      const counselorsRef = collection(db, 'counselors');
      const q = query(counselorsRef, where('email', '==', user?.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setCounselor(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          qualification: data.qualification || '',
          experience: data.experience || 0,
          languages: data.languages || []
        });
      }
    } catch (error) {
      console.error('Error fetching counselor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const counselorsRef = collection(db, 'counselors');
      const q = query(counselorsRef, where('email', '==', user?.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const counselorDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'counselors', counselorDoc.id), {
          name: formData.name,
          phone: formData.phone,
          qualification: formData.qualification,
          experience: formData.experience,
          languages: formData.languages,
          updatedAt: new Date().toISOString()
        });
        setIsEditing(false);
        fetchCounselorData();
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await updatePassword(auth.currentUser!, newPassword);
      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordSuccess('');
      }, 2000);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setPasswordError('Please re-login to change password');
      } else {
        setPasswordError('Failed to change password');
      }
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

  const languageOptions = ['English', 'Hindi', 'Both'];

  const handleLanguageToggle = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
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
            <h1 className="text-xl font-bold">My Profile</h1>
            <p className="text-xs opacity-80 mt-1">Manage your account</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Edit2 className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleUpdateProfile} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Save className="w-5 h-5" />
              </button>
            )}
            <button onClick={handleLogout} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">{counselor?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-lg font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 w-full"
                />
              ) : (
                <h2 className="text-lg font-semibold text-gray-900">{counselor?.name}</h2>
              )}
              <p className="text-xs text-gray-500">{counselor?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{counselor?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex-1 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1"
                />
              ) : (
                <span className="text-gray-600">{counselor?.phone || 'Not provided'}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Award className="w-4 h-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="flex-1 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1"
                  placeholder="e.g., MBA in Marketing"
                />
              ) : (
                <span className="text-gray-600">{counselor?.qualification || 'Not provided'}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                  className="w-20 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1"
                />
              ) : (
                <span className="text-gray-600">{counselor?.experience || 0} years experience</span>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Languages</label>
              <div className="flex gap-2">
                {languageOptions.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      formData.languages.includes(lang) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-500">Total Leads</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{counselor?.totalAssignedLeads || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-500">Converted</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{counselor?.totalConvertedLeads || 0}</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Performance Metrics
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-medium">{Math.round((counselor?.totalConvertedLeads || 0) / (counselor?.totalAssignedLeads || 1) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min((counselor?.totalConvertedLeads || 0) / (counselor?.totalAssignedLeads || 1) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Daily Target</span>
              <span className="font-medium">{counselor?.dailyTarget || 10} calls/day</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monthly Target</span>
              <span className="font-medium">{counselor?.monthlyTarget || 250} leads/month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="px-4 mt-4 mb-4">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-xs text-gray-500">Update your login password</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab="profile" />

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">{passwordSuccess}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-xs text-red-600">{passwordError}</p>
                  </div>
                )}

                <button
                  onClick={handleChangePassword}
                  className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-semibold"
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}