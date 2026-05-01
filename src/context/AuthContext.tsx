// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: any | null;
  setUserData: (data: any) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  userData: null,
  setUserData: () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed - User:', firebaseUser?.email, 'UID:', firebaseUser?.uid);
      
      if (firebaseUser) {
        try {
          // Check if this user is a COUNSELOR
          const counselorsRef = collection(db, 'counselors');
          const q = query(counselorsRef, where('authId', '==', firebaseUser.uid));
          const counselorSnapshot = await getDocs(q);
          
          if (!counselorSnapshot.empty) {
            // This is a counselor
            const counselorData = counselorSnapshot.docs[0].data();
            const counselorId = counselorSnapshot.docs[0].id;
            
            setUserData({
              ...counselorData,
              uid: firebaseUser.uid,
              userType: 'counselor',
              id: counselorId
            });
            
            // ✅ CRITICAL FIX: Set the user object
            setUser(firebaseUser);
            
            // Check if we're on counselor route
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/counselor')) {
              console.log('Counselor on counselor portal - keeping session');
            } else {
              console.log('Counselor on main website - logging out');
              await signOut(auth);
              setUser(null);
              setUserData(null);
            }
          } else {
            // Normal user
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              setUserData({ ...userSnap.data(), uid: firebaseUser.uid, userType: 'user' });
            } else {
              setUserData({
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
                uid: firebaseUser.uid,
                userType: 'user'
              });
            }
            setUser(firebaseUser);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUserData({
            email: firebaseUser.email,
            name: firebaseUser.email?.split('@')[0],
            uid: firebaseUser.uid
          });
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}