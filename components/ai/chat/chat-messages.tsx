"use client"
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
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
  updateMessageArray
}: {
  messages: Message[];
  loadingState: boolean;
  profileImage: string | null;
  updateMessageArray: any
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
    if (messages[messages.length -1]?.role === 'user') {
      // Find the messages container and scroll it
      const messagesContainer = messagesEndRef.current?.closest('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-7 pt-5 px-8 pb-36 h-full messages-container">

      
      <div className="space-y-4">



        {messages.length === 0 ? (
          <>
            <h1 className="text-xl text-center">
              Welcome to Xev 1.0
            </h1>
            <div className="text-center">
              <GradientText> How can I help you today? </GradientText>
            </div>
            <div className="flex flex-row flex-wrap gap-2 justify-center mx-auto">
              {promptSuggestions.map((prompt) => (
                <Card 
                  key={prompt.suggestion}
                  className="w-[10rem] hover:shadow-blue-600 cursor-pointer" 
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
              "flex w-fit gap-3 rounded-lg p-6 sm:p-3 lg:p-2 shadow-sm md:w-fit",
              message.role === "user"
                ? "flex-row-reverse bg-blue-600 lg:max-w-[50vw] max-w-[80vw] sm:w-fit ml-auto"
                : "bg-white dark:bg-neutral-800 text-lg"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 max-w-10 shrink-0 select-none items-center justify-center rounded-full",
                message.role === "user"
                  ? "bg-white text-white"
                  : "bg-blue-600 text-white"
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
                <Bot className="h-5 w-5" />
              )}
            </div>
            <div className="w-fit max-w-[500px] sm:max-w-[80%] flex-1">
              {message.role != "user" ? <GeminiResponse content={message.content} /> : <p className="text-white mb-2">{message.content}</p>}
            </div>
          </div> </>
        ))}

        {loadingState && <div className="flex w-full gap-3 ml-4 rounded-lg p-4 ">
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full  text-primary">
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
      className='text-xl font-medium [--base-color:theme(colors.blue.600)] [--base-gradient-color:theme(colors.blue.200)] dark:[--base-color:theme(colors.blue.700)] dark:[--base-gradient-color:theme(colors.blue.400)]'
    >
      {text}
    </TextShimmer>
  );
}

export default {
TextShimmerColor
}
