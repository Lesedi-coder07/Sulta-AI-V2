import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <div className="border-b border-white/8 pb-10 pt-12">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Waitlist</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Your seat is reserved</h1>
          <p className="mt-2 max-w-lg text-sm text-white/50">
            You are on the waitlist. We will send an onboarding update as soon as your workspace is ready — usually within 48 hours.
          </p>
        </div>

        <div className="py-10">
          <div className="overflow-hidden rounded-lg border border-white/8">
            {[
              { label: 'Status', value: 'Confirmed' },
              { label: 'Next update', value: 'Within 48 hours' },
              { label: 'Priority access', value: 'Enabled' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between border-t border-white/8 px-5 py-4 first:border-t-0">
                <p className="text-sm text-white/40">{item.label}</p>
                <p className="text-sm font-medium text-white/80">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/learn-more">
              <Button className="h-9 rounded-lg border border-white/15 bg-white px-5 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                Explore the product
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="h-9 rounded-lg border-white/15 bg-transparent px-5 text-sm text-white/60 hover:bg-white/5 hover:text-white/90">
                Review pricing
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
