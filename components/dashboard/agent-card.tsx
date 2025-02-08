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

const statusColors = {
  online: "text-green-500",
  offline: "text-neutral-500",
  busy: "text-yellow-500",
} as const;

export function AgentCard({ name, type, status, onClick, selected }: AgentCardProps) {
  const IconComponent = agentIcons.content;
  console.log(name, type, status)

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-all hover:shadow-md",
        "border border-neutral-200 dark:border-neutral-800",
        selected && "border-primary dark:border-primary",
        "p-4 space-y-3"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          "bg-neutral-100 dark:bg-neutral-800"
        )}>
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <CircleDot className={cn("h-4 w-4", statusColors[status])} />
      </div>

      <div>
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          {name}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {type.charAt(0).toUpperCase() + type.slice(1)} Agent
        </p>
      </div>
    </Card>
  );
}