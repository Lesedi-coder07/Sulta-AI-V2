import Link from 'next/link';
import { footerLinks } from '@/data/footerLinks';

const Footer = () => {
  return (
    <footer className="border-t border-white/8 bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-xs leading-none">S</span>
              </div>
              <span className="text-sm font-semibold text-white/80">Sulta AI</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/40">
              Build, host, and deploy AI agents. Create in the dashboard, run in chat, access via API.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/40 transition hover:text-white/70">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="mailto:hello@sultatech.com" className="text-white/40 transition hover:text-white/70">
                  hello@sultatech.com
                </a>
              </li>
              <li>
                <a href="https://sultatech.com/book" target="_blank" rel="noreferrer noopener" className="text-white/40 transition hover:text-white/70">
                  Book a demo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/8 pt-6">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Sulta Tech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
