'use client';

import { useEffect } from 'react';
import { auth } from '@/app/api/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get the ID token and set it as a session cookie
        const idToken = await user.getIdToken();
        
        try {
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          });
          
          // Refresh the server component to get the latest data
          router.refresh();
        } catch (error) {
          console.error('Error setting session:', error);
        }
      } else {
        // User is signed out, clear the session cookie
        try {
          await fetch('/api/auth/session', {
            method: 'DELETE',
          });
          router.push('/login');
        } catch (error) {
          console.error('Error clearing session:', error);
          router.push('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <>{children}</>;
}

