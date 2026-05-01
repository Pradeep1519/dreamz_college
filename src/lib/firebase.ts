// src/lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, setDoc, getDoc, deleteDoc, orderBy, updateDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAklxGh5b93k50GL9wQnZVK1n4_lRr4Cl4",
  authDomain: "dreamz-college.firebaseapp.com",
  projectId: "dreamz-college",
  storageBucket: "dreamz-college.firebasestorage.app",
  messagingSenderId: "1061753087979",
  appId: "1:1061753087979:web:e15483b7e613e43b1a9bae",
  measurementId: "G-R7D0M124FL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ========== HELPER: Generate Readable ID ==========
const generateReadableId = (name: string, suffix?: string): string => {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')  // Remove special characters
    .replace(/_+/g, '_')          // Replace multiple underscores with single
    .replace(/^_|_$/, '')         // Remove leading/trailing underscores
    .slice(0, 30);                // Limit to 30 characters
  
  const timestamp = suffix || Date.now().toString().slice(-6);
  return `${nameSlug}_${timestamp}`;
};

// ========== USER HELPERS ==========

export const saveUser = async (userId: string, userData: any) => {
  const userRef = doc(db, 'users', userId);
  return await setDoc(userRef, {
    ...userData,
    userId: userId,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const getUserById = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const getUserByPhone = async (phoneNumber: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('phone', '==', phoneNumber));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
};

// ========== INQUIRY/APPLICATION HELPERS ==========

export const hasUserSubmittedForCourse = async (phoneNumber: string, courseSlug: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(inquiriesRef, where('phoneNumber', '==', phoneNumber), where('courseSlug', '==', courseSlug));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const hasUserAppliedForCourse = async (userId: string, collegeId: string, courseName: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(
    inquiriesRef, 
    where('userId', '==', userId),
    where('collegeId', '==', collegeId),
    where('course', '==', courseName)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const getUserAppliedCourses = async (userId: string, collegeId: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(
    inquiriesRef,
    where('userId', '==', userId),
    where('collegeId', '==', collegeId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ FIXED: Save inquiry with READABLE document ID
export const saveInquiry = async (data: any) => {
  const readableId = generateReadableId(data.name || data.phoneNumber || 'user');
  const inquiryRef = doc(db, 'inquiries', readableId);
  await setDoc(inquiryRef, {
    ...data,
    id: readableId,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
  return readableId;
};

// ✅ FIXED: Save full application with READABLE document ID
export const saveFullApplication = async (data: any) => {
  const readableId = generateReadableId(data.name);
  const inquiryRef = doc(db, 'inquiries', readableId);
  await setDoc(inquiryRef, {
    ...data,
    id: readableId,
    createdAt: new Date().toISOString(),
    status: 'pending',
    applicationType: 'full',
    updatedAt: new Date().toISOString()
  });
  console.log(`✅ Application saved with ID: ${readableId}`);
  return readableId;
};

export const getUserInquiries = async (phoneNumber: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(inquiriesRef, where('phoneNumber', '==', phoneNumber));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserApplications = async (userId: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(inquiriesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllInquiries = async () => {
  const inquiriesRef = collection(db, 'inquiries');
  const querySnapshot = await getDocs(inquiriesRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateInquiryStatus = async (inquiryId: string, status: string) => {
  const inquiryRef = doc(db, 'inquiries', inquiryId);
  return await updateDoc(inquiryRef, { status, updatedAt: new Date().toISOString() });
};

export const getApplicationById = async (applicationId: string) => {
  const applicationRef = doc(db, 'inquiries', applicationId);
  const applicationSnap = await getDoc(applicationRef);
  return applicationSnap.exists() ? { id: applicationSnap.id, ...applicationSnap.data() } : null;
};

// ========== DRAFT APPLICATIONS HELPERS ==========

// ✅ FIXED: Save draft with READABLE ID and filter undefined values
export const saveDraftApplication = async (data: any, draftId?: string | null) => {
  // Filter out undefined values
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
  );
  
  const draftsRef = collection(db, 'drafts');
  if (draftId) {
    const draftRef = doc(db, 'drafts', draftId);
    await updateDoc(draftRef, { ...cleanData, updatedAt: new Date().toISOString() });
    return draftId;
  } else {
    const readableId = generateReadableId(data.name || data.userId || 'draft');
    const draftRef = doc(db, 'drafts', readableId);
    await setDoc(draftRef, {
      ...cleanData,
      id: readableId,
      createdAt: new Date().toISOString(),
      status: 'draft'
    });
    return readableId;
  }
};

export const updateDraftToSubmitted = async (draftId: string) => {
  const draftRef = doc(db, 'drafts', draftId);
  await updateDoc(draftRef, {
    status: 'submitted',
    submittedAt: new Date().toISOString()
  });
};

export const getAllDrafts = async () => {
  const draftsRef = collection(db, 'drafts');
  const q = query(draftsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ========== SAVED COLLEGES HELPERS ==========

// ✅ FIXED: Save college with READABLE ID
export const saveCollege = async (userId: string, collegeData: any) => {
  const savedRef = collection(db, 'saved_colleges');
  const q = query(savedRef, where('userId', '==', userId), where('collegeId', '==', collegeData.collegeId));
  const existing = await getDocs(q);
  
  if (!existing.empty) {
    return { success: false, message: 'Already saved' };
  }
  
  const readableId = generateReadableId(collegeData.collegeName, userId.slice(-4));
  const savedRefDoc = doc(db, 'saved_colleges', readableId);
  await setDoc(savedRefDoc, {
    userId: userId,
    collegeId: collegeData.collegeId,
    collegeName: collegeData.collegeName,
    location: collegeData.location,
    rating: collegeData.rating,
    fee: collegeData.fee,
    image: collegeData.image,
    savedAt: new Date().toISOString(),
    id: readableId
  });
  
  return { success: true, message: 'College saved successfully', id: readableId };
};

export const removeSavedCollege = async (savedId: string) => {
  await deleteDoc(doc(db, 'saved_colleges', savedId));
  return { success: true };
};

export const getSavedColleges = async (userId: string) => {
  const savedRef = collection(db, 'saved_colleges');
  const q = query(savedRef, where('userId', '==', userId), orderBy('savedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const isCollegeSaved = async (userId: string, collegeId: string) => {
  const savedRef = collection(db, 'saved_colleges');
  const q = query(savedRef, where('userId', '==', userId), where('collegeId', '==', collegeId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// ========== COUNSELOR HELPERS ==========

// Check if user is a counselor
export const isCounselor = async (userId: string): Promise<boolean> => {
  try {
    const counselorsRef = collection(db, 'counselors');
    const q = query(counselorsRef, where('authId', '==', userId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking counselor status:', error);
    return false;
  }
};

// Get counselor by auth ID
export const getCounselorByAuthId = async (authId: string) => {
  try {
    const counselorsRef = collection(db, 'counselors');
    const q = query(counselorsRef, where('authId', '==', authId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching counselor:', error);
    return null;
  }
};

// Get all counselors
export const getAllCounselors = async () => {
  try {
    const counselorsRef = collection(db, 'counselors');
    const q = query(counselorsRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching counselors:', error);
    return [];
  }
};

// Update counselor last login
export const updateCounselorLastLogin = async (counselorId: string) => {
  try {
    const counselorRef = doc(db, 'counselors', counselorId);
    await updateDoc(counselorRef, {
      lastLogin: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

// Update counselor stats (leads count)
export const updateCounselorStats = async (counselorId: string) => {
  try {
    // Count assigned leads
    const assignmentsRef = collection(db, 'lead_assignments');
    const q = query(assignmentsRef, where('counselorId', '==', counselorId));
    const snapshot = await getDocs(q);
    const totalAssigned = snapshot.size;
    const converted = snapshot.docs.filter(doc => doc.data().status === 'converted').length;
    
    const counselorRef = doc(db, 'counselors', counselorId);
    await updateDoc(counselorRef, {
      totalAssignedLeads: totalAssigned,
      totalConvertedLeads: converted,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating counselor stats:', error);
  }
};