"use client";

import { ValidationIssue } from "@/types/playground";
import { AlertTriangle, XCircle, CheckCircle } from "lucide-react";

interface ValidationPanelProps {
  issues: ValidationIssue[];
}

export function ValidationPanel({ issues }: ValidationPanelProps) {
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-semibold tracking-widest uppercase text-white/30">
            Validation
          </h2>
          <div className="flex items-center gap-1.5">
            {errors.length > 0 && (
              <span className="text-[10px] text-red-400 font-medium">
                {errors.length} error{errors.length > 1 ? "s" : ""}
              </span>
            )}
            {warnings.length > 0 && (
              <span className="text-[10px] text-amber-400 font-medium">
                {warnings.length} warn{warnings.length > 1 ? "ings" : "ing"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {issues.length === 0 ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
            <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            <span className="text-[11px] text-white/40">All checks passed</span>
          </div>
        ) : (
          issues.map((issue, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 px-2 py-2 rounded-lg ${
                issue.severity === "error"
                  ? "bg-red-500/8 border border-red-500/15"
                  : "bg-amber-500/8 border border-amber-500/15"
              }`}
            >
              {issue.severity === "error" ? (
                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-[11px] leading-snug ${
                  issue.severity === "error" ? "text-red-300/80" : "text-amber-300/80"
                }`}
              >
                {issue.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
