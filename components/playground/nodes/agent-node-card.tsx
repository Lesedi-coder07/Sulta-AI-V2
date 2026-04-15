"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { PipelineNodeData, PipelineNodeKind, NODE_KIND_META } from "@/types/playground";
import { Bot, MessageSquare, Wrench, Send } from "lucide-react";
import { TOOL_REGISTRY } from "@/lib/ai/tools";

const NODE_ICONS: Record<PipelineNodeKind, React.ElementType> = {
  agent: Bot,
  input: MessageSquare,
  tool: Wrench,
  response: Send,
};

function getConfigSummary(kind: PipelineNodeKind, config: Record<string, unknown>): string {
  switch (kind) {
    case "agent":
      return config.agentName ? String(config.agentName) : "No agent linked";
    case "input":
      return `Source: ${config.source ?? "chat"}`;
    case "tool": {
      const ids = Array.isArray(config.toolIds) ? (config.toolIds as string[]) : [];
      if (ids.length === 0) return "No tools selected";
      if (ids.length === 1) {
        const meta = TOOL_REGISTRY.find((t) => t.id === ids[0]);
        return meta ? meta.label : ids[0];
      }
      return `${ids.length} tools enabled`;
    }
    case "response":
      return `Format: ${config.format ?? "text"}`;
  }
}

type AgentNodeProps = NodeProps & {
  data: PipelineNodeData;
  type: string;
  selected?: boolean;
};

export const AgentNodeCard = memo(function AgentNodeCard({
  data,
  type,
  selected,
}: AgentNodeProps) {
  const kind = type as PipelineNodeKind;
  const meta = NODE_KIND_META[kind];
  const Icon = NODE_ICONS[kind];
  const summary = getConfigSummary(kind, data.config);

  const isInput = kind === "input";
  const isOutput = kind === "response";
  const isAgent = kind === "agent";

  return (
    <div
      style={{
        background: meta.bgColor,
        borderColor: selected ? meta.color : meta.borderColor,
        boxShadow: selected
          ? `0 0 0 1px ${meta.color}, 0 4px 24px ${meta.bgColor}`
          : isAgent
          ? `0 0 20px rgba(139,92,246,0.12), 0 2px 8px rgba(0,0,0,0.4)`
          : "0 2px 8px rgba(0,0,0,0.4)",
      }}
      className="relative min-w-[180px] rounded-xl border transition-all duration-150 px-3 py-2.5 cursor-pointer"
    >
      {/* Target handle (left) — all nodes except input */}
      {!isInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2.5 !h-2.5 !rounded-full !border-2 !border-white/20"
          style={{ background: meta.color, left: -5 }}
        />
      )}

      <div className="flex items-start gap-2">
        <div
          className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: meta.bgColor, border: `1px solid ${meta.borderColor}` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-semibold text-white/90 truncate">
              {data.label}
            </span>
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{
                color: meta.color,
                background: meta.bgColor,
                border: `1px solid ${meta.borderColor}`,
              }}
            >
              {meta.label}
            </span>
          </div>
          <p className="text-[10px] text-white/40 truncate">{summary}</p>
        </div>
      </div>

      {/* Source handle (right) — all nodes except response */}
      {!isOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2.5 !h-2.5 !rounded-full !border-2 !border-white/20"
          style={{ background: meta.color, right: -5 }}
        />
      )}
    </div>
  );
});
