// src/counselor/CounselorLeads.tsx

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, Phone, MessageCircle, Eye,
  Clock, CheckCircle, AlertCircle, ChevronRight,
  Calendar, Star, TrendingUp, UserCheck, UserX
} from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { getCounselorById } from '../lib/counselorService';
import { getAssignmentsByCounselor, LeadAssignment } from '../lib/leadAssignmentService';
import { MobileBottomNav } from './components/MobileBottomNav';

export function CounselorLeads() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [assignments, setAssignments] = useState<LeadAssignment[]>([]);
  const [leadsData, setLeadsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [counselorId, setCounselorId] = useState<string>('');

  useEffect(() => {
    fetchCounselorAndLeads();
  }, [user, userData]);

  const fetchCounselorAndLeads = async () => {
    setLoading(true);
    try {
      // 🔥 FIX: First try to get counselor ID from userData
      let cId = null;
      
      // Method 1: Check if userData has counselor id
      if (userData && userData.id) {
        cId = userData.id;
        console.log('Found counselor ID from userData:', cId);
      }
      
      // Method 2: If not, find by authId or email
      if (!cId && user) {
        const counselorsRef = collection(db, 'counselors');
        
        // Try by authId first
        let q = query(counselorsRef, where('authId', '==', user.uid));
        let snapshot = await getDocs(q);
        
        // If not found, try by email
        if (snapshot.empty && user.email) {
          q = query(counselorsRef, where('email', '==', user.email));
          snapshot = await getDocs(q);
        }
        
        if (!snapshot.empty) {
          const counselorDoc = snapshot.docs[0];
          cId = counselorDoc.id;
          console.log('Found counselor ID from Firestore:', cId);
        }
      }
      
      // Method 3: Last resort - check localStorage
      if (!cId) {
        const storedEmail = localStorage.getItem('counselor_email');
        if (storedEmail) {
          const counselorsRef = collection(db, 'counselors');
          const q = query(counselorsRef, where('email', '==', storedEmail));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            cId = snapshot.docs[0].id;
            console.log('Found counselor ID from localStorage email:', cId);
          }
        }
      }
      
      if (!cId) {
        console.error('No counselor ID found - user:', user, 'userData:', userData);
        setLoading(false);
        return;
      }
      
      setCounselorId(cId);
      
      // Get assignments
      const assignmentsData = await getAssignmentsByCounselor(cId);
      setAssignments(assignmentsData);
      
      // Get lead details for each assignment
      const leads = [];
      for (const assignment of assignmentsData) {
        const leadRef = doc(db, 'inquiries', assignment.leadId);
        const leadSnap = await getDoc(leadRef);
        if (leadSnap.exists()) {
          leads.push({
            id: leadSnap.id,
            ...leadSnap.data(),
            assignmentStatus: assignment.status,
            assignmentId: assignment.id,
            followUpDate: assignment.followUpDate,
            notes: assignment.notes
          });
        }
      }
      setLeadsData(leads);
      
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      contacted: 'bg-blue-100 text-blue-700',
      interested: 'bg-purple-100 text-purple-700',
      converted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'contacted': return <Phone className="w-3 h-3" />;
      case 'interested': return <Star className="w-3 h-3" />;
      case 'converted': return <CheckCircle className="w-3 h-3" />;
      case 'rejected': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:+91${phone}`, '_blank');
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const message = `👋 Hello ${name}! This is from Dreamz College. I'm here to help you with your admission process. Let me know if you have any questions!`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredLeads = leadsData.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone?.includes(searchTerm) ||
                          lead.course?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : lead.assignmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leadsData.length,
    pending: leadsData.filter(l => l.assignmentStatus === 'pending').length,
    contacted: leadsData.filter(l => l.assignmentStatus === 'contacted').length,
    interested: leadsData.filter(l => l.assignmentStatus === 'interested').length,
    converted: leadsData.filter(l => l.assignmentStatus === 'converted').length
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-6 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">My Leads</h1>
            <p className="text-xs opacity-80 mt-1">{stats.total} assigned leads</p>
          </div>
          <button onClick={() => fetchCounselorAndLeads()} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center"><p className="text-xl font-bold text-gray-900">{stats.total}</p><p className="text-[10px] text-gray-500">Total</p></div>
            <div className="text-center"><p className="text-xl font-bold text-yellow-600">{stats.pending}</p><p className="text-[10px] text-gray-500">Pending</p></div>
            <div className="text-center"><p className="text-xl font-bold text-blue-600">{stats.contacted}</p><p className="text-[10px] text-gray-500">Contacted</p></div>
            <div className="text-center"><p className="text-xl font-bold text-purple-600">{stats.interested}</p><p className="text-[10px] text-gray-500">Interested</p></div>
            <div className="text-center"><p className="text-xl font-bold text-green-600">{stats.converted}</p><p className="text-[10px] text-gray-500">Converted</p></div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, phone or course..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="converted">Converted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No leads found</p>
            <p className="text-xs text-gray-400 mt-1">New leads will appear here when assigned</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <motion.div key={lead.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{lead.name || 'N/A'}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadge(lead.assignmentStatus)}`}>
                        {getStatusIcon(lead.assignmentStatus)} {lead.assignmentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{lead.course || 'Course not selected'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{lead.collegeName || 'College not selected'}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>10th: {lead.tenthPercentage || 'N/A'}%</span>
                      <span>12th: {lead.twelfthPercentage || 'N/A'}%</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/counselor/lead/${lead.id}`)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => handleCall(lead.phone)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-xl text-sm font-medium">
                    <Phone className="w-4 h-4" /> Call
                  </button>
                  <button onClick={() => handleWhatsApp(lead.phone, lead.name)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-xl text-sm font-medium">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                </div>
                {lead.followUpDate && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 bg-orange-50 rounded-lg px-2 py-1">
                    <Calendar className="w-3 h-3" />
                    <span>Follow-up: {new Date(lead.followUpDate).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <MobileBottomNav activeTab="leads" />
    </div>
  );
}