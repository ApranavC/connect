import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './client';

export interface UserProfile {
    id: string;
    email: string;
    gender: string;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

export const createUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    const userRef = doc(db, 'users', uid);
    const now = new Date().toISOString();
    await setDoc(userRef, {
        ...data,
        id: uid,
        created_at: now,
        updated_at: now,
    }, { merge: true });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        ...data,
        updated_at: new Date().toISOString(),
    });
};

export const setUserAvailability = async (uid: string, isAvailable: boolean) => {
    await updateUserProfile(uid, { is_available: isAvailable });
};
