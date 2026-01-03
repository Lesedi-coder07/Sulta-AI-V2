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

    // Verify the session cookie (checkRevoked=true ensures user hasn't been disabled)
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
    };
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}
