'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { setUpUser } from './setUpuser'

function SignUp() {
  const [loading, setLoading] = useState<boolean>(false)
  const [auth, setAuth] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    import('@/app/api/firebase/firebaseConfig').then((m) => setAuth(m.auth))
  }, [])

  const writeUserToDatabase = async () => {
    if (!auth?.currentUser) return
    const { uid, email, displayName } = auth.currentUser
    await setUpUser(email, uid, displayName || 'You')
  }

  const handleGoogleSignUp = async () => {
    if (!auth) return
    setLoading(true)
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const idToken = await result.user.getIdToken()
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to establish auth session')
      await writeUserToDatabase()
      router.push('/dashboard')
    } catch (error) {
      console.error('Error: Cannot Create Account with Google!', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs leading-none">S</span>
          </div>
          <span className="text-sm font-semibold text-white/80">Sulta AI</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-white">Create an account</h1>
            <p className="mt-1.5 text-sm text-white/40">Start building AI agents for free</p>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/8 bg-white/[0.02] p-6">
            <Button
              className="w-full h-10 rounded border border-white/10 bg-white/5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              <svg role="img" viewBox="0 0 24 24" className="mr-2.5 h-4 w-4 flex-shrink-0">
                <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              {loading ? 'Creating account...' : 'Continue with Google'}
            </Button>

            <p className="mt-5 text-center text-xs text-white/25">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-white/30">
            Already have an account?{' '}
            <Link href="/login" className="text-white/50 hover:text-white/80 underline underline-offset-4 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
