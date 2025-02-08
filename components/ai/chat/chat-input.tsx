"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="flex items-end gap-4 pb-[env(safe-area-inset-bottom)]">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[20px] max-h-[200px] rounded-none resize-none bg-neutral-100 dark:bg-neutral-800"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0 bg-blue-600 hover:bg-primary/90"
            disabled={!message.trim()}
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  );
}