"use client";

import { useState, useRef, useEffect } from "react";
import { Agent } from "@/types/agent";
import { Bot, ChevronDown, Search, Check } from "lucide-react";

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelect: (agent: Agent) => void;
  loading?: boolean;
}

export function AgentSelector({
  agents,
  selectedAgent,
  onSelect,
  loading = false,
}: AgentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? agents.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : agents;

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className={`flex items-center gap-2 h-7 px-2.5 rounded-lg border text-[11px] transition-all ${
          selectedAgent
            ? "border-violet-500/40 bg-violet-500/8 text-white/80 hover:bg-violet-500/12"
            : "border-white/10 bg-white/4 text-white/40 hover:text-white/60 hover:bg-white/6"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Bot className="w-3 h-3 flex-shrink-0" />
        <span className="max-w-[120px] truncate">
          {loading ? "Loading..." : selectedAgent ? selectedAgent.name : "Select agent"}
        </span>
        <ChevronDown
          className={`w-3 h-3 flex-shrink-0 text-white/30 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 w-64 rounded-xl border border-white/10 bg-[#111] shadow-2xl z-50 overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" }}
        >
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/6">
            <Search className="w-3 h-3 text-white/30 flex-shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agents..."
              className="flex-1 bg-transparent text-[11px] text-white/80 placeholder:text-white/25 outline-none"
            />
          </div>

          {/* Agent list */}
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-[11px] text-white/25 text-center">
                {agents.length === 0 ? "No agents found" : "No matches"}
              </p>
            ) : (
              filtered.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      onSelect(agent);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                      isSelected
                        ? "bg-violet-500/12 text-white/90"
                        : "text-white/60 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}
                    >
                      <Bot className="w-3 h-3 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium truncate leading-tight">{agent.name}</p>
                      <p className="text-[10px] text-white/30 truncate">
                        {agent.type}
                        {Array.isArray(agent.tools) && agent.tools.length > 0
                          ? ` · ${agent.tools.length} tool${agent.tools.length > 1 ? "s" : ""}`
                          : ""}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-3 h-3 text-violet-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
