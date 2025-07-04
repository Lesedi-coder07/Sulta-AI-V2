"use client";

import { useState, useEffect } from "react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Message } from "@/types/chat";
import { auth, db } from '@/app/api/firebase/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export interface Agent {
    isPublic: boolean;
    ownerID: string;
    systemMessage: string;
    totalQueries: number;
    tokensUsed: number;
    totalChats: number;
    name: string;
}


export function ChatInterface({ agent_id }: { agent_id: string }) {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [exists, setExists] = useState<false | true>(true);
    const [agent, setAgent] = useState<Agent >();
    const [loading, setLoading] = useState<boolean>(false);
    const [profileImage, setProfileImage ] = useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)


    useEffect( ()  => {
        async function checkAgent() {
            const agentRef = doc(db, 'agents', agent_id)
            let snapshot = await getDoc(agentRef)
            if(snapshot.exists()) {
                setExists(true)
                setAgent(snapshot.data() as Agent)
                console.log(agent)
                if (agent?.isPublic == false) {
                    if (agent.ownerID != currentUser) {
                       setExists(false)
                    }
                }
            } else {
                setExists(false)
            }
        }


        checkAgent()
    
    })

    
    


    const [messages, setMessages] = useState<Message[]>([
        // {
        //     id: "1",
        //     role: "assistant",
        //     content: "Hello! How can I assist you today?",
        //     timestamp: "just now",
        // },
    ]);


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




    const handleSendMessage = async (content: string, base64String: string | null, image: string | null, docUrl: string | null, powerUpSelected: string | null) => {
      console.log(agent?.systemMessage)

        setLoading(true)
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: "just now",
            image: null
        };
        setMessages((prev) => [...prev, userMessage]);

        

        try {
          
    
            const aiMessage = await generateWithGemini(messages, agent?.systemMessage ?? 'You are a helpful AI agent.', content, auth.currentUser?.displayName ?? '');
            setLoading(false)
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: aiMessage.response,
                timestamp: "just now",
                image: aiMessage.imageUrl?.imageUrl ?? null,
                docUrl: null
            }]);
    
        } catch (error) {
            console.error(error);
            // You might want to show an error message to the user here
        }
        setLoading(false)
       
    };

    const handleSidebarToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    }


    return (

        exists ?   (<div className="flex h-screen flex-col bg-neutral-50 dark:bg-neutral-900">
            <ChatHeader handleSidebarToggle={handleSidebarToggle} showImage={false} agent={agent} showButton={true} />
            <ChatMessages updateMessageArray={handleSendMessage} messages={messages} profileImage={profileImage} loadingState={loading} agentName={agent?.name ?? 'Xev 1.0'} />
            <ChatInput handleSendMessage={handleSendMessage} />
        </div> ) : <h1 className="text-center text-2xl">Agent not found</h1>
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