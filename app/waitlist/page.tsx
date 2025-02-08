'use client'
import Navbar from '@/components/layout/Navbar'
import React from 'react'
import Image from 'next/image'

function WaitlistPage() {
  return (
    <div>
      <Navbar />
       <main className='container mx-auto'>
         <div className='flex flex-col items-center mt-9 h-screen'>
            <Image className='rounded-md mb-4 hover:scale-105 transition-all duration-300 hover:outline-blue-500' src="/ai-hero.jpg" alt="waitlist" width={600} height={600} />
            <h1 className='text-4xl font-bold text-center'>You're on the waitlist!</h1>
            <p className='text-lg text-gray-500 text-center'>We'll notify you when Sulta AI is ready</p>
         </div>
       </main>
    </div>
  )
}

export default WaitlistPage
