"use client";

import { useState, useEffect } from "react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Message } from "@/types/chat";
import { auth } from '@/app/api/firebase/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Agent } from "@/types/agent";
import { generateSystemMessage } from "@/app/ai/create/generateSystemMessage";

export interface ChatAgent extends Agent {
    isPublic: boolean;
    ownerID?: string;
    systemMessage?: string;
    totalQueries?: number;
    tokensUsed?: number;
    totalChats?: number;
    name: string;
}

interface ChatInterfaceProps {
    agent_id: string;
    agentData: ChatAgent;
}

export function ChatInterface({ agent_id, agentData }: ChatInterfaceProps) {
   
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [exists, setExists] = useState<false | true>(true);
    const [profileImage, setProfileImage ] = useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    // Use the agentData passed from server-side
    const agent = agentData;

    useEffect(() => {
        // Check if user has access to the agent
        if (agent && !agent.isPublic && agent.ownerID !== currentUser) {
            setExists(false);
        } else {
            setExists(true);
        }
    }, [agent, currentUser])


    const systemMessage = generateSystemMessage(agentData.name, agentData?.description ?? '', agentData.type, agentData.personality, agentData.tone, agentData.expertise);

    const chatHook = useChat({
        transport: new DefaultChatTransport({

        prepareSendMessagesRequest({ messages: uiMessages, id }) {
        return {
          body: {
            system: systemMessage,
            messages: uiMessages,
            chatId: id,
          },
        };}
        }),
    });

    const { messages, sendMessage, status } = chatHook;

    // Use the built-in status from useChat instead of manual tracking
    // status can be: 'submitted', 'streaming', 'ready', or 'error'
    const isStreaming = status === 'submitted' || status === 'streaming';
    
    useEffect(() => {
        console.log('Chat status:', status);
        console.log('Messages count:', messages.length);
        console.log('Is streaming:', isStreaming);
    }, [status, messages.length, isStreaming]);

  

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user.email);
                setProfileImage(user.photoURL)
            } else {
                setCurrentUser(null);
            }
        })
        return () => unsubscribe()
    }, []);




    // const handleSendMessage = async (content: string, base64String: string | null, image: string | null, docUrl: string | null, powerUpSelected: string | null) => {
    //   console.log(agent?.systemMessage)

    //     setLoading(true)
    //     const userMessage: Message = {
    //         id: Date.now().toString(),
    //         role: "user",
    //         content,
    //         timestamp: "just now",
    //         image: null
    //     };
    //     setMessages((prev) => [...prev, userMessage]);

        

    //     try {
          
    
    //         const aiMessage = await generateWithGemini(messages, agent?.systemMessage ?? 'You are a helpful AI agent.', content, auth.currentUser?.displayName ?? '');
    //         setLoading(false)
    //         setMessages((prev) => [...prev, {
    //             id: (Date.now() + 1).toString(),
    //             role: "assistant",
    //             content: aiMessage.response,
    //             timestamp: "just now",
    //             image: aiMessage.imageUrl?.imageUrl ?? null,
    //             docUrl: null
    //         }]);
    
    //     } catch (error) {
    //         console.error(error);
    //         // You might want to show an error message to the user here
    //     }
    //     setLoading(false)
       
    // };

    const handleSidebarToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    }

    console.log(agentData)

    return (

        exists ?   (<div className="flex h-screen flex-col bg-neutral-50 dark:bg-neutral-900">
            <ChatHeader handleSidebarToggle={handleSidebarToggle} showImage={false} agent={agent} showButton={true} />
            <ChatMessages messages={messages} isLoading={isStreaming} />
            <ChatInput sendMessage={(message: string) => sendMessage({text : message})} />
        </div> ) : <h1 className="text-center mt-36 text-4xl font-bold">Agent not found <br /></h1>
    );
      
}

export const generateWithGemini = async (messages: Array<Message>, systemMessage: string, prompt: string, userName: string, base64String: string | null = null, docUrl: string | null = null, powerUpSelected: string | null = null): Promise<{response: string, imageUrl: {imageUrl: string} | null}> => {
    try {
        const ai = await fetch('/api/LLM/gemini', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                history: messages.map(message => ({
                  ...message,
                  role: message.role === 'assistant' ? 'model' : message.role
                })),
                currentUser: userName,
                prompt: prompt,
                systemMessage: systemMessage,
                base64String: base64String,
                docUrl: docUrl,
                powerUpSelected: powerUpSelected
            })
        });
        const data = await ai.json();
        return data;
    } catch (error) {
        throw error;
    }
}