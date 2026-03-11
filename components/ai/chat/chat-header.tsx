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
    <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#03060D]/80 px-4 py-3 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left side - Back button */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-full px-3 transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Dashboard</span>
              <Home className="h-4 w-4 sm:hidden" />
            </Button>
          </Link>
        </div>

        {/* Center - Agent name */}
        <h1 className="max-w-[40%] truncate text-base font-semibold text-slate-100 sm:text-lg">
          {agent?.name}
        </h1>

        {/* Right side - New chat button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-full px-3 transition-colors hover:bg-white/10"
            onClick={() => window.location.reload()}
            title="Start new chat"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">New Chat</span>
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
