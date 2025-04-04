"use client"
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import GeminiResponse from "./gemini-responses";
import { Card, CardContent } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { TextShimmer } from '@/components/ui/text-shimmer';

interface ChatMessagesProps {
  messages: Message[];

}

const promptSuggestions = [
  {
    suggestion: 'How can I increase sales this month?'
  },
  {
    suggestion: 'Explain trigonometry for beginners'
  },
  {
    suggestion: 'Write a simple python script calculator '
  },
 
]

export function ChatMessages({
  messages,
  loadingState,
  profileImage,
  updateMessageArray,
  agentName
}: {
  messages: Message[];
  loadingState: boolean;
  profileImage: string | null;
  updateMessageArray: any;
  agentName: string;
}) {


  const messageReversed = messages.reverse();

  const orderedMessages = [...messages].sort((a, b) => {
    return Number(a.id) - Number(b.id);
  });


  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end',
    });
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user') {
      const messagesContainer = messagesEndRef.current?.closest('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-7 mt-40 sm:mb-[180px] md:mt-10  pt-5 px-8 pb-36 h-full messages-container bg-white dark:bg-neutral-900">

      
      <div className="space-y-4">



        {messages.length === 0 ? (
          <>
            <h1 className="text-xl text-center text-neutral-900 dark:text-neutral-100">
              Welcome to {agentName}
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
          {message.image ? ( <div key={message.image} className="flex flex-row-reverse"> <img className="w-[120px] h-[120px] rounded-sm right-0 cover" src={message.image} alt="AI Photo" /> </div> ) : <> </>}
        
          <div
            key={message.id}
            className={cn(
              "flex gap-3 rounded-lg sm:p-3 lg:p-2",
              message.role === "user"
                ? "flex-row-reverse bg-blue-600 mt-10 dark:bg-blue-700 lg:max-w-[50vw] px-1 py-7 max-w-[80vw] sm:w-fit ml-auto w-fit shadow-sm"
                : "bg-neutral-100 dark:bg-neutral-800 mt-10 text-lg w-full md:w-[80%] lg:w-[70%] mx-auto"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 max-w-10 shrink-0 select-none items-center justify-center rounded-full",
                message.role === "user"
                  ? "bg-white text-white"
                  : "bg-blue-600 dark:bg-blue-500 text-white"
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
                <Sparkles className="h-5 w-5" />
              )}
            </div>
            <div className="w-fit max-w-[500px] sm:max-w-[80%] flex-1">
              {message.role != "user" ? <GeminiResponse content={message.content} /> : <p className="text-white mb-2">{message.content}</p>}
            </div>
          </div> </>
        ))}

        {loadingState && <div className="flex justify-center w-full gap-3 ml-4 rounded-lg p-4 ">
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-primary dark:text-blue-400">
            {/* <span className="flex space-x-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce"></span>
            </span> */}

            <TextShimmerColor text="Thinking..." />
            <div ref={messagesEndRef} />
          </div>
        </div>}

        
      </div>
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
