"use client";

import { Bot, Music, FileText, Pencil, CircleDot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AgentStatus = 'online' | 'offline' | 'busy';

export default interface AgentCardProps {
  name: string;
  type: string;
  status: AgentStatus;
  onClick?: () => void;
  selected?: boolean;
}

const agentIcons = {
  content: Pencil,
  music: Music,
  text: FileText,
} as const;

const statusConfig = {
  online: {
    color: "text-green-400",
    bgColor: "bg-green-400",
    label: "Online",
    glow: "shadow-[0_0_10px_rgba(74,222,128,0.4)]"
  },
  offline: {
    color: "text-neutral-500",
    bgColor: "bg-neutral-500",
    label: "Offline",
    glow: ""
  },
  busy: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-400",
    label: "Busy",
    glow: "shadow-[0_0_10px_rgba(250,204,21,0.4)]"
  },
} as const;

export function AgentCard({ name, type, status, onClick, selected }: AgentCardProps) {
  const IconComponent = agentIcons.content;
  const statusInfo = statusConfig[status];

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative cursor-pointer overflow-hidden group",
        "transition-all duration-300",
        "glass-card hover-glow",
        "p-5 space-y-4",
        "w-64 h-36",
        "hover:scale-[1.02]",
        selected && "ring-1 ring-white/30 scale-[1.02]"
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </div>

      <div className="relative flex items-start justify-between">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          "bg-white/10 border border-white/10",
          "group-hover:scale-110 group-hover:border-white/20",
          "transition-all duration-300"
        )}>
          <IconComponent className="h-6 w-6 text-white/80" />
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "relative flex h-3 w-3 items-center justify-center",
            status === 'online' && "animate-pulse"
          )}>
            <span className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-40",
              statusInfo.bgColor,
              status === 'online' && "animate-ping"
            )} />
            <span className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              statusInfo.bgColor,
              statusInfo.glow
            )} />
          </div>
          <span className={cn("text-xs font-medium", statusInfo.color)}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      <div className="relative">
        <h3 className="font-semibold text-base text-white group-hover:text-white transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {type.charAt(0).toUpperCase() + type.slice(1)} Agent
        </p>
      </div>

      {/* Bottom accent line */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-[2px]",
        "bg-gradient-to-r from-transparent via-white/20 to-transparent",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      )} />
    </Card>
  );
}