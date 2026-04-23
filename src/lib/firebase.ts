// src/lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
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

// Save or update user
export const saveUser = async (userId: string, userData: any) => {
  const userRef = doc(db, 'users', userId);
  return await setDoc(userRef, {
    ...userData,
    userId: userId,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

// Get user by ID
export const getUserById = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Get user by phone
export const getUserByPhone = async (phoneNumber: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('phone', '==', phoneNumber));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
};

// ========== INQUIRY/APPLICATION HELPERS ==========

// Check if user already submitted for a course (by phone - old method)
export const hasUserSubmittedForCourse = async (phoneNumber: string, courseSlug: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(inquiriesRef, where('phoneNumber', '==', phoneNumber), where('courseSlug', '==', courseSlug));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// ✅ NEW: Check if user already applied for a specific course in a college (by userId)
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

// ✅ NEW: Get user's applied courses for a college
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

// Save inquiry (basic - old method)
export const saveInquiry = async (data: any) => {
  const inquiriesRef = collection(db, 'inquiries');
  return await addDoc(inquiriesRef, {
    ...data,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
};

// ✅ NEW: Save full application (with all academic details)
export const saveFullApplication = async (data: any) => {
  const inquiriesRef = collection(db, 'inquiries');
  return await addDoc(inquiriesRef, {
    ...data,
    createdAt: new Date().toISOString(),
    status: 'pending',
    applicationType: 'full'
  });
};

// Get user's all inquiries (by phone - old method)
export const getUserInquiries = async (phoneNumber: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(inquiriesRef, where('phoneNumber', '==', phoneNumber));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ NEW: Get user's all applications by userId
export const getUserApplications = async (userId: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(inquiriesRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all inquiries (for admin)
export const getAllInquiries = async () => {
  const inquiriesRef = collection(db, 'inquiries');
  const querySnapshot = await getDocs(inquiriesRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update inquiry status (for admin)
export const updateInquiryStatus = async (inquiryId: string, status: string) => {
  const inquiryRef = doc(db, 'inquiries', inquiryId);
  return await setDoc(inquiryRef, { status, updatedAt: new Date().toISOString() }, { merge: true });
};