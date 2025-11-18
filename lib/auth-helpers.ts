'use server'

import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    
    if (!session) {
      return null;
    }

    // Verify the session token
    const decodedToken = await adminAuth.verifyIdToken(session);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}
