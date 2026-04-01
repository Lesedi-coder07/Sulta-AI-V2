"use client"
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { Copy, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GeminiResponse from "./gemini-responses";
import { Card, CardContent } from "@/components/ui/card";
import { TextShimmer } from '@/components/ui/text-shimmer';
import { UIMessage } from "ai";



function CopyButton({ textToCopy }: { textToCopy: string }) {
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
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy"}
      className={cn(
        "p-1.5 rounded-md transition-all duration-150",
        copied
          ? "bg-emerald-500/15 text-emerald-300"
          : "text-slate-500 hover:bg-white/10 hover:text-slate-200"
      )}
      aria-label="Copy message"
    >
      <Copy className={cn("h-3.5 w-3.5", copied && "text-emerald-300")} />
    </button>
  );
}



export function ChatMessages({
  messages,
  isLoading = false,
  messageImages = {},
  agentName,
}: {
  messages: UIMessage[];
  isLoading?: boolean;
  messageImages?: Record<string, string>;
  agentName?: string;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  // Only scroll to bottom when a new message is added, not during streaming updates
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      scrollToBottom();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  // Debug: log loading state and messages
  useEffect(() => {
    logger.log('ChatMessages - isLoading:', isLoading);
    logger.log('ChatMessages - messages count:', messages.length);
    logger.log('ChatMessages - last message role:', messages[messages.length - 1]?.role);
  }, [isLoading, messages]);

  // Extract text content from message parts
  const getMessageContent = (message: UIMessage): string => {
    return message.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');
  };

  // Extract image parts from message
  const getMessageImages = (message: UIMessage): string[] => {
    return message.parts
      .filter(part => part.type === 'file' && part.mediaType?.startsWith('image/'))
      .map(part => (part as any).url);
  };

  return (
    <div className="messages-container h-full flex-1 overflow-y-auto bg-transparent px-4 pb-36 pt-[100px] md:px-8 md:pt-16 sm:mb-[180px]">
      <div className="max-w-4xl mx-auto space-y-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="text-center space-y-3 max-w-sm">
              <h2 className="text-xl font-medium text-white/90">
                {agentName ? `Hi, I'm ${agentName}` : 'Hello!'}
              </h2>
              <p className="text-sm text-white/35 leading-relaxed">
                Ask me anything — I&apos;m here to help.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const content = getMessageContent(message);
              const images = getMessageImages(message);
              const isUser = message.role === 'user';
              // Also check for images passed via messageImages prop
              const externalImage = messageImages[message.id];

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 group",
                    isUser ? "flex-row-reverse" : "flex-row",
                    index === 0 && "mt-4 sm:mt-0"
                  )}
                >
                  {/* Avatar - only show for user */}
                  {isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-1 bg-white/8 border border-white/10">
                      <User className="w-3.5 h-3.5 text-white/50" />
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={cn(
                    "flex flex-col gap-2",
                    isUser ? "max-w-[85%] md:max-w-[75%] lg:max-w-[65%] items-end" : "flex-1"
                  )}>
                    {/* Image attachments - from message parts or external prop */}
                    {(images.length > 0 || externalImage) && (
                      <div className="flex flex-wrap gap-2">
                        {externalImage && (
                          <img
                            src={externalImage}
                            alt="Uploaded image"
                            className="max-w-[200px] max-h-[200px] rounded-lg object-cover shadow-sm"
                          />
                        )}
                        {images.map((imageUrl, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={imageUrl}
                            alt={`Uploaded image ${imgIndex + 1}`}
                            className="max-w-[200px] max-h-[200px] rounded-lg object-cover shadow-sm"
                          />
                        ))}
                      </div>
                    )}
                    <div
                      className={cn(
                        "transition-all duration-200",
                        isUser
                          ? "rounded-2xl rounded-tr-sm px-4 py-2.5 bg-white/8 border border-white/10 text-white"
                          : "w-full rounded-2xl rounded-tl-sm px-4 py-3"
                      )}
                    >
                      {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-white/90">
                          {content}
                        </p>
                      ) : (
                        <div className="relative w-full">
                          <div className="pr-8 text-sm leading-[1.8] text-white/80">
                            <GeminiResponse content={content || ''} />
                          </div>
                          {content && content.trim().length > 0 && (
                            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                              <CopyButton textToCopy={content} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Timestamp - optional, can be added if message has timestamp */}
                  </div>
                </div>
              );
            })}

            {/* Show thinking indicator when loading */}
            {isLoading && (
              <div className="flex gap-3 group">
                <div className="flex flex-col flex-1">
                  <div className="inline-flex w-fit rounded-2xl rounded-tl-sm px-4 py-3">
                    <TextShimmerColor text="Thinking..." />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
}

function TextShimmerColor({ text }: { text: string }) {
  return (
    <TextShimmer
      duration={1.2}
      className='text-sm font-medium [--base-color:theme(colors.white/30)] [--base-gradient-color:theme(colors.white/80)]'
    >
      {text}
    </TextShimmer>
  );
}

export default {
  TextShimmerColor
}
