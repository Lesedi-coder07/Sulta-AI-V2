"use client"
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({
  messages,
  loadingState,
  profileImage
}: {
  messages: Message[];
  loadingState: boolean;
  profileImage: string | null;
}) {


  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-fit gap-3 rounded-lg p-4 shadow-sm md:w-fit",
              message.role === "user"
                ? "flex-row-reverse bg-[#444]   ml-auto" 
                : "bg-white dark:bg-neutral-800 text-lg"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
                message.role === "user"
                  ? "bg-neutral-500 text-white"
                  : "bg-blue-600 text-white"
              )}
            >
              {message.role === "user" ? (
                <img 
                  src={profileImage ? profileImage : `/icons/user-profile-icon.jpg`} 
                  alt={profileImage ? 'User Profile Picture' : 'generic'}
                  className="h-[80%]  w-[80%] rounded-full object-cover"
                />
              ) : (
                <Bot className="h-5 w-5" />
              )}
            </div>
            <div className="w-fit max-w-[500px] flex-1">
              <p
                className={cn(
                  "text-sm w-fit max-w-[500px]",
                  message.role === "user"
                    ? "text-white dark:text-neutral-300"
                    : "text-neutral-800 dark:text-neutral-200"
                )}
              >
                {message.content}
      
              </p>
              {/* <p className="text-xs text-neutral-500">{message.timestamp}</p> */}
            </div>
          </div>
        ))}

        {loadingState && <div className="flex w-full gap-3 rounded-lg p-4 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="flex space-x-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce"></span>
            </span>
          </div>
        </div>}
      </div>
    </div>
  );
}