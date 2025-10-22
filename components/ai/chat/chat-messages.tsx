"use client"
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, Sparkles, Copy } from "lucide-react";
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
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy"}
      className={`ml-2 p-1 rounded transition-colors duration-150 ${
        copied
          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
          : "hover:bg-neutral-200 dark:hover:bg-neutral-700"
      }`}
      style={{ lineHeight: 0, verticalAlign: "middle" }}
      aria-label="Copy message"
    >
      <Copy className={`w-4 h-4 ${copied ? "text-green-600" : ""}`} />
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

  return (
    <div className="flex-1 overflow-y-auto mb-7 mt-35 sm:mb-[180px] md:mt-10  pt-5 px-8 pb-36 h-full messages-container bg-white dark:bg-neutral-900">
  

  {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      {/* <div className="space-y-4">
        {messages.length === 0 ? (
          <>
            <h1 className="text-xl text-center text-neutral-900 dark:text-neutral-100">
              Welcome to Sulta AI
            </h1>
            <div className="text-center">
              <GradientText> How can I help you today? </GradientText>
            </div>
            <div className="flex flex-row flex-wrap gap-2 justify-center mx-auto">
              {promptSuggestions.map((prompt) => (
                <Card 
                  key={prompt.suggestion}
                  className="w-[10rem] hover:shadow-blue-600 cursor-pointer dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700" 
                  onClick={() => updateMessageArray(prompt.suggestion)}
                >
                  <CardContent className="mt-8">
                    <p className="text-sm">{prompt.suggestion}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : null}

        {orderedMessages.map((message) => (
          <> 
          {message.image ? (
            <div key={message.image} className={`flex flex-row ${message.role === "user" ? "justify-end pr-6 md:pr-16 lg:pr-24 xl:pr-40" : "justify-center mr-12"}`}>
              <img className={`w-[300px] h-[300px] rounded-sm ${message.role === "user" ? "right-0" : "left-0"} cover`} src={message.image} alt="AI Photo" />
            </div>
          ) : <></>}
          <div
            key={message.id}
            className={cn(
              "flex gap-3 rounded-lg sm:p-3 lg:p-2",
              message.role === "user"
                ? "flex-row-reverse bg-blue-600 mt-10 dark:bg-blue-700 lg:max-w-[50vw] px-4 py-7 max-w-[80vw] sm:w-fit ml-auto mr-6 md:mr-16 lg:mr-24 xl:mr-40 w-fit shadow-sm"
                : "bg-none  dark:bg-none  pt-10 mt-10 text-lg w-full md:w-[80%] lg:w-[70%] mx-auto px-4"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 max-w-10 shrink-0 select-none items-center justify-center rounded-full",
                message.role === "user"
                  ? "bg-none text-white"
                  : "bg-none hidden -600 dark:bg-none text-white"
              )}
            >
              {message.role === "user" ? (
                <Image
                  src={profileImage ? profileImage : `/icons/user-profile-icon.jpg`}
                  alt={profileImage ? 'User Profile Picture' : 'generic'}
                  className="h-[80%] w-[80%] rounded-full object-cover"
                  width={32}
                  height={32}
                />
              ) : (
                <> </>
              )}
            </div>
            <div className="w-full sm:w-fit max-w-[500px] sm:max-w-[80%] flex-1 relative">
              {message.role != "user" ? (
                <div className="group">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <GeminiResponse content={message.content} />
                    </div> <br />
                    <div className="ml-1 mt-1 opacity-70 group-hover:opacity-100 transition-opacity duration-150">
                      <CopyButton textToCopy={message.content} />
                    </div>
                  </div>
                  {/* {message.image.imageUrl  ? <img className="w-[120px] h-[120px] rounded-sm right-0 cover" src={message.image} alt="AI Photo" /> : <> </>} 
                </div>
              ) : 
                <p className="text-white mb-2 px-2 my-auto">{message.content}</p>
              }
            </div>
          </div>
          </>
        ))}

        {loadingState && <div className="flex justify-center w-full gap-3 ml-4 rounded-lg p-4 ">
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-primary dark:text-blue-400">
             <span className="flex space-x-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce"></span>
            </span> 

            <TextShimmerColor text="Thinking..." />
            <div ref={messagesEndRef} />
          </div>
        </div>}
      </div> 
      */}
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
