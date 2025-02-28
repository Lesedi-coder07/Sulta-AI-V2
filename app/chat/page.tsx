'use client'
import { ChatInterface } from "@/components/ai/chat/chat-interface";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { ChatHeader } from "@/components/ai/chat/chat-header";
import { ChatInput, writeMessageToDb } from "@/components/ai/chat/chat-input";
import { ChatMessages } from "@/components/ai/chat/chat-messages";
import { Agent } from "@/components/ai/chat/chat-interface";
import { Chat, Message } from "@/types/chat";
import { generateWithGemini } from "@/components/ai/chat/chat-interface";
import { auth } from "../api/firebase/firebaseConfig";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, onSnapshot, getDocs, getDoc,  where, query, orderBy } from 'firebase/firestore';
import { db } from "@/app/api/firebase/firebaseConfig";
import { Plus, MessageSquare } from "lucide-react";
import Image from "next/image";
import { createNewChat } from "./chats";



export default function ChatPage() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([

    
        // {    
        //     id: "1",
        //     role: "assistant",
        //     content: "Hello! How can I assist you today?",
        //     timestamp: "just now",
        // },
    ]);
    const [chatList, setChatList] = useState<Chat[]>([])
    const [chat, setChat] = useState<Chat>()

    useEffect(() => {
        if (!currentUser) return;
        
        const chatListRef = collection(db, 'chats');
        const q = query(
            chatListRef, 
            where('userID', '==', currentUser),
            orderBy('lastMessageAt', 'asc')
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map((doc) => doc.data() as Chat);
            setChatList(chats);
            if (!chat && chats.length > 0) {
                setChat(chats[0]);
            }
        });
        
        return () => unsubscribe();
    }, [currentUser, chat]);


    


    const defaultChatConfig = {
        agentID: 'bdjfweohwnon3082482764',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        lastMessageAt: new Date().toISOString(),
        title: 'New Thread',
    }
    

    // This is the effect that listens to the chat messages
    useEffect(() => {
        if (chat) {
            const messagesRef = collection(doc(db, 'chats', chat.chatID!), 'messages')
            const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
                const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Message))
                console.log(messages)
                console.log(chat)
                setMessages(messages)
            })
            return () => unsubscribe()
        }
    }, [chat])


    const xevronSystemMessage = `You are Xev 1.0, a helpful and capable AI agent developed by Sulta Tech, a South African software company founded by Lesedi David Rammutla and Mmakopano Kgaditswe. The team is young, talented, and passionate about making beautiful software and AI accessible to everyone.

You're part of Sulta AI, a no-code platform that lets businesses build custom AI agents to automate tasks, boost productivity, and enhance operations—all without writing code. Users can deploy their agents on their websites for free.

While some of your advanced abilities are still in development, Xev may soon be able to send emails, reply to social media messages in a human-like way, and offer real-time investment advice and signals.

You are currently available on the Sulta AI web app, where users are chatting with you. Helpful links:
	•	Main Website: sultatech.com
	•	Sulta AI: ai.sultatech.com
	•	Bookings & Enquiries: sultatech.com/book

Tone & Style Guidelines:
    
    • Try to not talk about Sulta AI or the Sulta Tech randomly. Only Mention it when a user asks about it. Try to be a helpful agent first

	•	When asked "Who are you?" or similar, provide a brief intro without overexplaining unless the user asks for more details.

Your goal: Be helpful, efficient, and human-like in every interaction.

Abilities and Features:

     You do have the ability to look at and understand images and documents.
     You do not have the ability to generate images.
     
    `




// This is the effect that listens to the user's auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user.uid);
                setProfileImage(user.photoURL);
                // Check if user has any chats, if not create one
                const userChatsQuery = query(
                    collection(db, 'chats'),
                    where('userID', '==', user.uid)
                );
                getDocs(userChatsQuery).then((snapshot) => {
                    if (snapshot.empty) {
                        handleNewChat();
                    }
                });
            } else {
                setCurrentUser(null);
            }
        })
        return () => unsubscribe()
    }, []);

  const handleChatSelect = async (selectedChat: Chat) => {
    setChat(selectedChat);
    setMessages([]); // Clear messages before loading new ones
    await fetchMessages(selectedChat.chatID!);
  };


// This is the function that handles the sending of messages
    const handleSendMessage = async (content: string, base64String: string | null = null, image: string | null = null) => {
        setLoading(true);
        if (!chat?.chatID) {
            const chatID = await createNewChat(currentUser ?? '', 'bdjfweohwnon3082482764');
            setChat({ chatID, ...defaultChatConfig, userID: currentUser ?? '' } as Chat);
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: "just now",
            image: image
        };

        // Update messages array with user message
        setMessages(prev => [...prev, userMessage]);
        
        // Save to database
        await writeMessageToDb(chat?.chatID!, userMessage.content, "user", image);

        try {
            const aiMessage = await generateWithGemini(messages, xevronSystemMessage, content, auth.currentUser?.displayName ?? '', base64String);
            const aiMessageObj = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: aiMessage,
                timestamp: "just now",
                image: null
            };
            
            // Update messages locally
            setMessages(prev => [...prev, aiMessageObj as Message]);
            
            // Save to database
            await writeMessageToDb(chat?.chatID!, aiMessage, "assistant", image);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };


    
const handleNewChat = async () => {
   const chatID = await createNewChat(currentUser ?? '', 'bdjfweohwnon3082482764')
    setChatList([...chatList, {
        chatID: chatID,
        title: 'New Thread',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        metadata: {
            model: 'gemini-pro',
            temperature: 0.7
        },
        lastMessageAt: new Date().toISOString(),
        userID: currentUser ?? '',
        agentID: 'bdjfweohwnon3082482764',
        
    }])
    setChat(chatList[chatList.length - 1])
}

// Function to fetch messages for a chat
const fetchMessages = async (chatId: string) => {
    try {
        const messagesRef = collection(doc(db, 'chats', chatId), 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const snapshot = await getDocs(q);
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Message));
        setMessages(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

    return (
        // <SidebarProvider>
        //     <AppSidebar /> 
        <main>
            {/* <SidebarTrigger /> */}
            <div className="flex flex-row flex-nowrap  bg-red w-screen">

                <aside className="hidden md:block z-10 md:w-64 bg-neutral-100 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                    <div className="flex flex-col h-full p-3">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Threads</h2>
                            {/* <Image src={"/logos/sulta/logoLight.png"}  width={150} height={150} alt="Sulta AI Logo"/> */}
                            <button className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors">
                                <Plus className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto space-y-1">
                            {chatList.map((chatItem) => (
                                <div key={chatItem.chatID} className="px-1">
                                    <button
                                        onClick={() => handleChatSelect(chatItem)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left ${
                                            chat?.chatID === chatItem.chatID 
                                                ? 'bg-neutral-200 dark:bg-neutral-700' 
                                                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-sm font-medium truncate">{chatItem.title}</span>
                                    </button>
                                </div>
                            ))}
                        </nav>
                        <div className="pt-4 px-2">
                            <button onClick={() => handleNewChat()} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors">
                                <Plus className="h-5 w-5" />
                                New Thread
                            </button>
                        </div>
                    </div>
                </aside>

                <div className=" shadow-sm flex rounded-md h-screen max-w-full w-full flex-col bg-peach-500 dark:bg-neutral-900">
                    <ChatHeader showImage={false} showButton={false} agent={{ name: 'Xev 1.0' }} />
                    <ChatMessages updateMessageArray={handleSendMessage} messages={messages} profileImage={profileImage} loadingState={loading} />
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
            </div>
        </main>

        // </SidebarProvider>



    );
}


