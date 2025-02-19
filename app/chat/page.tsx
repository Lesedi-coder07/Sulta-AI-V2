'use client'
import { ChatInterface } from "@/components/ai/chat/chat-interface";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { ChatHeader } from "@/components/ai/chat/chat-header";
import { ChatInput } from "@/components/ai/chat/chat-input";
import { ChatMessages } from "@/components/ai/chat/chat-messages";
import { Agent } from "@/components/ai/chat/chat-interface";
import { Message } from "@/types/chat";
import { generateWithGemini } from "@/components/ai/chat/chat-interface";
import { auth } from "../api/firebase/firebaseConfig";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";



export default function ChatPage() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [profileImage, setProfileImage ] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([
        // {
        //     id: "1",
        //     role: "assistant",
        //     content: "Hello! How can I assist you today?",
        //     timestamp: "just now",
        // },
    ]);

    const xevronSystemMessage = `You are Xev 1.0, a helpful and capable AI agent developed by Sulta Tech, a South African software company founded by Lesedi David Rammutla and Mmakopano Kgaditswe. The team is young, talented, and passionate about making beautiful software and AI accessible to everyone.

You’re part of Sulta AI, a no-code platform that lets businesses build custom AI agents to automate tasks, boost productivity, and enhance operations—all without writing code. Users can deploy their agents on their websites for free.

While some of your advanced abilities are still in development, Xev may soon be able to send emails, reply to social media messages in a human-like way, and offer real-time investment advice and signals.

You are currently available on the Sulta AI web app, where users are chatting with you. Helpful links:
	•	Main Website: sultatech.com
	•	Sulta AI: ai.sultatech.com
	•	Bookings & Enquiries: sultatech.com/book

Tone & Style Guidelines:
    
    • Try to not talk about Sulta AI or the Sulta Tech randomly. Only Mention it when a user asks about it. Try to be a helpful agent first

	•	When asked “Who are you?” or similar, provide a brief intro without overexplaining unless the user asks for more details.

Your goal: Be helpful, efficient, and human-like in every interaction.
    `
  

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

    
    const handleSendMessage = async (content: string) => {





        setLoading(true)
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: "just now",
        };
        setMessages((prev) => [...prev, userMessage]);

        
       
            // Simulate API delay
            // await new Promise(resolve => setTimeout(resolve, 1000));

            // const dummyResponse = {
            //     content: `I am a simulated AI response. You said: "${content}"\n\nThis is a placeholder response for testing purposes. In production, this would be replaced with the actual API call.`
            // };

            // setLoading(false);
            // setMessages((prev) => [...prev, {
            //     id: (Date.now() + 1).toString(),
            //     role: "assistant", 
            //     content: dummyResponse.content,
            //     timestamp: "just now",
            // }]);


        try {
            // const response = await fetch('/api/LLM/openai', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         previousMessages: messages,
            //         currentUser: auth.currentUser?.displayName,
            //         prompt: content,
            //         systemMessage: agent?.systemMessage
            //     })
            // });
    
            // if (!response.ok) {
            //     throw new Error('Failed to get AI response');
            // }
    
            const aiMessage = await generateWithGemini(messages, xevronSystemMessage, content, auth.currentUser?.displayName ?? '');
            setLoading(false)
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: aiMessage,
                timestamp: "just now",
            }]);
    
        } catch (error) {
            console.error(error);
            // You might want to show an error message to the user here
        }
        setLoading(false)
       
    };

  return( 
    // <SidebarProvider>
    //     <AppSidebar /> 
        <main>
            {/* <SidebarTrigger /> */}
            <div>
            <div className="flex h-screen flex-col bg-neutral-50 dark:bg-neutral-900">
            <ChatHeader showImage={true} showButton={false} agent={{name: 'Xev 1.0'}} />
            <ChatMessages updateMessageArray={handleSendMessage} messages={messages} profileImage={profileImage} loadingState={loading} />
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
            </div>
        </main>
    // </SidebarProvider>
  


);
}