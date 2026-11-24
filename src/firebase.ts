import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { MockFoodItem } from './data/mockFoodDb';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID (CRITICAL: Required for multi-database Firestore)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper: Sign In with Google Popup
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// Helper: Sign Out
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

// Validate connection to Firestore
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore: check configuration or network offline.');
    }
    return false;
  }
}

// Ensure UserProfile document exists and return persisted dailySteps
export async function syncUserProfile(user: User, defaultSteps = 7420): Promise<number> {
  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const profileData: Record<string, unknown> = {
        id: user.uid,
        displayName: (user.displayName || user.email?.split('@')[0] || 'Google User').slice(0, 128),
        email: (user.email || 'user@gmail.com').slice(0, 256),
        dailySteps: defaultSteps,
        createdAt: now,
        updatedAt: now,
      };
      if (user.photoURL && user.photoURL.length <= 512) {
        profileData.photoURL = user.photoURL;
      }
      await setDoc(userRef, profileData);
      return defaultSteps;
    } else {
      const existingData = snap.data();
      const persistedSteps =
        typeof existingData.dailySteps === 'number' ? existingData.dailySteps : defaultSteps;

      const updateData: Record<string, unknown> = {
        displayName: (
          user.displayName ||
          existingData.displayName ||
          user.email?.split('@')[0] ||
          'Google User'
        ).slice(0, 128),
        dailySteps: persistedSteps,
        updatedAt: now,
      };
      if (user.photoURL && user.photoURL.length <= 512) {
        updateData.photoURL = user.photoURL;
      }
      await updateDoc(userRef, updateData);
      return persistedSteps;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

// Update dailySteps in UserProfile
export async function saveUserDailySteps(user: User, steps: number): Promise<void> {
  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);
  const clampedSteps = Math.max(0, Math.min(200000, Math.round(steps)));
  const now = new Date().toISOString();
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      await updateDoc(userRef, {
        dailySteps: clampedSteps,
        updatedAt: now,
      });
    } else {
      await setDoc(userRef, {
        id: user.uid,
        displayName: (user.displayName || user.email?.split('@')[0] || 'Google User').slice(0, 128),
        email: (user.email || 'user@gmail.com').slice(0, 256),
        dailySteps: clampedSteps,
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

// Save a food log document under /users/{uid}/foodLogs/{logId}
export async function saveFoodLogToFirestore(uid: string, food: MockFoodItem): Promise<void> {
  const safeId = (food.id || `food_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const logPath = `users/${uid}/foodLogs/${safeId}`;
  const logRef = doc(db, 'users', uid, 'foodLogs', safeId);

  const payload: Record<string, unknown> = {
    id: safeId,
    userId: uid,
    name: String(food.name || 'Meal').slice(0, 128),
    calories: Math.max(0, Math.min(10000, Math.round(Number(food.calories) || 0))),
    protein: String(food.protein || '0g').slice(0, 32),
    carbs: String(food.carbs || '0g').slice(0, 32),
    fat: String(food.fat || '0g').slice(0, 32),
    fiber: String(food.fiber || '0g').slice(0, 32),
    good: String(food.good || 'Balanced Nutrient Profile').slice(0, 256),
    bad: String(food.bad || 'None').slice(0, 256),
    glycemicIndex: Math.max(0, Math.min(150, Math.round(Number(food.glycemicIndex) || 35))),
    advice: String(food.advice || '').slice(0, 512),
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(logRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, logPath);
  }
}

// Delete a food log document
export async function deleteFoodLogFromFirestore(uid: string, logId: string): Promise<void> {
  const safeId = logId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const logPath = `users/${uid}/foodLogs/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'foodLogs', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, logPath);
  }
}

// Real-time listener for user's food logs
export function subscribeToUserFoodLogs(
  uid: string,
  onData: (logs: MockFoodItem[]) => void
): Unsubscribe {
  const collectionPath = `users/${uid}/foodLogs`;
  const q = query(
    collection(db, 'users', uid, 'foodLogs'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: MockFoodItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: data.id || d.id,
          name: data.name || 'Logged Meal',
          calories: Number(data.calories) || 0,
          protein: data.protein || '0g',
          carbs: data.carbs || '0g',
          fat: data.fat || '0g',
          fiber: data.fiber || '0g',
          good: data.good || 'Balanced Nutrient Profile',
          bad: data.bad || 'None',
          glycemicIndex: typeof data.glycemicIndex === 'number' ? data.glycemicIndex : 35,
          advice: data.advice || '',
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
    }
  );
}
