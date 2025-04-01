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
        import('@/app/api/firebase/firebaseConfig').then((firebaseModule) => {
            setAuth(firebaseModule.auth)
        })
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
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            await writeUserToDatabase()
            router.push('/waitlist')
        } catch (error) {
            console.error('Error: Cannot Create Account with Google!', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Link href={"/"}>
                <Button
                    variant="ghost"
                    className="absolute left-4 top-4"
                    onClick={(e) => {
                        e.preventDefault()
                        router.push('/')
                    }}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </Link>

            <div className="flex min-h-screen flex-col items-center justify-center">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">The possibilities are endless with Sulta AI</p>
                    </div>

                    <Button className='mx-4' variant="outline" onClick={handleGoogleSignUp} disabled={loading}>
                        <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                            <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                        </svg>
                        {loading ? 'Signing up...' : 'Continue with Google'}
                    </Button>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
