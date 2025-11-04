"use client"
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, Sparkles, Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import GeminiResponse from "./gemini-responses";
import { Card, CardContent } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { TextShimmer } from '@/components/ui/text-shimmer';
import { UIMessage } from "ai";

interface ChatMessagesProps {
  messages: Message[];
}

const promptSuggestions = [
  {
    suggestion: 'What are some effective ways to reduce stress and anxiety?'
  },
  {
    suggestion: 'Help me plan a balanced weekly meal schedule'
  },
  {
    suggestion: 'Give me tips for improving my public speaking skills'
  },
]

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy to clipboard"}
      className={cn(
        "p-1.5 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100",
        copied
          ? "bg-green-500/10 text-green-600 dark:text-green-400"
          : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
      )}
      aria-label="Copy message"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export function ChatMessages({
  messages,
}: {
  messages: UIMessage[];
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end',
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Extract text content from message parts
  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter(part => part.type === 'text')
      .map(part => ('text' in part ? part.text : ''))
      .join('');
  };

  return (
    <div className="flex-1 overflow-y-auto mb-7 sm:mb-[180px] pt-5 px-4 sm:px-6 md:px-8 pb-36 h-full messages-container bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      {/* Welcome Screen */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
            Welcome to Sulta AI
          </h1>
          <p className="text-lg text-center text-neutral-600 dark:text-neutral-400 mb-10">
            How can I help you today?
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-4xl">
            {promptSuggestions.map((prompt) => (
              <Card 
                key={prompt.suggestion}
                className="group cursor-pointer border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200" 
              >
                <CardContent className="p-4">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {prompt.suggestion}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => {
          const messageText = getMessageText(message);
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full",
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-md"
                      : "bg-gradient-to-br from-purple-500 to-pink-600 shadow-md"
                  )}
                >
                  {message.role === "user" ? (
                    <div className="text-white font-semibold text-sm">U</div>
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className={cn(
                "flex-1 max-w-[85%] sm:max-w-[75%]",
                message.role === "user" ? "flex justify-end" : ""
              )}>
                <div className="group relative">
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 shadow-sm",
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm"
                        : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-tl-sm"
                    )}
                  >
                    {message.role === "user" ? (
                      <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                        {message.parts.map((part, i) => {
                          if (part.type === 'text') {
                            return <span key={`${message.id}-${i}`}>{part.text}</span>;
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <GeminiResponse content={messageText} />
                      </div>
                    )}
                  </div>
                  
                  {/* Copy Button - Only for AI messages */}
                  {message.role === "assistant" && (
                    <div className="absolute -top-2 -right-2">
                      <CopyButton textToCopy={messageText} />
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className={cn(
                    "text-xs text-neutral-500 dark:text-neutral-500 mt-1 px-1",
                    message.role === "user" ? "text-right" : "text-left"
                  )}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll anchor */}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}

function TextShimmerColor({text}: {text: string}) {
  return (
    <TextShimmer
      duration={1.2}
      className='text-xl font-medium [--base-color:theme(colors.blue.600)] [--base-gradient-color:theme(colors.blue.200)] dark:[--base-color:theme(colors.blue.500)] dark:[--base-gradient-color:theme(colors.blue.300)]'
    >
      {text}
    </TextShimmer>
  );
}

export default {
  TextShimmerColor
}
