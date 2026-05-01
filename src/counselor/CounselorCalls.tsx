// src/counselor/CounselorCalls.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, PhoneCall, PhoneMissed, Clock, Calendar, Search,
  CheckCircle, XCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { MobileBottomNav } from './components/MobileBottomNav';

export function CounselorCalls() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'today' | 'missed'>('all');

  useEffect(() => {
    fetchCallHistory();
  }, [user]);

  const fetchCallHistory = async () => {
    setLoading(true);
    try {
      // Get counselor ID
      const counselorsRef = collection(db, 'counselors');
      const q = query(counselorsRef, where('email', '==', user?.email));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const counselorId = snapshot.docs[0].id;
        
        // Get all assignments
        const assignmentsRef = collection(db, 'lead_assignments');
        const assignmentsQuery = query(assignmentsRef, where('counselorId', '==', counselorId));
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        
        const allCalls: any[] = [];
        for (const assignmentDoc of assignmentsSnapshot.docs) {
          const data = assignmentDoc.data();
          if (data.callHistory && data.callHistory.length > 0) {
            data.callHistory.forEach((call: any) => {
              allCalls.push({
                ...call,
                leadId: assignmentDoc.id,
                leadName: 'Lead',
                assignmentId: assignmentDoc.id
              });
            });
          }
        }
        
        // Sort by time descending
        allCalls.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setCalls(allCalls);
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCallIcon = (status: string) => {
    switch(status) {
      case 'connected': return <PhoneCall className="w-4 h-4 text-green-600" />;
      case 'not_answered': return <PhoneMissed className="w-4 h-4 text-yellow-600" />;
      case 'busy': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Phone className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'connected': return 'Connected';
      case 'not_answered': return 'Not Answered';
      case 'busy': return 'Busy';
      default: return status;
    }
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.leadName?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      const callDate = new Date(call.time).toISOString().split('T')[0];
      return matchesSearch && callDate === today;
    }
    if (filter === 'missed') {
      return matchesSearch && (call.status === 'not_answered' || call.status === 'busy');
    }
    return matchesSearch;
  });

  const stats = {
    total: calls.length,
    today: calls.filter(c => new Date(c.time).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length,
    connected: calls.filter(c => c.status === 'connected').length,
    missed: calls.filter(c => c.status === 'not_answered' || c.status === 'busy').length
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-6 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <h1 className="text-xl font-bold">Call History</h1>
        <p className="text-xs opacity-80 mt-1">Track your call activities</p>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-[10px] text-gray-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{stats.today}</p>
              <p className="text-[10px] text-gray-500">Today</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">{stats.connected}</p>
              <p className="text-[10px] text-gray-500">Connected</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">{stats.missed}</p>
              <p className="text-[10px] text-gray-500">Missed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 mt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search calls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </div>

      {/* Calls List */}
      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No call history found</p>
            <p className="text-xs text-gray-400 mt-1">Your call logs will appear here</p>
          </div>
        ) : (
          filteredCalls.map((call, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {getCallIcon(call.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Call with Lead</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{call.duration} • {getStatusText(call.status)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{new Date(call.time).toLocaleTimeString()}</p>
                  <p className="text-[10px] text-gray-400">{new Date(call.time).toLocaleDateString()}</p>
                </div>
              </div>
              {call.notes && (
                <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">{call.notes}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab="calls" />
    </div>
  );
}