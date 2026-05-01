// src/lib/leadAssignmentService.ts

import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { updateCounselorStats } from './counselorService';

export interface LeadAssignment {
  id?: string;
  leadId: string;
  counselorId: string;
  counselorName: string;
  assignedBy: string;
  assignedAt: string;
  status: 'pending' | 'contacted' | 'interested' | 'converted' | 'rejected' | 'transferred';
  followUpDate?: string;
  notes: {
    id: string;
    text: string;
    createdAt: string;
    createdBy: string;
    type: 'call' | 'whatsapp' | 'email' | 'note';
  }[];
  callHistory: {
    id: string;
    time: string;
    duration: string;
    status: 'connected' | 'not_answered' | 'busy' | 'callback';
    notes?: string;
  }[];
  statusHistory: {
    status: string;
    changedAt: string;
    changedBy: string;
  }[];
  updatedAt?: string;
}

// ========== LEAD ASSIGNMENT CRUD ==========

// Assign lead to counselor
export const assignLeadToCounselor = async (assignmentData: Omit<LeadAssignment, 'id' | 'assignedAt' | 'statusHistory' | 'notes' | 'callHistory' | 'updatedAt'>): Promise<string> => {
  try {
    const assignmentsRef = collection(db, 'lead_assignments');
    
    // Check if already assigned
    const existingQuery = query(
      assignmentsRef,
      where('leadId', '==', assignmentData.leadId),
      where('status', '!=', 'rejected')
    );
    const existing = await getDocs(existingQuery);
    if (!existing.empty) {
      throw new Error('Lead already assigned to a counselor');
    }
    
    const newAssignment = {
      ...assignmentData,
      assignedAt: new Date().toISOString(),
      status: 'pending' as const,
      statusHistory: [
        {
          status: 'pending',
          changedAt: new Date().toISOString(),
          changedBy: assignmentData.assignedBy
        }
      ],
      notes: [],
      callHistory: [],
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(assignmentsRef, newAssignment);
    
    // Update counselor stats
    await updateCounselorStats(assignmentData.counselorId);
    
    // Update lead status in inquiries collection
    const leadRef = doc(db, 'inquiries', assignmentData.leadId);
    await updateDoc(leadRef, {
      assignedTo: assignmentData.counselorId,
      assignedToName: assignmentData.counselorName,
      assignedAt: new Date().toISOString(),
      status: 'assigned'
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error assigning lead:', error);
    throw error;
  }
};

// Get assignments by counselor
export const getAssignmentsByCounselor = async (counselorId: string): Promise<LeadAssignment[]> => {
  try {
    const assignmentsRef = collection(db, 'lead_assignments');
    const q = query(
      assignmentsRef,
      where('counselorId', '==', counselorId),
      orderBy('assignedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeadAssignment));
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }
};

// Get assignments by lead
export const getAssignmentsByLead = async (leadId: string): Promise<LeadAssignment | null> => {
  try {
    const assignmentsRef = collection(db, 'lead_assignments');
    const q = query(assignmentsRef, where('leadId', '==', leadId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as LeadAssignment;
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return null;
  }
};

// Update assignment status
export const updateAssignmentStatus = async (assignmentId: string, status: LeadAssignment['status'], changedBy: string): Promise<void> => {
  try {
    const assignmentRef = doc(db, 'lead_assignments', assignmentId);
    const assignmentDoc = await getDoc(assignmentRef);
    const currentData = assignmentDoc.data();
    
    await updateDoc(assignmentRef, {
      status,
      statusHistory: [
        ...(currentData?.statusHistory || []),
        {
          status,
          changedAt: new Date().toISOString(),
          changedBy
        }
      ],
      updatedAt: new Date().toISOString()
    });
    
    // Update counselor stats
    if (currentData) {
      await updateCounselorStats(currentData.counselorId);
    }
  } catch (error) {
    console.error('Error updating assignment status:', error);
    throw error;
  }
};

// Add note to assignment
export const addNote = async (assignmentId: string, note: { text: string; createdBy: string; type: 'call' | 'whatsapp' | 'email' | 'note' }): Promise<void> => {
  try {
    const assignmentRef = doc(db, 'lead_assignments', assignmentId);
    const assignmentDoc = await getDoc(assignmentRef);
    const currentData = assignmentDoc.data();
    
    const newNote = {
      id: Date.now().toString(),
      text: note.text,
      createdAt: new Date().toISOString(),
      createdBy: note.createdBy,
      type: note.type
    };
    
    await updateDoc(assignmentRef, {
      notes: [...(currentData?.notes || []), newNote],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

// Add call to history
export const addCallHistory = async (
  assignmentId: string,
  callData: { duration: string; status: 'connected' | 'not_answered' | 'busy' | 'callback'; notes?: string }
): Promise<void> => {
  try {
    const assignmentRef = doc(db, 'lead_assignments', assignmentId);
    const assignmentDoc = await getDoc(assignmentRef);
    const currentData = assignmentDoc.data();
    
    const newCall = {
      id: Date.now().toString(),
      time: new Date().toISOString(),
      duration: callData.duration,
      status: callData.status,
      notes: callData.notes
    };
    
    await updateDoc(assignmentRef, {
      callHistory: [...(currentData?.callHistory || []), newCall],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding call history:', error);
    throw error;
  }
};

// Set follow-up date
export const setFollowUpDate = async (assignmentId: string, followUpDate: string): Promise<void> => {
  try {
    const assignmentRef = doc(db, 'lead_assignments', assignmentId);
    await updateDoc(assignmentRef, {
      followUpDate,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error setting follow-up date:', error);
    throw error;
  }
};

// Reassign lead to another counselor
export const reassignLead = async (assignmentId: string, newCounselorId: string, newCounselorName: string, reassignedBy: string): Promise<void> => {
  try {
    const assignmentRef = doc(db, 'lead_assignments', assignmentId);
    const assignmentDoc = await getDoc(assignmentRef);
    const currentData = assignmentDoc.data();
    
    await updateDoc(assignmentRef, {
      counselorId: newCounselorId,
      counselorName: newCounselorName,
      status: 'transferred',
      statusHistory: [
        ...(currentData?.statusHistory || []),
        {
          status: 'transferred',
          changedAt: new Date().toISOString(),
          changedBy: reassignedBy,
          note: `Reassigned from ${currentData?.counselorName}`
        }
      ],
      updatedAt: new Date().toISOString()
    });
    
    // Update old counselor stats
    if (currentData) {
      await updateCounselorStats(currentData.counselorId);
    }
    
    // Update new counselor stats
    await updateCounselorStats(newCounselorId);
    
    // Update lead in inquiries
    const leadRef = doc(db, 'inquiries', currentData?.leadId);
    await updateDoc(leadRef, {
      assignedTo: newCounselorId,
      assignedToName: newCounselorName,
      reassignedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error reassigning lead:', error);
    throw error;
  }
};

// Get all assigned leads (for admin)
export const getAllAssignments = async (): Promise<LeadAssignment[]> => {
  try {
    const assignmentsRef = collection(db, 'lead_assignments');
    const q = query(assignmentsRef, orderBy('assignedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeadAssignment));
  } catch (error) {
    console.error('Error fetching all assignments:', error);
    return [];
  }
};

// Get pending follow-ups for today
export const getTodayFollowUps = async (counselorId: string): Promise<LeadAssignment[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const assignmentsRef = collection(db, 'lead_assignments');
    const q = query(
      assignmentsRef,
      where('counselorId', '==', counselorId),
      where('followUpDate', '==', today),
      where('status', 'not-in', ['converted', 'rejected'])
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeadAssignment));
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    return [];
  }
};

// Unassign lead (remove counselor)
export const unassignLead = async (assignmentId: string): Promise<void> => {
  try {
    const assignmentRef = doc(db, 'lead_assignments', assignmentId);
    const assignmentDoc = await getDoc(assignmentRef);
    const currentData = assignmentDoc.data();
    
    await updateDoc(assignmentRef, {
      status: 'unassigned',
      updatedAt: new Date().toISOString()
    });
    
    if (currentData) {
      await updateCounselorStats(currentData.counselorId);
    }
  } catch (error) {
    console.error('Error unassigning lead:', error);
    throw error;
  }
};