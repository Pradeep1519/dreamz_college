// src/counselor/CounselorLeadDetail.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Phone, MessageCircle, Calendar, Clock, CheckCircle,
  User, Mail, GraduationCap, Building, BookOpen, Award,
  PhoneCall, Send, Plus, X, AlertCircle, Star, TrendingUp,
  ChevronDown, ChevronUp, Edit2, Save
} from 'lucide-react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { getCounselorById } from '../lib/counselorService';
import { 
  getAssignmentsByLead, updateAssignmentStatus, addNote, addCallHistory, setFollowUpDate
} from '../lib/leadAssignmentService';
import { MobileBottomNav } from './components/MobileBottomNav';

export function CounselorLeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newFollowUp, setNewFollowUp] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [counselorName, setCounselorName] = useState('');

  useEffect(() => {
    fetchData();
  }, [leadId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get lead details
      const leadRef = doc(db, 'inquiries', leadId!);
      const leadSnap = await getDoc(leadRef);
      if (leadSnap.exists()) {
        setLead({ id: leadSnap.id, ...leadSnap.data() });
      }

      // Get assignment
      const assignmentData = await getAssignmentsByLead(leadId!);
      if (assignmentData) {
        setAssignment(assignmentData);
      }

      // Get counselor name
      if (user?.email) {
        const counselorsRef = collection(db, 'counselors');
        const q = query(counselorsRef, where('email', '==', user.email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setCounselorName(snapshot.docs[0].data().name);
        }
      }
    } catch (error) {
      console.error('Error fetching lead details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    window.open(`tel:+91${lead?.phone}`, '_blank');
  };

  const handleWhatsApp = () => {
    const message = `👋 Hello ${lead?.name}! This is ${counselorName} from Dreamz College. I'm here to help you with your admission process. Let me know if you have any questions!`;
    window.open(`https://wa.me/91${lead?.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleUpdateStatus = async (status: string) => {
    setStatusUpdating(true);
    try {
      await updateAssignmentStatus(assignment.id, status, counselorName);
      showToast(`Status updated to ${status}`, 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to update status', 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await addNote(assignment.id, {
        text: newNote,
        createdBy: counselorName,
        type: 'note'
      });
      setNewNote('');
      showToast('Note added', 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to add note', 'error');
    }
  };

  const handleAddCallLog = async (status: string) => {
    try {
      await addCallHistory(assignment.id, {
        duration: '5min',
        status: status as any,
        notes: `Call made by ${counselorName}`
      });
      showToast('Call logged', 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to log call', 'error');
    }
  };

  const handleSetFollowUp = async () => {
    if (!newFollowUp) return;
    try {
      await setFollowUpDate(assignment.id, newFollowUp);
      showToast('Follow-up scheduled', 'success');
      setNewFollowUp('');
      fetchData();
    } catch (error) {
      showToast('Failed to schedule follow-up', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    alert(message);
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/counselor/leads')} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold">{lead?.name || 'Lead Details'}</h1>
            <p className="text-xs opacity-80">ID: {lead?.id?.slice(-8)}</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl m-4 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{lead?.name}</h2>
            <p className="text-xs text-gray-500">{lead?.email}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">📞 {lead?.phone}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCall} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Call Now
          </button>
          <button onClick={handleWhatsApp} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
        </div>
      </div>

      {/* Course & College Info */}
      <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-purple-600" />
          Academic Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Course:</span>
            <span className="font-medium">{lead?.course || 'Not selected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">College:</span>
            <span className="font-medium">{lead?.collegeName || 'Not selected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">10th Percentage:</span>
            <span>{lead?.tenthPercentage || 'N/A'}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">12th Percentage:</span>
            <span>{lead?.twelfthPercentage || 'N/A'}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Counseling Mode:</span>
            <span className="capitalize">{lead?.counselingMode || 'Not selected'}</span>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {['pending', 'contacted', 'interested', 'converted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => handleUpdateStatus(status)}
              disabled={statusUpdating}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                assignment?.status === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="w-full flex justify-between items-center"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-purple-600" />
            Notes & History
          </h3>
          {showNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showNotes && (
          <div className="mt-3 space-y-3">
            {/* Add Note */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <button onClick={handleAddNote} className="px-3 py-2 bg-purple-600 text-white rounded-lg">
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {assignment?.notes?.map((note: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-2 text-sm">
                  <p className="text-gray-700">{note.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {(!assignment?.notes || assignment.notes.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-4">No notes yet</p>
              )}
            </div>

            {/* Call History */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-green-600" />
                Call History
              </h4>
              <div className="flex gap-2 mb-3">
                <button onClick={() => handleAddCallLog('connected')} className="flex-1 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs">Connected</button>
                <button onClick={() => handleAddCallLog('not_answered')} className="flex-1 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs">Not Answered</button>
                <button onClick={() => handleAddCallLog('busy')} className="flex-1 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs">Busy</button>
                <button onClick={() => handleAddCallLog('callback')} className="flex-1 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs">Callback</button>
              </div>
              <div className="space-y-2">
                {assignment?.callHistory?.slice().reverse().map((call: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span>{new Date(call.time).toLocaleTimeString()}</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      call.status === 'connected' ? 'bg-green-100 text-green-700' :
                      call.status === 'not_answered' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{call.status}</span>
                    <span>{call.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Set Follow-up */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                Schedule Follow-up
              </h4>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={newFollowUp}
                  onChange={(e) => setNewFollowUp(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <button onClick={handleSetFollowUp} className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm">
                  Set
                </button>
              </div>
              {assignment?.followUpDate && (
                <p className="text-xs text-orange-600 mt-2">
                  Next follow-up: {new Date(assignment.followUpDate).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lead Score */}
      <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          Lead Score
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(((lead?.tenthPercentage || 0) + (lead?.twelfthPercentage || 0)) / 2, 100)}%` }}
            />
          </div>
          <span className="text-sm font-bold">{Math.round(((lead?.tenthPercentage || 0) + (lead?.twelfthPercentage || 0)) / 2)}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Based on academic performance</p>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab="leads" />
    </div>
  );
}