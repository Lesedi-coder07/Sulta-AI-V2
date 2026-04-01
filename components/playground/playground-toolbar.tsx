"use client";

import { Button } from "@/components/ui/button";
import { ValidationIssue } from "@/types/playground";
import { PipelineGraph } from "@/types/playground";
import { exportJson } from "@/lib/playground/serialization";
import {
  FilePlus,
  Save,
  ShieldCheck,
  LayoutGrid,
  Play,
  Download,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface PlaygroundToolbarProps {
  graph: PipelineGraph;
  validationIssues: ValidationIssue[];
  onNewGraph: () => void;
  onSave: () => void;
  onValidate: () => void;
}

export function PlaygroundToolbar({
  graph,
  validationIssues,
  onNewGraph,
  onSave,
  onValidate,
}: PlaygroundToolbarProps) {
  const errorCount = validationIssues.filter((i) => i.severity === "error").length;
  const warnCount = validationIssues.filter((i) => i.severity === "warning").length;

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/6 bg-[#111]/60 backdrop-blur-sm flex-shrink-0">
      {/* Left: graph actions */}
      <div className="flex items-center gap-1">
        <ToolbarButton icon={<FilePlus className="w-3.5 h-3.5" />} label="New" onClick={onNewGraph} />
        <ToolbarButton icon={<Save className="w-3.5 h-3.5" />} label="Save" onClick={onSave} />
        <ToolbarButton
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
          label="Validate"
          onClick={onValidate}
        />
        <div className="w-px h-4 bg-white/10 mx-0.5" />
        <ToolbarButton
          icon={<LayoutGrid className="w-3.5 h-3.5" />}
          label="Auto-layout"
          disabled
          title="Coming soon"
        />
        <ToolbarButton
          icon={<Play className="w-3.5 h-3.5" />}
          label="Run"
          disabled
          title="Coming soon"
        />
      </div>

      {/* Right: status and export */}
      <div className="flex items-center gap-2">
        {validationIssues.length > 0 && (
          <div className="flex items-center gap-1.5">
            {errorCount > 0 && (
              <div className="flex items-center gap-1 text-red-400">
                <XCircle className="w-3 h-3" />
                <span className="text-[10px] font-medium">{errorCount}</span>
              </div>
            )}
            {warnCount > 0 && (
              <div className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-[10px] font-medium">{warnCount}</span>
              </div>
            )}
          </div>
        )}
        {validationIssues.length === 0 && graph.nodes.length > 0 && (
          <div className="flex items-center gap-1 text-green-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[10px] font-medium">Valid</span>
          </div>
        )}
        <div className="w-px h-4 bg-white/10" />
        <button
          onClick={() => exportJson(graph)}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          title="Export JSON"
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
  title,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
      className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] transition-colors ${
        disabled
          ? "text-white/20 cursor-not-allowed"
          : "text-white/50 hover:text-white/80 hover:bg-white/5"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
