"use client";

import { PipelineNodeKind, NODE_KIND_META } from "@/types/playground";
import { Bot, MessageSquare, Wrench, Send } from "lucide-react";

const ICONS: Record<PipelineNodeKind, React.ElementType> = {
  agent: Bot,
  input: MessageSquare,
  tool: Wrench,
  response: Send,
};

const NODE_KINDS: PipelineNodeKind[] = ["input", "agent", "tool", "response"];

interface NodePaletteProps {
  onAddNode: (kind: PipelineNodeKind) => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    kind: PipelineNodeKind
  ) => {
    e.dataTransfer.setData("application/x-node-kind", kind);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2">
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-white/30">
          Nodes
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {NODE_KINDS.map((kind) => {
          const meta = NODE_KIND_META[kind];
          const Icon = ICONS[kind];
          return (
            <div
              key={kind}
              draggable
              onDragStart={(e) => handleDragStart(e, kind)}
              onClick={() => onAddNode(kind)}
              className="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing transition-colors duration-100 hover:bg-white/5 select-none"
              title={`Drag to canvas or click to add ${meta.label}`}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: meta.bgColor,
                  border: `1px solid ${meta.borderColor}`,
                }}
              >
                <Icon className="w-3 h-3" style={{ color: meta.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors truncate">
                  {meta.label}
                </p>
                <p className="text-[10px] text-white/30 truncate">{meta.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-3 py-2 border-t border-white/5">
        <p className="text-[10px] text-white/25">Drag or click to add</p>
      </div>
    </div>
  );
}
