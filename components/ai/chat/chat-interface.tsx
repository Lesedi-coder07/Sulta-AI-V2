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
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isNewChat, setIsNewChat] = useState<boolean>(true);
    const hasSentFirstMessage = useRef<boolean>(false);
    const pendingImage = useRef<string | null>(null);
    const [thinkEnabled, setThinkEnabled] = useState<boolean>(false);

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
                const isNewChatRequest = !hasSentFirstMessage.current;
                const imageToSend = pendingImage.current;
                // Clear the pending image after capturing it for the request
                pendingImage.current = null;
                return {
                    body: {
                        system: systemMessage,
                        messages: uiMessages,
                        chatId: id,
                        agentId: agent_id,
                        newChat: isNewChatRequest,
                        imageBase64: imageToSend,
                        thinkEnabled,
                    },
                };
            }
        }),
    });
    const { messages, sendMessage, status } = chatHook;

    const handleNewMessage = (message: string, imageBase64?: string | null) => {

        const localIsNewChat = !hasSentFirstMessage.current;
        setIsNewChat(localIsNewChat);

        console.log('handleNewMessage called with:', { message, hasImage: !!imageBase64 });
        if (imageBase64) {
            console.log('Image base64 length:', imageBase64.length);
            console.log('Image base64 prefix:', imageBase64.substring(0, 50));
        }

        if (localIsNewChat) {
            hasSentFirstMessage.current = true;
            sessionStorage.setItem('isNewChat', 'false');
        }

        // Store the image in the ref so the transport can access it
        // Also save it for display in the UI
        if (imageBase64) {
            pendingImage.current = imageBase64;
            // Store image for UI display - we'll use the next message ID
            setPendingImageForUI(imageBase64);
        }

        // Send the message - image goes through pendingImage ref to the transport body
        sendMessage({ text: message });
    }

    // State to track images for UI display
    const [messageImages, setMessageImages] = useState<Record<string, string>>({});
    const [pendingImageForUI, setPendingImageForUI] = useState<string | null>(null);

    // When a new user message appears, associate the pending image with it
    useEffect(() => {
        if (pendingImageForUI && messages.length > 0) {
            const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
            if (lastUserMessage && !messageImages[lastUserMessage.id]) {
                setMessageImages(prev => ({
                    ...prev,
                    [lastUserMessage.id]: pendingImageForUI
                }));
                setPendingImageForUI(null);
            }
        }
    }, [messages, pendingImageForUI, messageImages]);

    const isStreaming = status === 'submitted' || status === 'streaming';

    useEffect(() => {
        console.log('Chat status:', status);
        console.log('Messages count:', messages.length);
        console.log('Is streaming:', isStreaming);

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

        exists ? (<div className="flex h-screen flex-col bg-neutral-50 dark:bg-neutral-900">
            <ChatHeader handleSidebarToggle={handleSidebarToggle} showImage={false} agent={agent} showButton={true} />
            <ChatMessages messages={messages} isLoading={isStreaming} messageImages={messageImages} />
            <ChatInput
                sendMessage={(message: string, imageBase64?: string | null) => handleNewMessage(message, imageBase64)}
                thinkEnabled={thinkEnabled}
                onThinkToggle={setThinkEnabled}
            />
        </div>) : <h1 className="text-center mt-36 text-4xl font-bold">Agent not found <br /></h1>
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