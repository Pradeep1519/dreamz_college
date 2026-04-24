// src/admin/components/LeadManagement.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, User, Phone, Mail, MessageCircle, Calendar, 
  Search, Filter, Download, RefreshCw, Eye,
  CheckCircle, XCircle, Clock, AlertCircle,
  Star, UserPlus, MessageSquare, Share2,
  ThumbsUp, TrendingUp, Award, Target, School, GraduationCap,
  Building, BookOpen
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';

interface Inquiry {
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

export function LeadManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const inquiriesRef = collection(db, 'inquiries');
      const q = query(inquiriesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const inquiriesList: Inquiry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        inquiriesList.push({
          id: doc.id,
          userId: data.userId,
          name: data.name || 'N/A',
          email: data.email || 'N/A',
          phone: data.phone || data.phoneNumber || 'N/A',
          collegeId: data.collegeId,
          collegeName: data.collegeName || data.college || 'N/A',
          course: data.course || 'N/A',
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
      setInquiries(inquiriesList);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      showToast('Failed to fetch applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    setUpdatingStatus(inquiryId);
    try {
      const inquiryRef = doc(db, 'inquiries', inquiryId);
      await updateDoc(inquiryRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      showToast(`Application marked as ${newStatus}`, 'success');
      fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Course', '10th Board', '10th %', '10th Year', '12th Board', '12th %', '12th Year', 'Status', 'Applied On', 'Message'];
    const csvData = filteredInquiries.map(inq => [
      inq.name,
      inq.email,
      inq.phone,
      inq.collegeName,
      inq.course,
      inq.tenthBoard,
      inq.tenthPercentage,
      inq.tenthPassingYear,
      inq.twelfthBoard,
      inq.twelfthPercentage,
      inq.twelfthPassingYear,
      inq.status,
      new Date(inq.createdAt).toLocaleDateString(),
      inq.message
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export complete', 'success');
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inq.phone.includes(searchTerm) ||
                          inq.collegeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      rejected: <XCircle className="w-3 h-3" />
    };
    return icons[status] || icons.pending;
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    reviewed: inquiries.filter(i => i.status === 'reviewed').length,
    accepted: inquiries.filter(i => i.status === 'accepted').length,
    rejected: inquiries.filter(i => i.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Student Applications</h2>
          <p className="text-sm text-gray-500">Manage all student applications</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={fetchInquiries}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
          <p className="text-xs text-gray-500">Reviewed</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
          <p className="text-xs text-gray-500">Accepted</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-xs text-gray-500">Rejected</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">College & Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">10th/12th</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Applied On</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Loading applications...</p>
                   </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {inquiry.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{inquiry.name}</p>
                          <p className="text-xs text-gray-500">ID: {inquiry.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          {inquiry.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {inquiry.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{inquiry.course}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {inquiry.collegeName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <School className="w-3 h-3 text-gray-400" />
                          <span>{inquiry.tenthBoard} | {inquiry.tenthPercentage}% | {inquiry.tenthPassingYear}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-gray-400" />
                          <span>{inquiry.twelfthBoard} | {inquiry.twelfthPercentage}% | {inquiry.twelfthPassingYear}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                        disabled={updatingStatus === inquiry.id}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-purple-500 ${getStatusColor(inquiry.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-sm">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setIsViewModalOpen(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {filteredInquiries.length} of {inquiries.length} applications</p>
        </div>
      </div>

      {/* View Application Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-5">
                {/* Student Info */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Student Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedInquiry.name}</span></div>
                    <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedInquiry.email}</span></div>
                    <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedInquiry.phone}</span></div>
                    <div><span className="text-gray-500">Application ID:</span> <span className="font-mono">#{selectedInquiry.id.slice(-8)}</span></div>
                  </div>
                </div>

                {/* College & Course */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" /> College & Course
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">College:</span> <span className="font-medium">{selectedInquiry.collegeName}</span></div>
                    <div><span className="text-gray-500">Course:</span> <span className="font-medium">{selectedInquiry.course}</span></div>
                  </div>
                </div>

                {/* Academic Details */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <School className="w-4 h-4" /> Academic Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">10th Details</p>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-gray-500">Board:</span> {selectedInquiry.tenthBoard}</div>
                        <div><span className="text-gray-500">Percentage:</span> {selectedInquiry.tenthPercentage}%</div>
                        <div><span className="text-gray-500">Passing Year:</span> {selectedInquiry.tenthPassingYear}</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">12th Details</p>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-gray-500">Board:</span> {selectedInquiry.twelfthBoard}</div>
                        <div><span className="text-gray-500">Percentage:</span> {selectedInquiry.twelfthPercentage}%</div>
                        <div><span className="text-gray-500">Passing Year:</span> {selectedInquiry.twelfthPassingYear}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message & Status */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                      <select
                        value={selectedInquiry.status}
                        onChange={(e) => {
                          updateInquiryStatus(selectedInquiry.id, e.target.value);
                          setSelectedInquiry({ ...selectedInquiry, status: e.target.value });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-purple-500 ${getStatusColor(selectedInquiry.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Applied On</p>
                      <p className="text-sm text-gray-600">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedInquiry.message && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Student Message</p>
                      <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">{selectedInquiry.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => window.open(`https://wa.me/${selectedInquiry.phone}`, '_blank')}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => window.open(`mailto:${selectedInquiry.email}`)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
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