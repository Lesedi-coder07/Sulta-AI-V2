import Link from 'next/link';
import { CheckCircle2, Clock3, Sparkles } from 'lucide-react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-[#03060D] text-slate-100">
      <Navbar />

      <main className="relative overflow-hidden pb-20 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-110px] top-20 h-[460px] w-[300px] rounded-full bg-[#fb923c]/20 blur-[130px]" />
          <div className="absolute right-[-90px] top-48 h-[420px] w-[260px] rounded-full bg-[#22d3ee]/14 blur-[125px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        </div>

        <section className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[30px] border border-white/10 bg-[#090F1A]/85 p-7 shadow-[0_20px_80px_rgba(2,6,23,0.7)] sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#67e8f9]/40 bg-[#22d3ee]/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
              <Sparkles className="h-3.5 w-3.5" />
              Access Reserved
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              You are officially on
              <br />
              the launch waitlist
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Your seat is saved. We will send onboarding details as soon as your workspace is ready for activation.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#67e8f9]" />
                  Status
                </p>
                <p className="mt-1 text-lg font-semibold text-white">Confirmed</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <Clock3 className="h-3.5 w-3.5 text-[#fdba74]" />
                  Next update
                </p>
                <p className="mt-1 text-lg font-semibold text-white">Within 48 hrs</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Priority lane</p>
                <p className="mt-1 text-lg font-semibold text-white">Enabled</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/learn-more">
                <Button className="h-11 rounded-lg border border-[#fb923c]/65 bg-gradient-to-r from-[#fb923c] to-[#f97316] px-6 text-slate-950 hover:from-[#fdba74] hover:to-[#fb923c]">
                  Explore Platform
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-white/20 bg-transparent px-6 text-slate-100 hover:bg-white/5"
                >
                  Review Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
