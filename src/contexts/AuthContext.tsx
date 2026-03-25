import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || 'anonymous',
      email: auth.currentUser?.email || 'none',
      emailVerified: auth.currentUser?.emailVerified || false,
      isAnonymous: auth.currentUser?.isAnonymous || false,
    },
    operationType,
    path
  };
  console.error('[FIRESTORE ERROR]', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isBypassAdmin: boolean;
  setBypassAdmin: (isAdmin: boolean) => void;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBypassAdmin, setIsBypassAdmin] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });

  const setBypassAdmin = (isAdmin: boolean) => {
    setIsBypassAdmin(isAdmin);
    if (isAdmin) {
      sessionStorage.setItem('isAdmin', 'true');
    } else {
      sessionStorage.removeItem('isAdmin');
    }
  };

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        try {
          const profileRef = doc(db, 'users', firebaseUser.uid);
          
          // Use onSnapshot for real-time sync
          unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
            try {
              // JSON Guard: Wrap all Firestore data fetching in a check
              const exists = docSnap.exists();
              const data = exists ? docSnap.data() : { 
                orders: 0, 
                savings: 0, 
                rewards: 0,
                displayName: firebaseUser.displayName || 'CITIZEN',
                email: firebaseUser.email || '',
                uid: firebaseUser.uid
              };

              const profile: UserProfile = {
                uid: data.uid || firebaseUser.uid,
                email: data.email || firebaseUser.email || '',
                displayName: data.displayName || firebaseUser.displayName || 'CITIZEN',
                photoURL: data.photoURL || firebaseUser.photoURL || '',
                bio: data.bio || '',
                isAdmin: data.isAdmin || firebaseUser.email === 'itxmerajkhan3109@gmail.com',
                dietaryFlags: data.dietaryFlags || {
                  vegan: false,
                  halal: false,
                  vegetarian: false,
                  glutenFree: false,
                  noBeef: false
                },
                rewards: data.rewards || 0,
                savings: data.savings || 0,
                orders: data.orders || 0,
                orderHistory: data.orderHistory || [],
                paymentCards: data.paymentCards || [],
                createdAt: data.createdAt || new Date().toISOString()
              };
              
              setUserProfile(prev => {
                // Only update if data actually changed to prevent re-render loops
                if (JSON.stringify(prev) === JSON.stringify(profile)) return prev;
                return profile;
              });

              if (!exists && !(docSnap as any).metadata?.hasPendingWrites) {
                // Initialize if not exists and no pending writes to avoid loops
                setDoc(profileRef, profile).catch(e => {
                  // Ignore permission errors during auto-init if they happen
                  console.warn("Auto-init failed:", e);
                });
              }
            } catch (err) {
              console.error("Error parsing profile data:", err);
              // Fallback to minimal profile on parse error
              setUserProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: 'CITIZEN',
                photoURL: '',
                dietaryFlags: { vegan: false, halal: false, vegetarian: false, glutenFree: false, noBeef: false },
                rewards: 0,
                savings: 0,
                orders: 0,
                orderHistory: [],
                paymentCards: [],
                createdAt: new Date().toISOString()
              });
            }
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          });
        } catch (err) {
          console.error("Error setting up profile listener:", err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const logout = async () => {
    setBypassAdmin(false);
    await signOut(auth);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    
    try {
      // Use updateDoc for partial updates as requested
      await updateDoc(profileRef, data);
    } catch (e) {
      // If document doesn't exist, fallback to setDoc
      try {
        await setDoc(profileRef, data, { merge: true });
      } catch (innerError) {
        handleFirestoreError(innerError, OperationType.WRITE, `users/${user.uid}`);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isBypassAdmin, setBypassAdmin, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
