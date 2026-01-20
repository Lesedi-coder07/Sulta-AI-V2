'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientText } from '@/components/ui/gradient-text'
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'

function Login() {
  const [loading, setLoading] = useState<boolean>(false)
  const [auth, setAuth] = useState<any>(null)
  const router = useRouter()
  const redirectingRef = useRef(false)

  // Check if user is already authenticated on mount
  useEffect(()=> {
    if (!auth) return
    
    const checkAuth = async () => {
      const currentUser = auth.currentUser
      if (currentUser && !redirectingRef.current) {
        redirectingRef.current = true
        // Get the ID token and set session cookie before redirecting
        try {
          const idToken = await currentUser.getIdToken()
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
            credentials: 'include', // Ensure cookies are included
          })
          
          if (response.ok) {
            // Use client-side navigation for instant transition
            router.push('/dashboard')
          } else {
            redirectingRef.current = false
          }
        } catch (error) {
          console.error('Error setting session:', error)
          redirectingRef.current = false
        }
      }
    }
    
    checkAuth()
  }, [auth])

  useEffect(() => {
    import('@/app/api/firebase/firebaseConfig').then((firebaseModule) => {
      setAuth(firebaseModule.auth)
    })
  }, [])

  const handleGoogleLogin = async () => {
    if (!auth || redirectingRef.current) return
    setLoading(true)
    redirectingRef.current = true
    
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
      const provider = new GoogleAuthProvider()

      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      // Get the ID token and set session cookie before redirecting
      const idToken = await user.getIdToken()
      
      try {
        const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
          credentials: 'include', // Ensure cookies are included
        })
        
        if (response.ok) {
          // Use client-side navigation for instant transition
          router.push('/dashboard')
        } else {
          redirectingRef.current = false
          setLoading(false)
        }
      } catch (error) {
        console.error('Error setting session:', error)
        redirectingRef.current = false
        setLoading(false)
      }
    } catch {
      redirectingRef.current = false
      setLoading(false)
      return 'Error: Cannot Login with Google!'
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-background" />
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Back button */}
      <Link href={"/"}>
        <Button
          variant="ghost"
          className="absolute left-4 top-4 z-10 hover:bg-background/80 backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault()
            router.push('/')
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl dark:bg-card/90">
            <CardHeader className="space-y-4 text-center pb-8">
              <div className="flex justify-center mb-4">
                
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Welcome to Sulta AI
              </CardTitle>
              <CardDescription className="text-base">
                Sign in to access your AI agents and start building amazing experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200" 
                onClick={handleGoogleLogin} 
                disabled={loading}
              >
                <svg role="img" viewBox="0 0 24 24" className="mr-3 h-5 w-5">
                  <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground pt-2">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
