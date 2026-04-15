"use client";

import Link from "next/link";
import { Plus, FlaskConical, Key, BookOpen, ArrowRight } from "lucide-react";

const ACTIONS = [
  {
    label: "New agent",
    description: "Build and deploy a custom AI agent",
    href: "/create",
    icon: Plus,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    hoverBg: "hover:bg-violet-500/15",
  },
  {
    label: "Playground",
    description: "Design pipelines and test tool configurations",
    href: "/playground",
    icon: FlaskConical,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    hoverBg: "hover:bg-blue-500/15",
  },
  {
    label: "API keys",
    description: "Manage credentials for the Sulta API",
    href: "/settings",
    icon: Key,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    hoverBg: "hover:bg-amber-500/15",
  },
  {
    label: "Docs",
    description: "Explore guides, references, and examples",
    href: "/docs/api",
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hoverBg: "hover:bg-emerald-500/15",
  },
] as const;

export function QuickActionsCard() {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl border border-white/8 bg-white/3">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-white/30">
        Quick actions
      </p>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex flex-col gap-2 p-3 rounded-xl border ${action.border} ${action.bg} ${action.hoverBg} transition-colors`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${action.color}`} />
                <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-white/40 transition-colors" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white/80 leading-none mb-0.5">
                  {action.label}
                </p>
                <p className="text-[10px] text-white/35 leading-snug">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
