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
    <div className="fixed top-0 left-0 z-40 right-0 border-b border-neutral-200 bg-white/80 backdrop-blur-md px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left side - Back button */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Dashboard</span>
              <Home className="h-4 w-4 sm:hidden" />
            </Button>
          </Link>
        </div>

        {/* Center - Agent name */}
        <h1 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[40%]">
          {agent?.name}
        </h1>

        {/* Right side - New chat button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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