import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { footerLinks } from '@/data/footerLinks';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#05070D] text-slate-300">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#fdba74]">Sulta AI Platform</p>
          <h3 className="mt-3 max-w-md text-2xl font-semibold text-white">
            Build, host, and deploy AI agents.
          </h3>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">
            Create agents in the dashboard, run them through hosted chat routes, and access them through
            API keys when you need programmatic integration.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/signup">
              <Button className="rounded-lg border border-[#fb923c]/60 bg-gradient-to-r from-[#fb923c] to-[#f97316] text-slate-950 hover:from-[#fdba74] hover:to-[#fb923c]">
                Start Free
              </Button>
            </Link>
            <Link href="https://sultatech.com/book" target="_blank" rel="noreferrer noopener">
              <Button
                variant="outline"
                className="rounded-lg border-white/20 bg-transparent text-slate-200 hover:bg-white/5 hover:text-white"
              >
                Book Demo
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Explore</h4>
          <ul className="mt-4 space-y-3">
            {footerLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-slate-300 transition hover:text-[#fdba74]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href="mailto:hello@sultatech.com" className="transition hover:text-[#67e8f9]">
                hello@sultatech.com
              </a>
            </li>
            <li>
              <a href="https://sultatech.com/book" target="_blank" rel="noreferrer noopener" className="transition hover:text-[#67e8f9]">
                Schedule a strategy call
              </a>
            </li>
            <li className="text-slate-500">Global remote team</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Sulta Tech. All rights reserved.</p>
          <p>Agent builder, hosted interfaces, and API access in one product.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
