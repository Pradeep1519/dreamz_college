// src/lib/counselorService.ts

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
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';

export interface Counselor {
  id?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  qualification: string;
  languages: string[];
  dailyTarget: number;
  monthlyTarget: number;
  isActive: boolean;
  profileImage?: string;
  joiningDate: string;
  totalAssignedLeads: number;
  totalConvertedLeads: number;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CounselorPerformance {
  id?: string;
  counselorId: string;
  date: string;
  leadsContacted: number;
  leadsConverted: number;
  callsMade: number;
  avgCallDuration: string;
  achievementRate: number;
  createdAt?: string;
}

// ========== HELPER: Generate Readable ID ==========
const generateReadableId = (email: string, name: string): string => {
  // Take email prefix (before @)
  const emailPrefix = email.split('@')[0].toLowerCase();
  // Remove special characters and spaces from name
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 15);
  // Add timestamp suffix for uniqueness
  const timestamp = Date.now().toString().slice(-6);
  
  // Final ID: name_timestamp OR email_timestamp
  return `${nameSlug || emailPrefix}_${timestamp}`;
};

// ========== COUNSELOR CRUD ==========

// Get all counselors
export const getAllCounselors = async (): Promise<Counselor[]> => {
  try {
    const counselorsRef = collection(db, 'counselors');
    const q = query(counselorsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Counselor));
  } catch (error) {
    console.error('Error fetching counselors:', error);
    return [];
  }
};

// Get active counselors
export const getActiveCounselors = async (): Promise<Counselor[]> => {
  try {
    const counselorsRef = collection(db, 'counselors');
    const q = query(counselorsRef, where('isActive', '==', true), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Counselor));
  } catch (error) {
    console.error('Error fetching active counselors:', error);
    return [];
  }
};

// Get counselor by ID
export const getCounselorById = async (counselorId: string): Promise<Counselor | null> => {
  try {
    const counselorRef = doc(db, 'counselors', counselorId);
    const snapshot = await getDoc(counselorRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Counselor;
    }
    return null;
  } catch (error) {
    console.error('Error fetching counselor:', error);
    return null;
  }
};

// Get counselor by email
export const getCounselorByEmail = async (email: string): Promise<Counselor | null> => {
  try {
    const counselorsRef = collection(db, 'counselors');
    const q = query(counselorsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Counselor;
    }
    return null;
  } catch (error) {
    console.error('Error fetching counselor by email:', error);
    return null;
  }
};

// Create counselor (uses READABLE document ID)
export const createCounselor = async (
  counselorData: Omit<Counselor, 'id' | 'createdAt' | 'updatedAt' | 'totalAssignedLeads' | 'totalConvertedLeads' | 'rating'>, 
  password: string
): Promise<string> => {
  try {
    // 1. Check if counselor already exists in Firestore
    const existingCounselor = await getCounselorByEmail(counselorData.email);
    if (existingCounselor) {
      throw new Error('Counselor with this email already exists');
    }

    // 2. Create Firebase Auth account
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, counselorData.email, password);
    const userId = userCredential.user.uid;

    // 3. Update profile with name
    await updateProfile(userCredential.user, {
      displayName: counselorData.name
    });

    // 4. Generate READABLE ID from counselor name and email
    const readableId = generateReadableId(counselorData.email, counselorData.name);
    
    console.log(`📝 Creating counselor with readable ID: ${readableId}`);

    // 5. Save counselor data to Firestore with CUSTOM DOCUMENT ID
    const newCounselor = {
      ...counselorData,
      authId: userId,
      totalAssignedLeads: 0,
      totalConvertedLeads: 0,
      rating: 0,
      joiningDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // ✅ CRITICAL: Using setDoc with custom ID (not addDoc)
    const counselorDocRef = doc(db, 'counselors', readableId);
    await setDoc(counselorDocRef, newCounselor);
    
    // 🔥 CRITICAL FIX: Sign out the counselor so they don't auto-login to main website
    // This prevents the counselor from automatically logging into the main website
    await signOut(auth);
    
    console.log(`✅ Counselor created successfully with ID: ${readableId}`);
    
    return readableId;
  } catch (error) {
    console.error('Error creating counselor:', error);
    throw error;
  }
};

// Update counselor
export const updateCounselor = async (counselorId: string, counselorData: Partial<Counselor>): Promise<void> => {
  try {
    const counselorRef = doc(db, 'counselors', counselorId);
    await updateDoc(counselorRef, {
      ...counselorData,
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ Counselor ${counselorId} updated`);
  } catch (error) {
    console.error('Error updating counselor:', error);
    throw error;
  }
};

// Delete counselor (soft delete - just deactivate)
export const deleteCounselor = async (counselorId: string): Promise<void> => {
  try {
    const counselorRef = doc(db, 'counselors', counselorId);
    await updateDoc(counselorRef, {
      isActive: false,
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ Counselor ${counselorId} deactivated`);
  } catch (error) {
    console.error('Error deleting counselor:', error);
    throw error;
  }
};

// Permanently delete counselor (hard delete)
export const hardDeleteCounselor = async (counselorId: string): Promise<void> => {
  try {
    const counselorRef = doc(db, 'counselors', counselorId);
    await deleteDoc(counselorRef);
    console.log(`✅ Counselor ${counselorId} permanently deleted`);
  } catch (error) {
    console.error('Error hard deleting counselor:', error);
    throw error;
  }
};

// Toggle counselor status
export const toggleCounselorStatus = async (counselorId: string, isActive: boolean): Promise<void> => {
  try {
    const counselorRef = doc(db, 'counselors', counselorId);
    await updateDoc(counselorRef, {
      isActive,
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ Counselor ${counselorId} status: ${isActive ? 'active' : 'inactive'}`);
  } catch (error) {
    console.error('Error toggling counselor status:', error);
    throw error;
  }
};

// ========== COUNSELOR PERFORMANCE ==========

// Save daily performance
export const saveDailyPerformance = async (performanceData: Omit<CounselorPerformance, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const performanceRef = collection(db, 'counselor_performance');
    const docRef = await addDoc(performanceRef, {
      ...performanceData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving performance:', error);
    throw error;
  }
};

// Get counselor performance by date range
export const getCounselorPerformance = async (counselorId: string, startDate: string, endDate: string): Promise<CounselorPerformance[]> => {
  try {
    const performanceRef = collection(db, 'counselor_performance');
    const q = query(
      performanceRef,
      where('counselorId', '==', counselorId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CounselorPerformance));
  } catch (error) {
    console.error('Error fetching performance:', error);
    return [];
  }
};

// Update counselor stats (total leads, converted)
export const updateCounselorStats = async (counselorId: string): Promise<void> => {
  try {
    const assignmentsRef = collection(db, 'lead_assignments');
    const q = query(assignmentsRef, where('counselorId', '==', counselorId));
    const snapshot = await getDocs(q);
    
    const totalAssigned = snapshot.size;
    const totalConverted = snapshot.docs.filter(doc => doc.data().status === 'converted').length;
    
    const counselorRef = doc(db, 'counselors', counselorId);
    await updateDoc(counselorRef, {
      totalAssignedLeads: totalAssigned,
      totalConvertedLeads: totalConverted,
      rating: totalAssigned > 0 ? Math.round((totalConverted / totalAssigned) * 5) : 0,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`📊 Counselor ${counselorId} stats updated: Assigned=${totalAssigned}, Converted=${totalConverted}`);
  } catch (error) {
    console.error('Error updating counselor stats:', error);
  }
};

// Get counselor dashboard stats
export const getCounselorStats = async (counselorId: string) => {
  try {
    const counselor = await getCounselorById(counselorId);
    if (!counselor) return null;

    const assignmentsRef = collection(db, 'lead_assignments');
    const q = query(assignmentsRef, where('counselorId', '==', counselorId));
    const snapshot = await getDocs(q);
    
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalLeads = leads.length;
    const pendingLeads = leads.filter(l => l.status === 'pending').length;
    const contactedLeads = leads.filter(l => l.status === 'contacted').length;
    const interestedLeads = leads.filter(l => l.status === 'interested').length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    // Get today's performance
    const today = new Date().toISOString().split('T')[0];
    const todayPerfRef = collection(db, 'counselor_performance');
    const todayQuery = query(todayPerfRef, where('counselorId', '==', counselorId), where('date', '==', today));
    const todaySnapshot = await getDocs(todayQuery);
    const todayPerformance = todaySnapshot.docs[0]?.data();
    
    return {
      totalLeads,
      pendingLeads,
      contactedLeads,
      interestedLeads,
      convertedLeads,
      conversionRate,
      todayCalls: todayPerformance?.callsMade || 0,
      todayAchievement: todayPerformance?.achievementRate || 0,
      dailyTarget: counselor.dailyTarget || 10,
      monthlyTarget: counselor.monthlyTarget || 250
    };
  } catch (error) {
    console.error('Error getting counselor stats:', error);
    return null;
  }
};