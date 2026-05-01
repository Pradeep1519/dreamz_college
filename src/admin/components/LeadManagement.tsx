// src/admin/components/LeadManagement.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, User, Phone, Mail, MessageCircle, Calendar, 
  Search, Filter, Download, RefreshCw, Eye,
  CheckCircle, XCircle, Clock, AlertCircle,
  Star, UserPlus, MessageSquare, Share2,
  ThumbsUp, TrendingUp, Award, Target, School, GraduationCap,
  Building, BookOpen, Gift, Zap, Shield, Monitor, AlertTriangle,
  Trash2, UserCheck, UserX, Plus, X, ChevronDown
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where, addDoc } from 'firebase/firestore';
import { updateCounselorStats } from '../../lib/counselorService';

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
  hearAbout?: string;
  counselingMode?: string;
  message: string;
  status: string;
  createdAt: string;
  applicationType: string;
  offerClaimed?: boolean;
  offerName?: string;
  discountAmount?: number;
  originalFee?: number;
  appliedFee?: number;
  scholarshipEligible?: boolean;
  scholarshipAmount?: number;
  scholarshipName?: string;
  assignedTo?: string;
  assignedToName?: string;
  followUpDate?: string;
  notes?: any[];
  callHistory?: any[];
}

interface Counselor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  isActive: boolean;
}

export function LeadManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [offerFilter, setOfferFilter] = useState<string>('all');
  const [counselorFilter, setCounselorFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselorId, setSelectedCounselorId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchInquiries();
    fetchCounselors();
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
          hearAbout: data.hearAbout || 'N/A',
          counselingMode: data.counselingMode || 'N/A',
          message: data.message || '',
          status: data.status || 'pending',
          createdAt: data.createdAt,
          applicationType: data.applicationType || 'basic',
          offerClaimed: data.offerClaimed || false,
          offerName: data.offerName,
          discountAmount: data.discountAmount,
          originalFee: data.originalFee,
          appliedFee: data.appliedFee,
          scholarshipEligible: data.scholarshipEligible || false,
          scholarshipAmount: data.scholarshipAmount,
          scholarshipName: data.scholarshipName,
          assignedTo: data.assignedTo,
          assignedToName: data.assignedToName,
          followUpDate: data.followUpDate
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

  const fetchCounselors = async () => {
    try {
      const counselorsRef = collection(db, 'counselors');
      const q = query(counselorsRef, where('isActive', '==', true));
      const snapshot = await getDocs(q);
      const counselorsList: Counselor[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        counselorsList.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          specialization: data.specialization || [],
          isActive: data.isActive
        });
      });
      setCounselors(counselorsList);
    } catch (error) {
      console.error('Error fetching counselors:', error);
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

  const handleAssignLead = async () => {
    if (!selectedLeadId || !selectedCounselorId) {
      showToast('Please select a counselor', 'error');
      return;
    }

    setAssigning(true);
    try {
      const lead = inquiries.find(i => i.id === selectedLeadId);
      const counselor = counselors.find(c => c.id === selectedCounselorId);
      
      if (!lead || !counselor) {
        showToast('Lead or counselor not found', 'error');
        return;
      }

      // ✅ Create lead_assignments collection document
      const assignmentsRef = collection(db, 'lead_assignments');
      const newAssignment = {
        leadId: selectedLeadId,
        counselorId: counselor.id,
        counselorName: counselor.name,
        assignedBy: 'admin',
        assignedAt: new Date().toISOString(),
        status: 'pending',
        statusHistory: [{
          status: 'pending',
          changedAt: new Date().toISOString(),
          changedBy: 'admin'
        }],
        notes: [],
        callHistory: [],
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(assignmentsRef, newAssignment);
      
      // ✅ Update inquiry with assignment info
      const inquiryRef = doc(db, 'inquiries', selectedLeadId);
      await updateDoc(inquiryRef, {
        assignedTo: counselor.id,
        assignedToName: counselor.name,
        assignedAt: new Date().toISOString(),
        status: 'assigned'
      });
      
      // ✅ Update counselor stats
      await updateCounselorStats(counselor.id);

      showToast(`Lead assigned to ${counselor.name}`, 'success');
      setIsAssignModalOpen(false);
      setSelectedCounselorId('');
      setSelectedLeadId(null);
      fetchInquiries();
    } catch (error) {
      console.error('Error assigning lead:', error);
      showToast('Failed to assign lead', 'error');
    } finally {
      setAssigning(false);
    }
  };

  // 🔥 FIXED: Complete unassign function that deletes from lead_assignments
  const handleUnassignLead = async (leadId: string, currentCounselorName: string) => {
    if (confirm(`Remove assignment from ${currentCounselorName}?`)) {
      try {
        // ✅ STEP 1: Delete from lead_assignments collection
        const assignmentsRef = collection(db, 'lead_assignments');
        const q = query(assignmentsRef, where('leadId', '==', leadId));
        const snapshot = await getDocs(q);
        
        for (const assignmentDoc of snapshot.docs) {
          await deleteDoc(assignmentDoc.ref);
        }
        
        // ✅ STEP 2: Update inquiry - remove assignment fields
        const inquiryRef = doc(db, 'inquiries', leadId);
        await updateDoc(inquiryRef, {
          assignedTo: null,
          assignedToName: null,
          assignedAt: null,
          status: 'pending'
        });
        
        showToast('Lead unassigned successfully', 'success');
        fetchInquiries();
      } catch (error) {
        console.error('Error unassigning lead:', error);
        showToast('Failed to unassign lead', 'error');
      }
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      try {
        // Also delete from lead_assignments if exists
        const assignmentsRef = collection(db, 'lead_assignments');
        const q = query(assignmentsRef, where('leadId', '==', leadId));
        const snapshot = await getDocs(q);
        for (const assignmentDoc of snapshot.docs) {
          await deleteDoc(assignmentDoc.ref);
        }
        
        await deleteDoc(doc(db, 'inquiries', leadId));
        showToast('Application deleted successfully', 'success');
        fetchInquiries();
      } catch (error) {
        console.error('Error deleting lead:', error);
        showToast('Failed to delete application', 'error');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showToast('Please select applications to delete', 'error');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedIds.length} applications? This action cannot be undone.`)) {
      try {
        for (const id of selectedIds) {
          // Delete from lead_assignments as well
          const assignmentsRef = collection(db, 'lead_assignments');
          const q = query(assignmentsRef, where('leadId', '==', id));
          const snapshot = await getDocs(q);
          for (const assignmentDoc of snapshot.docs) {
            await deleteDoc(assignmentDoc.ref);
          }
          
          await deleteDoc(doc(db, 'inquiries', id));
        }
        showToast(`${selectedIds.length} applications deleted successfully`, 'success');
        setSelectedIds([]);
        setIsBulkDeleteMode(false);
        fetchInquiries();
      } catch (error) {
        console.error('Error bulk deleting:', error);
        showToast('Failed to delete some applications', 'error');
      }
    }
  };

  const toggleSelectLead = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInquiries.map(i => i.id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Course', '10th Board', '10th %', '10th Year', '12th Board', '12th %', '12th Year', 'Heard About', 'Counseling Mode', 'Offer Claimed', 'Offer Name', 'Discount', 'Scholarship', 'Assigned To', 'Status', 'Applied On', 'Message'];
    const csvData = filteredInquiries.map(inq => [
      `"${inq.name}"`, `"${inq.email}"`, `"${inq.phone}"`, `"${inq.collegeName}"`, `"${inq.course}"`,
      `"${inq.tenthBoard}"`, inq.tenthPercentage, `"${inq.tenthPassingYear}"`, `"${inq.twelfthBoard}"`, inq.twelfthPercentage, `"${inq.twelfthPassingYear}"`,
      `"${inq.hearAbout}"`, `"${inq.counselingMode}"`, inq.offerClaimed ? 'Yes' : 'No', `"${inq.offerName || 'N/A'}"`,
      inq.discountAmount ? `₹${inq.discountAmount.toLocaleString()}` : 'N/A',
      inq.scholarshipEligible ? `${inq.scholarshipName} (₹${inq.scholarshipAmount?.toLocaleString()})` : 'No',
      `"${inq.assignedToName || 'Not assigned'}"`,
      inq.status, new Date(inq.createdAt).toLocaleDateString(), `"${inq.message}"`
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
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
                          inq.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inq.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : inq.status === statusFilter;
    const matchesOffer = offerFilter === 'all' ? true : offerFilter === 'claimed' ? inq.offerClaimed : !inq.offerClaimed;
    const matchesCounselor = counselorFilter === 'all' ? true : 
                             counselorFilter === 'assigned' ? inq.assignedTo : 
                             counselorFilter === 'unassigned' ? !inq.assignedTo : 
                             inq.assignedTo === counselorFilter;
    return matchesSearch && matchesStatus && matchesOffer && matchesCounselor;
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

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    reviewed: inquiries.filter(i => i.status === 'reviewed').length,
    accepted: inquiries.filter(i => i.status === 'accepted').length,
    rejected: inquiries.filter(i => i.status === 'rejected').length,
    offerClaimed: inquiries.filter(i => i.offerClaimed).length,
    scholarshipEligible: inquiries.filter(i => i.scholarshipEligible).length,
    assigned: inquiries.filter(i => i.assignedTo).length,
    unassigned: inquiries.filter(i => !i.assignedTo).length
  };

  const getCounselingModeIcon = (mode: string) => {
    switch(mode?.toLowerCase()) {
      case 'online': return <Monitor className="w-3 h-3" />;
      case 'offline': return <Building className="w-3 h-3" />;
      case 'phone': return <Phone className="w-3 h-3" />;
      default: return <MessageCircle className="w-3 h-3" />;
    }
  };

  const getCounselingModeColor = (mode: string) => {
    switch(mode?.toLowerCase()) {
      case 'online': return 'bg-purple-100 text-purple-700';
      case 'offline': return 'bg-blue-100 text-blue-700';
      case 'phone': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const uniqueCounselors = [...new Map(inquiries.filter(i => i.assignedToName).map(i => [i.assignedTo, { id: i.assignedTo, name: i.assignedToName }])).values()];

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
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">📋 Student Applications</h2>
          <p className="text-sm text-gray-500">Manage applications, assign to counselors, track progress</p>
        </div>
        <div className="flex gap-3">
          {isBulkDeleteMode ? (
            <>
              <button onClick={handleBulkDelete} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
                <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.length})
              </button>
              <button onClick={() => { setIsBulkDeleteMode(false); setSelectedIds([]); }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                <X className="w-4 h-4" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsBulkDeleteMode(true)} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200">
                <Trash2 className="w-4 h-4" /> Bulk Delete
              </button>
              <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button onClick={fetchInquiries} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-9 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border text-center"><p className="text-xl font-bold text-gray-900">{stats.total}</p><p className="text-[10px] text-gray-500">Total</p></div>
        <div className="bg-white rounded-xl p-3 shadow-sm border text-center"><p className="text-xl font-bold text-yellow-600">{stats.pending}</p><p className="text-[10px] text-gray-500">Pending</p></div>
        <div className="bg-white rounded-xl p-3 shadow-sm border text-center"><p className="text-xl font-bold text-blue-600">{stats.reviewed}</p><p className="text-[10px] text-gray-500">Reviewed</p></div>
        <div className="bg-white rounded-xl p-3 shadow-sm border text-center"><p className="text-xl font-bold text-green-600">{stats.accepted}</p><p className="text-[10px] text-gray-500">Accepted</p></div>
        <div className="bg-white rounded-xl p-3 shadow-sm border text-center"><p className="text-xl font-bold text-red-600">{stats.rejected}</p><p className="text-[10px] text-gray-500">Rejected</p></div>
        <div className="bg-white rounded-xl p-3 shadow-sm border text-center"><p className="text-xl font-bold text-purple-600">{stats.offerClaimed}</p><p className="text-[10px] text-gray-500">Offers</p></div>
        <div className="bg-white rounded-xl p-3 shadow-sm border text-center"><p className="text-xl font-bold text-orange-600">{stats.scholarshipEligible}</p><p className="text-[10px] text-gray-500">Scholarship</p></div>
        <div className="bg-white rounded-xl p-3 shadow-sm border text-center"><p className="text-xl font-bold text-green-600">{stats.assigned}</p><p className="text-[10px] text-gray-500">Assigned</p></div>
        <div className="bg-white rounded-xl p-3 shadow-sm border text-center"><p className="text-xl font-bold text-gray-400">{stats.unassigned}</p><p className="text-[10px] text-gray-500">Unassigned</p></div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by name, email, phone, college or course..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-3 pt-2">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <select value={offerFilter} onChange={(e) => setOfferFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                <option value="all">All Offers</option>
                <option value="claimed">Offer Claimed</option>
                <option value="not-claimed">No Offer</option>
              </select>
              <select value={counselorFilter} onChange={(e) => setCounselorFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                <option value="all">All Counselors</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
                {uniqueCounselors.map(c => <option key={c.id} value={c.id!}>{c.name}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {isBulkDeleteMode && <th className="px-4 py-3"><input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === filteredInquiries.length && filteredInquiries.length > 0} className="w-4 h-4" /></th>}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">College & Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">10th/12th</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Offer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Counseling</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Applied On</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={isBulkDeleteMode ? 10 : 9} className="px-4 py-12 text-center">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div>
                    <p className="text-sm text-gray-500 mt-2">Loading applications...</p>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={isBulkDeleteMode ? 10 : 9} className="px-4 py-12 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                    {isBulkDeleteMode && (
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedIds.includes(inquiry.id)} onChange={() => toggleSelectLead(inquiry.id)} className="w-4 h-4" />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-xs">{inquiry.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{inquiry.name}</p>
                          <p className="text-xs text-gray-500">{inquiry.email}</p>
                          <p className="text-[10px] text-gray-400">{inquiry.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{inquiry.course}</p>
                      <p className="text-xs text-gray-500">{inquiry.collegeName}</p>
                    </td>
                    <td className="px-4 py-3">
                      {inquiry.assignedToName ? (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><UserCheck className="w-3 h-3" /> {inquiry.assignedToName}</span>
                          <button onClick={() => handleUnassignLead(inquiry.id, inquiry.assignedToName!)} className="text-red-400 hover:text-red-600" title="Unassign"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setSelectedLeadId(inquiry.id); setIsAssignModalOpen(true); }} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition">
                          <UserPlus className="w-3 h-3" /> Assign
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs">10th: {inquiry.tenthPercentage}%<br/>12th: {inquiry.twelfthPercentage}%</div>
                    </td>
                    <td className="px-4 py-3">
                      {inquiry.offerClaimed ? (
                        <div className="flex items-center gap-1"><Gift className="w-3 h-3 text-purple-600" /><span className="text-xs font-medium text-purple-700">{inquiry.offerName || 'Claimed'}</span></div>
                      ) : (
                        <span className="text-xs text-gray-400">No offer</span>
                      )}
                      {inquiry.scholarshipEligible && <div className="mt-1"><span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">🎓 Scholarship</span></div>}
                    </td>
                    <td className="px-4 py-3">
                      {inquiry.counselingMode && inquiry.counselingMode !== 'N/A' ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getCounselingModeColor(inquiry.counselingMode)}`}>
                          {getCounselingModeIcon(inquiry.counselingMode)} {inquiry.counselingMode === 'online' ? 'Online' : inquiry.counselingMode === 'offline' ? 'Offline' : 'Phone'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select value={inquiry.status} onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)} disabled={updatingStatus === inquiry.id} className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-purple-500 ${getStatusColor(inquiry.status)}`}>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setSelectedInquiry(inquiry); setIsViewModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                        {!isBulkDeleteMode && <button onClick={() => handleDeleteLead(inquiry.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-500">Showing {filteredInquiries.length} of {inquiries.length} applications</p>
        </div>
      </div>

      {/* Assign Counselor Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsAssignModalOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Assign to Counselor</h3>
                <button onClick={() => setIsAssignModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Counselor</label>
                  <select value={selectedCounselorId} onChange={(e) => setSelectedCounselorId(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                    <option value="">-- Select Counselor --</option>
                    {counselors.map(c => <option key={c.id} value={c.id}>{c.name} - {c.email}</option>)}
                  </select>
                </div>
                <button onClick={handleAssignLead} disabled={assigning} className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50">
                  {assigning ? 'Assigning...' : 'Assign Lead'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Application Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedInquiry && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsViewModalOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Student Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Name:</span> {selectedInquiry.name}</div>
                    <div><span className="text-gray-500">Email:</span> {selectedInquiry.email}</div>
                    <div><span className="text-gray-500">Phone:</span> {selectedInquiry.phone}</div>
                    <div><span className="text-gray-500">ID:</span> #{selectedInquiry.id.slice(-8)}</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">College & Course</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">College:</span> {selectedInquiry.collegeName}</div>
                    <div><span className="text-gray-500">Course:</span> {selectedInquiry.course}</div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Academic Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-sm font-medium mb-2">10th Details</p><div className="space-y-1 text-sm"><div>Board: {selectedInquiry.tenthBoard}</div><div>Percentage: {selectedInquiry.tenthPercentage}%</div><div>Year: {selectedInquiry.tenthPassingYear}</div></div></div>
                    <div><p className="text-sm font-medium mb-2">12th Details</p><div className="space-y-1 text-sm"><div>Board: {selectedInquiry.twelfthBoard}</div><div>Percentage: {selectedInquiry.twelfthPercentage}%</div><div>Year: {selectedInquiry.twelfthPassingYear}</div></div></div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Offer & Scholarship</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Offer Claimed:</span><span className={selectedInquiry.offerClaimed ? 'text-green-600 font-semibold' : 'text-gray-400'}>{selectedInquiry.offerClaimed ? `Yes (${selectedInquiry.offerName})` : 'No'}</span></div>
                    {selectedInquiry.offerClaimed && (<><div className="flex justify-between"><span>Original Fee:</span><span className="line-through">₹{selectedInquiry.originalFee?.toLocaleString()}</span></div><div className="flex justify-between"><span>Discounted Fee:</span><span className="font-bold text-green-600">₹{selectedInquiry.appliedFee?.toLocaleString()}</span></div><div className="flex justify-between"><span>Saved:</span><span className="text-green-600">₹{selectedInquiry.discountAmount?.toLocaleString()}</span></div></>)}
                    {selectedInquiry.scholarshipEligible && (<div className="flex justify-between mt-2 pt-2 border-t"><span>Scholarship:</span><span className="text-yellow-600 font-semibold">{selectedInquiry.scholarshipName} (₹{selectedInquiry.scholarshipAmount?.toLocaleString()})</span></div>)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span>Heard About:</span> <span className="capitalize">{selectedInquiry.hearAbout}</span></div>
                    <div><span>Counseling Mode:</span> <span className="capitalize">{selectedInquiry.counselingMode}</span></div>
                    <div><span>Assigned To:</span> {selectedInquiry.assignedToName || 'Not assigned'}</div>
                    <div><span>Applied On:</span> {new Date(selectedInquiry.createdAt).toLocaleString()}</div>
                  </div>
                  {selectedInquiry.message && (<div className="mt-3"><p className="text-sm font-medium mb-1">Student Message</p><p className="text-sm bg-white p-3 rounded-lg">{selectedInquiry.message}</p></div>)}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => window.open(`https://wa.me/${selectedInquiry.phone}`, '_blank')} className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</button>
                  <button onClick={() => window.open(`mailto:${selectedInquiry.email}`)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"><Mail className="w-4 h-4" /> Send Email</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}