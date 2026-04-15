"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export function CodeBlock({ code, lang }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/8 bg-[#0d0d0d]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        {lang ? (
          <span className="font-mono text-[11px] text-white/25">{lang}</span>
        ) : (
          <span />
        )}
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 rounded px-2 py-1 text-[11px] transition-colors",
            copied
              ? "text-emerald-400"
              : "text-white/25 hover:text-white/60"
          )}
          title="Copy"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}
