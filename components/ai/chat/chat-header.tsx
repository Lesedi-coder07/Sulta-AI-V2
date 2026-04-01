import { Button } from "@/components/ui/button";
import { Bot, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home } from "lucide-react";

interface ChatHeaderProps {
  agent: any;
  showButton: boolean;
  showImage: boolean;
  handleSidebarToggle: () => void;
}

export function ChatHeader({ agent, showButton, showImage, handleSidebarToggle }: ChatHeaderProps) {
  return (
    <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/6 bg-[#141414]/90 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Left side - Back button */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg px-2.5 text-white/40 transition-colors hover:bg-white/6 hover:text-white/80"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline text-xs">Dashboard</span>
              <Home className="h-3.5 w-3.5 sm:hidden" />
            </Button>
          </Link>
        </div>

        {/* Center - Agent identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/6 border border-white/10">
            <Bot className="h-3.5 w-3.5 text-white/60" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-medium text-white/90 truncate leading-none">
              {agent?.name}
            </h1>
          </div>
        </div>

        {/* Right side - New chat button */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg px-2.5 text-white/40 transition-colors hover:bg-white/6 hover:text-white/80"
            onClick={() => window.location.reload()}
            title="Start new chat"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline text-xs">New Chat</span>
          </Button>
        </div>
      </div>

      {/* Logo - optional */}
      {showImage && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Image
            src={'/logos/Sulta/logoLight.png'}
            alt="Sulta AI Logo"
            width={72}
            height={24}
            priority
          />
        </div>
      )}
    </div>
  );
}
