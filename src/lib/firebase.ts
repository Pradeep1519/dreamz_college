// src/lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';  // ✅ NEW - Storage ke liye

// Tumhara Firebase Config
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
export const storage = getStorage(app);  // ✅ NEW - Storage instance export

// Helper: Check if user already submitted for a course
export const hasUserSubmittedForCourse = async (phoneNumber: string, courseSlug: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(inquiriesRef, where('phoneNumber', '==', phoneNumber), where('courseSlug', '==', courseSlug));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Helper: Save inquiry
export const saveInquiry = async (data: any) => {
  const inquiriesRef = collection(db, 'inquiries');
  return await addDoc(inquiriesRef, {
    ...data,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
};

// Helper: Get user's all inquiries
export const getUserInquiries = async (phoneNumber: string) => {
  const inquiriesRef = collection(db, 'inquiries');
  const q = query(inquiriesRef, where('phoneNumber', '==', phoneNumber));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper: Save or update user
export const saveUser = async (phoneNumber: string, userData: any) => {
  const userRef = doc(db, 'users', phoneNumber);
  return await setDoc(userRef, {
    ...userData,
    phone: phoneNumber,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

// Helper: Get user by phone
export const getUserByPhone = async (phoneNumber: string) => {
  const userRef = doc(db, 'users', phoneNumber);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};