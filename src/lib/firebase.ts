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

export const saveInquiry = async (data: any) => {
  const inquiriesRef = collection(db, 'inquiries');
  return await addDoc(inquiriesRef, {
    ...data,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
};

export const saveFullApplication = async (data: any) => {
  const inquiriesRef = collection(db, 'inquiries');
  return await addDoc(inquiriesRef, {
    ...data,
    createdAt: new Date().toISOString(),
    status: 'pending',
    applicationType: 'full'
  });
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

// ========== DRAFT APPLICATIONS HELPERS ==========

export const saveDraftApplication = async (data: any, draftId?: string | null) => {
  const draftsRef = collection(db, 'drafts');
  if (draftId) {
    const draftRef = doc(db, 'drafts', draftId);
    await updateDoc(draftRef, { ...data, updatedAt: new Date().toISOString() });
    return draftId;
  } else {
    const docRef = await addDoc(draftsRef, {
      ...data,
      createdAt: new Date().toISOString(),
      status: 'draft'
    });
    return docRef.id;
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

export const saveCollege = async (userId: string, collegeData: any) => {
  const savedRef = collection(db, 'saved_colleges');
  const q = query(savedRef, where('userId', '==', userId), where('collegeId', '==', collegeData.collegeId));
  const existing = await getDocs(q);
  
  if (!existing.empty) {
    return { success: false, message: 'Already saved' };
  }
  
  await addDoc(savedRef, {
    userId: userId,
    collegeId: collegeData.collegeId,
    collegeName: collegeData.collegeName,
    location: collegeData.location,
    rating: collegeData.rating,
    fee: collegeData.fee,
    image: collegeData.image,
    savedAt: new Date().toISOString()
  });
  
  return { success: true, message: 'College saved successfully' };
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