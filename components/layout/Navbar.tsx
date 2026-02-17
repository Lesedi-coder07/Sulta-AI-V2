'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { auth } from '@/app/api/firebase/firebaseConfig';
import { navLinks } from '@/data/navLinks';
import { cn } from '@/lib/utils';

const isExternalHref = (href: string) => href.startsWith('http://') || href.startsWith('https://');

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(Boolean(user));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 14);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-300',
        scrolled
          ? 'bg-[#060A12]/90 shadow-[0_10px_50px_rgba(15,23,42,0.45)] backdrop-blur-xl'
          : 'bg-[#060A12]/70 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-[64px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/logos/Sulta/White.png" alt="Sulta AI" width={98} height={30} priority />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const external = isExternalHref(link.href);

            return (
              <li key={link.title}>
                <Link
                  href={link.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer noopener' : undefined}
                  className="rounded-md px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  {link.title}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {loggedIn ? (
            <Link href="/dashboard">
              <Button className="rounded-lg border border-[#fb923c]/50 bg-[#fb923c] text-slate-950 hover:bg-[#f97316]">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="rounded-lg text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-lg border border-[#fb923c]/50 bg-gradient-to-r from-[#fb923c] to-[#f97316] text-slate-950 hover:from-[#fdba74] hover:to-[#fb923c]">
                  Get Started
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="inline-flex rounded-lg border border-white/15 bg-white/5 p-2 text-slate-200 transition hover:border-[#fb923c]/60 hover:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#070b14]/95 px-4 pb-6 pt-5 backdrop-blur-xl lg:hidden">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const external = isExternalHref(link.href);

              return (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer noopener' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg border border-transparent px-3 py-2.5 text-sm text-slate-200 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 grid grid-cols-1 gap-3">
            {loggedIn ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-lg border border-[#fb923c]/50 bg-[#fb923c] text-slate-950 hover:bg-[#f97316]">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full rounded-lg border-white/20 bg-transparent text-slate-200 hover:bg-white/5 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-lg border border-[#fb923c]/50 bg-gradient-to-r from-[#fb923c] to-[#f97316] text-slate-950 hover:from-[#fdba74] hover:to-[#fb923c]">
                    Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
