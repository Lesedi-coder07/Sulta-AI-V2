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
import { generateSystemMessage } from "@/app/(ai)/create/generateSystemMessage";
import { logger } from "@/lib/logger";

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
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [thinkEnabled, setThinkEnabled] = useState<boolean>(agentData.extendedThinking || false);

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

    // Track agent usage in localStorage
    useEffect(() => {
        if (agent_id && typeof window !== 'undefined') {
            localStorage.setItem('lastUsedAgentId', agent_id);
        }
    }, [agent_id]);


    // Use custom system prompt if provided, otherwise generate one
    const systemMessage = agentData.customSystemPrompt || generateSystemMessage(
        agentData.name, 
        agentData?.description ?? '', 
        agentData.type, 
        agentData.personality, 
        agentData.tone, 
        agentData.expertise
    );

    // Add guardrails to system message - always include identity protection
    const identityGuardrail = "Do NOT mention you are an LLM, AI model, or that you were trained by Google. Stay in character and stick to the role/persona you've been given.";
    const customGuardrails = agentData.guardrails ? `\n${agentData.guardrails}` : '';
    const systemMessageWithGuardrails = `${systemMessage}\n\n**IMPORTANT RESTRICTIONS:**\n${identityGuardrail}${customGuardrails}`;

    logger.log('System message with guardrails:', systemMessageWithGuardrails);
    const chatHook = useChat({
        body: {
            system: systemMessageWithGuardrails,
        },
        onError: (error: Error) => {
            console.error('=== Chat Hook Error ===');
            console.error('Chat error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
            });
        },
        onFinish: (message: any) => {
            logger.log('Message finished streaming:', message);
        },
    } as any);

    const { messages, sendMessage, status, error } = chatHook;

    // Use the built-in status from useChat instead of manual tracking
    // status can be: 'submitted', 'streaming', 'ready', or 'error'
    const isStreaming = status === 'submitted' || status === 'streaming';

    useEffect(() => {
        logger.log('Chat status:', status);
        logger.log('Messages count:', messages.length);
        logger.log('Is streaming:', isStreaming);
        if (error) {
            logger.error('Chat hook error:', error);
        }
    }, [status, messages.length, isStreaming, error]);

    // Simple wrapper to log message sending
    const handleSendMessage = (message: string) => {
        logger.log('Sending message:', message);
        logger.log('System message:', systemMessage.substring(0, 100));
        sendMessage({ text: message });
    };



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

    logger.log(agentData)

    return (

        exists ? (<div className="flex h-screen flex-col bg-neutral-50 dark:bg-neutral-900">
            <ChatHeader handleSidebarToggle={handleSidebarToggle} showImage={false} agent={agent} showButton={true} />
            <ChatMessages messages={messages} isLoading={isStreaming} agentName={agentData.name} />
            <ChatInput sendMessage={handleSendMessage} onThinkToggle={setThinkEnabled} thinkEnabled={thinkEnabled} />
        </div> ) : <h1 className="text-center mt-36 text-4xl font-bold">Agent not found <br /></h1>
    );

}

export const generateWithGemini = async (messages: Array<Message>, systemMessage: string, prompt: string, userName: string, base64String: string | null = null, docUrl: string | null = null, powerUpSelected: string | null = null): Promise<{ response: string, imageUrl: { imageUrl: string } | null }> => {
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