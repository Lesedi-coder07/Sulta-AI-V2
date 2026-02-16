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
    const [messageImages, setMessageImages] = useState<Record<string, string>>({});
    
    // Refs for transport to access current values
    const pendingImage = useRef<string | null>(null);
    const pendingImageForDisplay = useRef<string | null>(null);
    const thinkEnabledRef = useRef<boolean>(agentData.extendedThinking || false);
    
    // Keep thinkEnabledRef in sync with state
    useEffect(() => {
        thinkEnabledRef.current = thinkEnabled;
    }, [thinkEnabled]);

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

    const normalizedExpertise = Array.isArray(agentData.expertise)
        ? agentData.expertise.join(', ')
        : agentData.expertise;
    const normalizedExtraContext = (agentData.extraContext || '').trim();

    // Build a base system prompt first, then always append agent context.
    const baseSystemMessage = agentData.customSystemPrompt || generateSystemMessage(
        agentData.name, 
        agentData?.description ?? '', 
        agentData.type, 
        agentData.personality, 
        agentData.tone, 
        normalizedExpertise,
        '',
    );
    const contextAppendix = normalizedExtraContext
        ? `\n\n**Agent Context (Knowledge Base):**\n${normalizedExtraContext}`
        : '';
    const systemMessage = `${baseSystemMessage}${contextAppendix}`;

    // Add guardrails to system message - always include identity protection
    const identityGuardrail = "Do NOT mention you are an LLM, AI model, or that you were trained by Google. Stay in character and stick to the role/persona you've been given.";
    const customGuardrails = agentData.guardrails ? `\n${agentData.guardrails}` : '';
    const systemMessageWithGuardrails = `${systemMessage}\n\n**IMPORTANT RESTRICTIONS:**\n${identityGuardrail}${customGuardrails}`;

    logger.log('System message with guardrails:', systemMessageWithGuardrails);
    const chatHook = useChat({
        transport: new DefaultChatTransport({
            prepareSendMessagesRequest({ messages: uiMessages, id }) {
                // This is a new chat only if there are no messages yet
                // (uiMessages will contain the message being sent, so check if length is 1)
                const isNewChatRequest = uiMessages.length === 1;
                const imageToSend = pendingImage.current;
                // Clear the pending image after capturing it for the request
                pendingImage.current = null;
                return {
                    body: {
                        system: systemMessageWithGuardrails,
                        messages: uiMessages,
                        chatId: id,
                        agentId: agent_id,
                        newChat: isNewChatRequest,
                        imageBase64: imageToSend,
                        thinkEnabled: agentData.extendedThinking || thinkEnabledRef.current,
                        llmConfig: agentData.llmConfig,
                    },
                };
            }
        }),
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
    });

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

    // Wrapper to handle message sending with optional image
    const handleSendMessage = (message: string, imageBase64?: string | null) => {
        logger.log('Sending message:', message);
        logger.log('Has image:', !!imageBase64);
        logger.log('System message:', systemMessage.substring(0, 100));
        
        // Store the image in the ref so it can be picked up by the transport
        if (imageBase64) {
            pendingImage.current = imageBase64;
            pendingImageForDisplay.current = imageBase64;
        }
        
        sendMessage({ text: message });
        
        // After sending, associate the image with the message for display
        // We use a timeout to ensure the message is added to the messages array first
        if (imageBase64) {
            setTimeout(() => {
                const latestMessages = chatHook.messages;
                const lastUserMessage = latestMessages.findLast(m => m.role === 'user');
                if (lastUserMessage && pendingImageForDisplay.current) {
                    setMessageImages(prev => ({
                        ...prev,
                        [lastUserMessage.id]: `data:image/jpeg;base64,${pendingImageForDisplay.current}`
                    }));
                    pendingImageForDisplay.current = null;
                }
            }, 100);
        }
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
            <ChatMessages messages={messages} isLoading={isStreaming} agentName={agentData.name} messageImages={messageImages} />
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
