// src/admin/components/JobApplications.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Search, RefreshCw, Eye, CheckCircle, XCircle,
  User, Mail, Phone, GraduationCap, Briefcase, Calendar,
  AlertCircle, Download, Filter, ChevronDown, Star, MessageCircle, Send,
  File, ExternalLink, Loader2, X, Trash2
} from 'lucide-react';
import { JobApplication, getAllApplications, updateApplicationStatus, deleteApplication } from '../../lib/firebase';

export function JobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (error) {
      showToast('Failed to fetch applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (appId: string, status: JobApplication['status']) => {
    try {
      await updateApplicationStatus(appId, status, adminNotes);
      showToast(`Status updated to ${status}`, 'success');
      fetchApplications();
      if (isViewModalOpen) setIsViewModalOpen(false);
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (appId: string) => {
    if (confirm('Delete this application?')) {
      try {
        await deleteApplication(appId);
        showToast('Application deleted', 'success');
        fetchApplications();
        if (isViewModalOpen) setIsViewModalOpen(false);
      } catch (error) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewed: 'bg-blue-100 text-blue-700',
      shortlisted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.pending;
  };

  // 🔥 Helper: Check if string is a valid URL
  const isValidUrl = (str: string): boolean => {
    return str.startsWith('http://') || str.startsWith('https://');
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.phone.includes(searchTerm) ||
                          app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    withResume: applications.filter(a => a.resumeUrl).length
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Job Title', 'Qualification', 'Experience', 'Resume', 'Status', 'Applied On'];
    const csvData = filteredApplications.map(app => [
      app.name, app.email, app.phone, app.jobTitle, app.qualification, app.experience,
      app.resumeUrl ? 'Yes' : 'No', app.status, new Date(app.appliedAt).toLocaleDateString()
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job_applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export complete', 'success');
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

      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">📋 Job Applications</h2>
          <p className="text-sm text-gray-500">View and manage candidate applications</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"><Download className="w-4 h-4" /> Export CSV</button>
          <button onClick={fetchApplications} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"><RefreshCw className="w-4 h-4" /> Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><p className="text-2xl font-bold text-gray-900">{stats.total}</p><p className="text-xs text-gray-500">Total</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p><p className="text-xs text-gray-500">Pending</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p><p className="text-xs text-gray-500">Reviewed</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><p className="text-2xl font-bold text-green-600">{stats.shortlisted}</p><p className="text-xs text-gray-500">Shortlisted</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><p className="text-2xl font-bold text-red-600">{stats.rejected}</p><p className="text-xs text-gray-500">Rejected</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><p className="text-2xl font-bold text-purple-600">{stats.withResume}</p><p className="text-xs text-gray-500">With Resume</p></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, email, phone or job..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">Applicant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Job Position</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Qualification</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Resume</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Applied On</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Loader2 className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedApp(app); setAdminNotes(app.adminNotes || ''); setIsViewModalOpen(true); }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{app.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm">{app.jobTitle}</span></td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{app.email}</div>
                      <div className="text-xs text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{app.qualification || 'N/A'}</td>
                    {/* 🔥 FIXED: Resume Column */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      {app.resumeUrl ? (
                        isValidUrl(app.resumeUrl) ? (
                          <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
                            <File className="w-4 h-4" /> View
                          </a>
                        ) : (
                          <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                            <FileText className="w-4 h-4" /> {app.resumeUrl}
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-gray-400">Not uploaded</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { setSelectedApp(app); setAdminNotes(app.adminNotes || ''); setIsViewModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsViewModalOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h3 className="text-xl font-bold">Application Details</h3>
                <button onClick={() => setIsViewModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Name:</span> {selectedApp.name}</div>
                    <div><span className="text-gray-500">Email:</span> {selectedApp.email}</div>
                    <div><span className="text-gray-500">Phone:</span> {selectedApp.phone}</div>
                    <div><span className="text-gray-500">Applied for:</span> {selectedApp.jobTitle}</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Qualifications</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Qualification:</span> {selectedApp.qualification || 'Not provided'}</div>
                    <div><span className="text-gray-500">Experience:</span> {selectedApp.experience || 'Not provided'}</div>
                    {selectedApp.portfolio && (
                      <div>
                        <span className="text-gray-500">Portfolio:</span> 
                        {isValidUrl(selectedApp.portfolio) ? (
                          <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-600 ml-1">View</a>
                        ) : (
                          <span className="text-gray-700 ml-1">{selectedApp.portfolio}</span>
                        )}
                      </div>
                    )}
                    {/* 🔥 FIXED: Resume in Modal */}
                    {selectedApp.resumeUrl && (
                      <div>
                        <span className="text-gray-500">Resume:</span> 
                        {isValidUrl(selectedApp.resumeUrl) ? (
                          <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 flex items-center gap-1 ml-1">
                            Download <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-green-600 ml-1 font-medium">{selectedApp.resumeUrl}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedApp.message && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Message from Candidate</h4>
                    <p className="text-sm">{selectedApp.message}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Update Status</h4>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {['pending', 'reviewed', 'shortlisted', 'rejected'].map(status => (
                      <button key={status} onClick={() => handleUpdateStatus(selectedApp.id!, status as any)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${selectedApp.status === status ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {status}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={adminNotes} 
                    onChange={(e) => setAdminNotes(e.target.value)} 
                    placeholder="Add private notes about this candidate..." 
                    rows={2} 
                    className="w-full px-3 py-2 border rounded-lg text-sm" 
                  />
                  <button onClick={() => handleUpdateStatus(selectedApp.id!, selectedApp.status)} className="mt-2 px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm">
                    Save Notes
                  </button>
                </div>
                
                <div className="flex gap-3 pt-3 border-t">
                  <button onClick={() => window.open(`mailto:${selectedApp.email}`)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> Send Email
                  </button>
                  <button onClick={() => window.open(`https://wa.me/91${selectedApp.phone}`)} className="flex-1 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                  <button onClick={() => handleDelete(selectedApp.id!)} className="py-2 px-4 bg-red-600 text-white rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}