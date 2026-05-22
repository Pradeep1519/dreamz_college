// src/lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, setDoc, getDoc, deleteDoc, orderBy, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/, '')
    .slice(0, 30);
  
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

export const saveDraftApplication = async (data: any, draftId?: string | null) => {
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

export const updateCounselorStats = async (counselorId: string) => {
  try {
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

// ========== JOB MANAGEMENT HELPERS ==========

export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  workType: 'On-site' | 'Remote' | 'Hybrid';
  type: 'Full Time' | 'Part Time' | 'Internship' | 'Contract' | 'Freelance' | 'Temporary';
  category: string;
  experience: string;
  description: string;
  requirements: string[];
  openings: number;
  requireResume: boolean;
  status: 'active' | 'closed' | 'deleted';
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface JobApplication {
  id?: string;
  jobId: string;
  jobTitle: string;
  name: string;
  phone: string;
  email: string;
  qualification: string;
  experience: string;
  portfolio?: string;
  resumeUrl?: string;
  message?: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'shortlisted';
  appliedAt: string;
  adminNotes?: string;
}

// Create a new job
export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
  try {
    const readableId = generateReadableId(jobData.title);
    const jobRef = doc(db, 'jobs', readableId);
    
    const newJob = {
      ...jobData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(jobRef, newJob);
    console.log(`✅ Job created with ID: ${readableId}`);
    return readableId;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Get all jobs (for admin)
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    const jobsRef = collection(db, 'jobs');
    const q = query(jobsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

// Get active jobs (for career page)
export const getActiveJobs = async (): Promise<Job[]> => {
  try {
    const jobsRef = collection(db, 'jobs');
    const q = query(jobsRef, where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    // Sort manually
    jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return jobs;
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    return [];
  }
};

// Get job by ID
export const getJobById = async (jobId: string): Promise<Job | null> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    const snapshot = await getDoc(jobRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Job;
    }
    return null;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
};

// Update job
export const updateJob = async (jobId: string, jobData: Partial<Job>): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, {
      ...jobData,
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ Job ${jobId} updated`);
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Close job
export const closeJob = async (jobId: string): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, {
      status: 'closed',
      closedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ Job ${jobId} closed`);
  } catch (error) {
    console.error('Error closing job:', error);
    throw error;
  }
};

// Delete job
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    await deleteDoc(jobRef);
    console.log(`✅ Job ${jobId} deleted`);
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// Submit job application with resume
export const submitJobApplication = async (applicationData: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>, resumeFile?: File): Promise<string> => {
  try {
    let resumeUrl = '';
    
    // Upload resume if provided
    if (resumeFile) {
      const storageRef = ref(storage, `job_resumes/${applicationData.jobId}/${Date.now()}_${resumeFile.name}`);
      await uploadBytes(storageRef, resumeFile);
      resumeUrl = await getDownloadURL(storageRef);
    }
    
    const readableId = generateReadableId(applicationData.name, applicationData.jobId.slice(-4));
    const applicationRef = doc(db, 'job_applications', readableId);
    
    const newApplication = {
      ...applicationData,
      resumeUrl,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    
    await setDoc(applicationRef, newApplication);
    console.log(`✅ Application submitted with ID: ${readableId}`);
    return readableId;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

// Get applications by job
export const getApplicationsByJob = async (jobId: string): Promise<JobApplication[]> => {
  try {
    const applicationsRef = collection(db, 'job_applications');
    const q = query(applicationsRef, where('jobId', '==', jobId), orderBy('appliedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};

// Get all applications
export const getAllApplications = async (): Promise<JobApplication[]> => {
  try {
    const applicationsRef = collection(db, 'job_applications');
    const q = query(applicationsRef, orderBy('appliedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};

// Update application status
export const updateApplicationStatus = async (applicationId: string, status: JobApplication['status'], adminNotes?: string): Promise<void> => {
  try {
    const applicationRef = doc(db, 'job_applications', applicationId);
    await updateDoc(applicationRef, {
      status,
      adminNotes: adminNotes || null,
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ Application ${applicationId} status updated to ${status}`);
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

// Delete application
export const deleteApplication = async (applicationId: string): Promise<void> => {
  try {
    const applicationRef = doc(db, 'job_applications', applicationId);
    await deleteDoc(applicationRef);
    console.log(`✅ Application ${applicationId} deleted`);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
};

// Get applications stats
export const getApplicationsStats = async (): Promise<{ total: number; pending: number; reviewed: number; shortlisted: number; rejected: number }> => {
  try {
    const applicationsRef = collection(db, 'job_applications');
    const snapshot = await getDocs(applicationsRef);
    const applications = snapshot.docs.map(doc => doc.data() as JobApplication);
    
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      reviewed: applications.filter(a => a.status === 'reviewed').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { total: 0, pending: 0, reviewed: 0, shortlisted: 0, rejected: 0 };
  }
};