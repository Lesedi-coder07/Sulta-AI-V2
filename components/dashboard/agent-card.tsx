"use client";

import { Bot, Music, FileText, Pencil, CircleDot, Headphones, Code2, Globe, MessageCircle } from "lucide-react";
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

const agentIcons: Record<string, React.ElementType> = {
  content: Pencil,
  music: Music,
  text: FileText,
  'customer support': Headphones,
  support: Headphones,
  code: Code2,
  web: Globe,
  chat: MessageCircle,
};

const getAgentIcon = (type: string): React.ElementType => {
  const key = type.toLowerCase();
  return agentIcons[key] ?? Bot;
};

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
  const IconComponent = getAgentIcon(type);
  const statusInfo = statusConfig[status];

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative cursor-pointer overflow-hidden group",
        "transition-colors duration-200",
        "bg-card border-border/60",
        "p-4 flex flex-col justify-between",
        "h-32",
        "hover:border-border",
        selected && "border-white/30 bg-white/5"
      )}
    >
      {/* Top section: Icon and Status */}
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/6 border border-white/8">
          <IconComponent className="h-4 w-4 text-white/70" />
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex h-2 w-2 items-center justify-center">
            <span className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-40",
              statusInfo.bgColor,
              status === 'online' && "animate-ping"
            )} />
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", statusInfo.bgColor)} />
          </div>
          <span className={cn("text-xs", statusInfo.color)}>{statusInfo.label}</span>
        </div>
      </div>

      {/* Bottom section: Name + type */}
      <div className="space-y-0.5">
        <h3 className="font-medium text-sm text-white/90 truncate">{name}</h3>
        <p className="text-xs text-muted-foreground capitalize truncate">{type}</p>
      </div>
    </Card>
  );
}