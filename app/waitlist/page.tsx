import Link from 'next/link';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

const waitlistSignals = [
  { label: 'Status', value: 'Confirmed' },
  { label: 'Next update', value: 'Within 48 hrs' },
  { label: 'Priority lane', value: 'Enabled' },
];

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-[#03060D] text-slate-100">
      <Navbar />

      <main className="relative overflow-hidden pb-24 pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-14 h-[560px] w-[300px] rounded-full bg-white/8 blur-[140px]" />
          <div className="absolute right-[-120px] top-40 h-[540px] w-[260px] rounded-full bg-slate-300/8 blur-[150px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
        </div>

        <section className="relative mx-auto max-w-5xl px-4 pb-16 pt-12 text-center sm:px-6 lg:px-8 lg:pt-20">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Waitlist
            </div>

            <h1 className="mt-8 text-[clamp(2.35rem,6vw,4.2rem)] font-semibold leading-[1.04] text-white [text-wrap:balance]">
              Your seat is reserved
              <br />
              for launch access
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              You are officially on the waitlist. We will send the next onboarding update as soon as your workspace is
              ready.
            </p>
          </div>

          <div className="mx-auto mt-16 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#070D18]/70 px-6 py-7 backdrop-blur-sm sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Reservation Status</p>

            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {waitlistSignals.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xl font-semibold text-white sm:text-2xl">{item.value}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/learn-more">
              <Button className="h-11 rounded-lg border border-white/15 bg-white px-6 text-slate-950 hover:bg-slate-200">
                Explore Product
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
