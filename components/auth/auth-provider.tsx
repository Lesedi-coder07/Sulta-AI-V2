'use client';

import { useEffect, useRef } from 'react';
import { auth } from '@/app/api/firebase/firebaseConfig';
import { useRouter, usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isRedirectingRef = useRef(false);

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
            credentials: 'include',
          });
          
          // Only refresh if we're not already redirecting and not on login page
          if (!isRedirectingRef.current && pathname !== '/login') {
            router.refresh();
          }
        } catch (error) {
          console.error('Error setting session:', error);
        }
      } else {
        // User is signed out, clear the session cookie
        // Only redirect if we're not already on login page and not already redirecting
        if (pathname !== '/login' && !isRedirectingRef.current && pathname?.startsWith('/ai')) {
          isRedirectingRef.current = true;
          try {
            await fetch('/api/auth/session', {
              method: 'DELETE',
            });
            window.location.replace('/login');
          } catch (error) {
            console.error('Error clearing session:', error);
            window.location.replace('/login');
          }
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return <>{children}</>;
}

