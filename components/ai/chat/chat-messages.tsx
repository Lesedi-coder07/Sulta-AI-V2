"use client";

import { cn } from "@/lib/utils";
import { Bot, Sparkles, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UIMessage } from "ai";

const promptSuggestions = [
  {
    suggestion: "What are some effective ways to reduce stress and anxiety?",
  },
  {
    suggestion: "Help me plan a balanced weekly meal schedule",
  },
  {
    suggestion: "Give me tips for improving my public speaking skills",
  },
];

type MessagePart = UIMessage["parts"][number];

function isTextPart(part: MessagePart): part is Extract<MessagePart, { type: "text" }> {
  return part.type === "text";
}

function CopyButton({ textToCopy, className }: { textToCopy: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy"}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full border border-transparent p-1 text-neutral-500 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-300 dark:focus-visible:ring-offset-neutral-900",
        copied
          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
          : "bg-white/90 hover:bg-white dark:bg-neutral-900/80 dark:hover:bg-neutral-800",
        className,
      )}
      aria-label="Copy message"
    >
      <Copy className={cn("h-3.5 w-3.5", copied ? "text-green-600" : "")} />
    </button>
  );
}

export function ChatMessages({
  messages,
}: {
  messages: UIMessage[];
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-28 pt-6 sm:px-8 md:px-16">
      {hasMessages ? (
        <div className="flex flex-col gap-5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const textParts = message.parts.filter(isTextPart);
  const copyableText = textParts.map((part) => part.text).join("\n\n").trim();

  return (
    <div className={cn("flex w-full gap-3 sm:gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-md dark:bg-blue-500">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className="flex max-w-[85%] flex-col gap-1 sm:max-w-[70%]">
        <div
          className={cn(
            "group relative inline-flex w-fit max-w-full flex-col gap-2 rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ring-1 ring-transparent transition-all sm:text-base",
            isUser
              ? "ml-auto bg-blue-600 text-white shadow-blue-500/40"
              : "bg-neutral-100 text-neutral-900 shadow-neutral-300/60 dark:bg-neutral-800 dark:text-neutral-100",
          )}
        >
          {textParts.length > 0 ? (
            textParts.map((part, index) => (
              <p key={`${message.id}-${index}`} className="whitespace-pre-wrap text-left">
                {part.text}
              </p>
            ))
          ) : (
            <p className="text-xs italic text-neutral-500 dark:text-neutral-400">
              This message cannot be displayed yet.
            </p>
          )}

          {!isUser && copyableText && (
            <CopyButton
              textToCopy={copyableText}
              className="absolute -bottom-3 -right-3 hidden h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-md outline-none transition group-hover:inline-flex dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
            />
          )}
        </div>

        <span
          className={cn(
            "mt-1 text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500",
            isUser ? "text-right" : "text-left",
          )}
        >
          {isUser ? "You" : "Sulta AI"}
        </span>
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-inner dark:bg-blue-900/40 dark:text-blue-300">
          <Sparkles className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 py-12 text-center text-neutral-500 dark:text-neutral-400">
      <div className="rounded-full bg-blue-50 p-3 text-blue-500 shadow-sm dark:bg-blue-900/30 dark:text-blue-200">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Welcome to Sulta AI
        </h2>
        <p className="text-sm leading-relaxed">
          Ask anything that is on your mind or try one of these suggested prompts.
        </p>
      </div>
      <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
        {promptSuggestions.map((prompt) => (
          <Card
            key={prompt.suggestion}
            className="border border-transparent bg-white/80 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md dark:bg-neutral-800/60 dark:hover:border-blue-500/40"
          >
            <CardContent className="p-4 text-sm font-medium leading-relaxed">
              {prompt.suggestion}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
