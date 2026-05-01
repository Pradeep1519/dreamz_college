// src/admin/components/CounselorManagement.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Plus, Edit, Trash2, Search, RefreshCw,
  CheckCircle, AlertCircle, X, Save, Eye,
  Mail, Phone, Award, Target, Star, Calendar,
  UserPlus, EyeOff, MailOpen, PhoneCall, Shield, MoreVertical
} from 'lucide-react';
import { Counselor, getAllCounselors, createCounselor, updateCounselor, deleteCounselor, toggleCounselorStatus } from '../../lib/counselorService';

const specializationOptions = [
  'Engineering', 'Management (MBA)', 'Medical', 'Nursing',
  'Pharmacy', 'Law', 'Commerce', 'IT & Computer', 'Education'
];

const languageOptions = ['English', 'Hindi', 'Both'];

export function CounselorManagement() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCounselor, setEditingCounselor] = useState<Counselor | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization: [] as string[],
    experience: 0,
    qualification: '',
    languages: [] as string[],
    dailyTarget: 10,
    monthlyTarget: 250,
    isActive: true
  });

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    setLoading(true);
    try {
      const data = await getAllCounselors();
      setCounselors(data);
    } catch (error) {
      showToast('Failed to fetch counselors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const handleLanguageToggle = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      showToast('Please fill required fields', 'error');
      return;
    }

    if (!editingCounselor && !formData.password) {
      showToast('Please enter password', 'error');
      return;
    }

    try {
      if (editingCounselor) {
        await updateCounselor(editingCounselor.id!, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          experience: formData.experience,
          qualification: formData.qualification,
          languages: formData.languages,
          dailyTarget: formData.dailyTarget,
          monthlyTarget: formData.monthlyTarget,
          isActive: formData.isActive
        });
        showToast('Counselor updated successfully', 'success');
      } else {
        await createCounselor({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          experience: formData.experience,
          qualification: formData.qualification,
          languages: formData.languages,
          dailyTarget: formData.dailyTarget,
          monthlyTarget: formData.monthlyTarget,
          isActive: formData.isActive
        }, formData.password);
        showToast('Counselor created successfully', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchCounselors();
    } catch (error: any) {
      showToast(error.message || 'Failed to save counselor', 'error');
    }
  };

  const handleDelete = async (counselor: Counselor) => {
    if (confirm(`Delete counselor "${counselor.name}"?`)) {
      try {
        await deleteCounselor(counselor.id!);
        showToast('Counselor deleted', 'success');
        fetchCounselors();
      } catch (error) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  const handleToggleStatus = async (counselor: Counselor) => {
    try {
      await toggleCounselorStatus(counselor.id!, !counselor.isActive);
      showToast(`Counselor ${!counselor.isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchCounselors();
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const resetForm = () => {
    setEditingCounselor(null);
    setFormData({
      name: '', email: '', phone: '', password: '',
      specialization: [], experience: 0, qualification: '',
      languages: [], dailyTarget: 10, monthlyTarget: 250, isActive: true
    });
    setShowPassword(false);
  };

  const handleEdit = (counselor: Counselor) => {
    setEditingCounselor(counselor);
    setFormData({
      name: counselor.name,
      email: counselor.email,
      phone: counselor.phone,
      password: '',
      specialization: counselor.specialization || [],
      experience: counselor.experience || 0,
      qualification: counselor.qualification || '',
      languages: counselor.languages || [],
      dailyTarget: counselor.dailyTarget || 10,
      monthlyTarget: counselor.monthlyTarget || 250,
      isActive: counselor.isActive
    });
    setIsModalOpen(true);
  };

  const filteredCounselors = counselors.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white text-sm ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">👥 Counselor Management</h2>
          <p className="text-sm text-gray-500">Create and manage counselors for lead assignment</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <UserPlus className="w-4 h-4" /> Add Counselor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Counselors</p>
          <p className="text-2xl font-bold">{counselors.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{counselors.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Leads Assigned</p>
          <p className="text-2xl font-bold text-blue-600">{counselors.reduce((sum, c) => sum + (c.totalAssignedLeads || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Conversion</p>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(counselors.reduce((sum, c) => sum + ((c.totalConvertedLeads || 0) / (c.totalAssignedLeads || 1) * 100), 0) / (counselors.length || 1))}%
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Counselors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredCounselors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No counselors found</div>
        ) : (
          filteredCounselors.map((counselor) => (
            <div key={counselor.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                      <span className="text-xl font-bold text-purple-700">
                        {counselor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{counselor.name}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">{counselor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">{counselor.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggleStatus(counselor)} className="p-1.5 rounded-lg hover:bg-gray-100">
                      {counselor.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    </button>
                    <button onClick={() => handleEdit(counselor)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(counselor)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {counselor.specialization?.slice(0, 3).map((spec, idx) => (
                    <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{spec}</span>
                  ))}
                  {counselor.specialization && counselor.specialization.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{counselor.specialization.length - 3}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span>Daily: {counselor.dailyTarget}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-green-500" />
                    <span>Conv: {counselor.totalConvertedLeads || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{counselor.rating || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>📋 Leads: {counselor.totalAssignedLeads || 0}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(counselor.isActive)}`}>
                    {counselor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingCounselor ? 'Edit Counselor' : 'Add New Counselor'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Full Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Phone *</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  {!editingCounselor && (
                    <div><label className="block text-sm font-medium mb-1">Password *</label><div className="relative"><input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
                  )}
                </div>

                <div><label className="block text-sm font-medium mb-1">Qualification</label><input type="text" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} placeholder="e.g., MBA in Marketing" className="w-full px-4 py-2 border rounded-lg" /></div>

                <div><label className="block text-sm font-medium mb-1">Experience (Years)</label><input type="number" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" /></div>

                <div><label className="block text-sm font-medium mb-1">Specializations</label><div className="flex flex-wrap gap-2">{specializationOptions.map(spec => (<button key={spec} type="button" onClick={() => handleSpecializationToggle(spec)} className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.specialization.includes(spec) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{spec}</button>))}</div></div>

                <div><label className="block text-sm font-medium mb-1">Languages</label><div className="flex gap-2">{languageOptions.map(lang => (<button key={lang} type="button" onClick={() => handleLanguageToggle(lang)} className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.languages.includes(lang) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{lang}</button>))}</div></div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Daily Target (Leads)</label><input type="number" value={formData.dailyTarget} onChange={(e) => setFormData({ ...formData, dailyTarget: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Monthly Target (Leads)</label><input type="number" value={formData.monthlyTarget} onChange={(e) => setFormData({ ...formData, monthlyTarget: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>

                <div className="flex items-center gap-3"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" /><label>Active (can login and access dashboard)</label></div>

                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={handleSubmit} className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg font-semibold"><Save className="w-4 h-4 inline mr-2" />{editingCounselor ? 'Update Counselor' : 'Create Counselor'}</button>
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 rounded-lg font-semibold">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}