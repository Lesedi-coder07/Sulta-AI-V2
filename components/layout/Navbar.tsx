'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { auth } from '@/app/api/firebase/firebaseConfig';
import { navLinks } from '@/data/navLinks';

const isExternal = (href: string) => href.startsWith('http://') || href.startsWith('https://');

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setLoggedIn(Boolean(user)));
    return () => unsub();
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-xs leading-none">S</span>
          </div>
          <span className="text-sm font-semibold text-white/80">Sulta AI</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <li key={link.title}>
              <Link
                href={link.href}
                target={isExternal(link.href) ? '_blank' : undefined}
                rel={isExternal(link.href) ? 'noreferrer noopener' : undefined}
                className="block rounded px-3 py-1.5 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {loggedIn ? (
            <Link href="/dashboard">
              <Button className="h-8 rounded px-4 text-xs font-semibold border border-white/15 bg-white text-slate-950 hover:bg-slate-100">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="h-8 rounded px-3 text-xs text-white/40 hover:bg-white/5 hover:text-white/80">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="h-8 rounded px-4 text-xs font-semibold border border-white/15 bg-white text-slate-950 hover:bg-slate-100">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded border border-white/10 p-1.5 text-white/40 transition hover:border-white/20 hover:text-white/70 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/8 bg-[#0a0a0a] px-4 pb-5 pt-3 lg:hidden">
          <ul className="space-y-0.5">
            {navLinks.map((link) => (
              <li key={link.title}>
                <Link
                  href={link.href}
                  target={isExternal(link.href) ? '_blank' : undefined}
                  rel={isExternal(link.href) ? 'noreferrer noopener' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded px-3 py-2 text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/8 pt-4">
            {loggedIn ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full h-9 rounded text-sm font-semibold border border-white/15 bg-white text-slate-950 hover:bg-slate-100">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full h-9 rounded text-sm border-white/10 bg-transparent text-white/50 hover:bg-white/5 hover:text-white/80">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full h-9 rounded text-sm font-semibold border border-white/15 bg-white text-slate-950 hover:bg-slate-100">
                    Get started
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
