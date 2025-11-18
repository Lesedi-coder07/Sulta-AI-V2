"use client";

import { useState, useEffect, useRef } from "react";
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
    const [isNewChat, setIsNewChat] = useState<boolean>(true);
    const hasSentFirstMessage = useRef<boolean>(false);

    useEffect(() => {
        // Reset on component mount - this is a new chat session
        sessionStorage.setItem('isNewChat', 'true');
        hasSentFirstMessage.current = false;
        setIsNewChat(true);
    }, []);
 
    
    const agent = agentData;
    
    useEffect(() => {
        
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
        // Determine if this is a new chat based on whether we've sent the first message
        // If messages array only has the user's current message (length === 1), it's a new chat
        const isNewChatRequest = !hasSentFirstMessage.current;
        return {
          body: {
            system: systemMessage,
            messages: uiMessages,
            chatId: id,
            agentId: agent_id,
            newChat: isNewChatRequest,
          },
        };}
        }),
    });
    const { messages, sendMessage, status } = chatHook;

    const handleNewMessage = (message: string) => {
        // Check if this is the first message being sent
        const localIsNewChat = !hasSentFirstMessage.current;
        setIsNewChat(localIsNewChat);
        
        // Mark that we've sent the first message
        if (localIsNewChat) {
            hasSentFirstMessage.current = true;
            sessionStorage.setItem('isNewChat', 'false');
        }
        
        sendMessage({text : message});
    }
    const isStreaming = status === 'submitted' || status === 'streaming';
    
    useEffect(() => {
        console.log('Chat status:', status);
        console.log('Messages count:', messages.length);
        console.log('Is streaming:', isStreaming);
        
        // If messages exist and we haven't marked as sent, update the ref
        // This handles the case where messages might be loaded from elsewhere
        if (messages.length > 0 && !hasSentFirstMessage.current) {
            hasSentFirstMessage.current = true;
            setIsNewChat(false);
            sessionStorage.setItem('isNewChat', 'false');
        }
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




    const handleSidebarToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    }

    console.log(agentData)

    return (

        exists ?   (<div className="flex h-screen flex-col bg-neutral-50 dark:bg-neutral-900">
            <ChatHeader handleSidebarToggle={handleSidebarToggle} showImage={false} agent={agent} showButton={true} />
            <ChatMessages messages={messages} isLoading={isStreaming} />
            <ChatInput sendMessage={(message: string) => handleNewMessage(message)} />
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