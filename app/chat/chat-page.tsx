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
import { db, analytics } from "@/app/api/firebase/firebaseConfig";
import { Plus, MessageSquare, Menu, LayoutDashboard,Pencil, Bot, Settings, Trash } from "lucide-react";
import Image from "next/image";
import { createNewChat, updateChatTitle, deleteChat } from "./chats";
import { xevronSystemMessage } from "./xev";
import { toast } from 'sonner'
import Link from "next/link";
import { logEvent, getAnalytics } from "firebase/analytics";
import { useTheme } from "next-themes";



export default function ChatPage() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatList, setChatList] = useState<Chat[]>([])
    const [chat, setChat] = useState<Chat | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    const {theme, systemTheme} = useTheme()
    const [hoveringId, setHoveringId] = useState<string | null>(null);
useEffect(() => {
    console.log(hoveringId)
}, [hoveringId])
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
            const sortedChats = chats.sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
            setChatList(sortedChats);
            if (!chat && chats.length > 0) {
                setChat(chats[0]);
                fetchMessages(chats[0].chatID!);
            }
        });
        
        return () => unsubscribe();
    }, [currentUser, chat]);


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
    


    const defaultChatConfig = {
        agentID: 'bdjfweohwnon3082482764',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        lastMessageAt: new Date().toISOString(),
        title: 'New Thread',
    }
    

    // // This is the effect that listens to the chat messages
    // useEffect(() => {
    //     if (chat) {
    //         const messagesRef = collection(doc(db, 'chats', chat.chatID!), 'messages')
    //         const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
    //             const messages = snapshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 ...doc.data()
    //             } as Message))
    //             console.log(messages + "running from useEffect")
    //             console.log(chat)
    //             setMessages(messages)
    //         })
    //         return () => unsubscribe()
    //     }
    // }, [chat])


 

    const handleSidebarToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    }





  const handleChatSelect = async (selectedChat: Chat) => {
    if (!currentUser) {
        toast.error('Please log in to create a new thread', {
            description: 'Authentication required'
        })
        return;
    }
    setChat(selectedChat);
    setMessages([]); // Clear messages before loading new ones
    
    if (currentUser) {
    await fetchMessages(selectedChat.chatID!); }
  };


// This is the function that handles the sending of messages
    const handleSendMessage = async (content: string, base64String: string | null = null, image: string | null = null, docUrl: string | null = null, powerUpSelected: string | null = null) => {
        setLoading(true);
        if (!chat?.chatID) {
            const chatID = await createNewChat(currentUser ?? '', 'bdjfweohwnon3082482764');
            setChat({ chatID, ...defaultChatConfig, userID: currentUser ?? '' } as Chat);
            
        }

        if (messages.length === 0 && chat) {
            chat.title = content;
            await updateChatTitle(chat.chatID!, content);
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: "just now",
            image: image,
            docUrl: docUrl,
         
        };

        // Update messages array with user message
        setMessages(prev => [...prev, userMessage]);
        
       

        try {
            const aiMessage  = await generateWithGemini(messages, xevronSystemMessage, content, auth.currentUser?.displayName ?? '', base64String, null,powerUpSelected);
            const aiMessageObj = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: aiMessage.response ?? 'Sorry, I couldn\'t generate a response.',
                timestamp: "just now",
                image: aiMessage.imageUrl?.imageUrl ?? null,
                docUrl: null,
            };
            console.log('AI Image URL --> ', aiMessage.imageUrl)
            
            // Update messages locally
            setMessages(prev => [...prev, aiMessageObj as Message]);
            
            // Save to database
            await writeMessageToDb(chat?.chatID!, userMessage.content, "user", image, docUrl);
            await writeMessageToDb(chat?.chatID!, aiMessage.response, "assistant", aiMessage.imageUrl?.imageUrl ?? null, docUrl);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }

         // Save to database
       

        setLoading(false);
        logEvent(analytics, 'message_sent', {
            chat_id: chat?.chatID,
            message_length: content.length,
            // Add any other relevant properties you want to track
        });
        
    }; 


    
const handleNewChat = async () => {
    if (!currentUser) {
        toast.error('Please log in to create a new thread', {
            description: 'Authentication required'
        })
        return;
    }
    
    const chatID = await createNewChat(currentUser, 'bdjfweohwnon3082482764')

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
    setChat(chatList[0])
    handleChatSelect(chatList[0])
    console.log(chatList[0])
}

const handleDeleteChat = async (chatID: string) => {
    await deleteChat(chatID)
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
        <main className="overflow-hidden">
            <div className="flex flex-row flex-nowrap overflow-hidden w-screen">
                {/* Mobile slide-out drawer */}
                <aside className="fixed inset-y-0 left-0 md:hidden transform transition-transform duration-300 ease-in-out z-50 w-64 bg-neutral-100 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                    style={{ transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
                    <div className="flex flex-col h-full p-3">
                        <div className="flex items-center justify-between mb-6 px-2">
                        <Link href="/ai/dashboard">
                            <Image src={systemTheme === 'dark' ? "/logos/Sulta/White.png" : "/logos/Sulta/LogoDark.png"} width={150} height={150} alt="Sulta AI Logo" />
                            </Link>
                            {/* <Image src={"/logos/sulta/logoLight.png"}  width={150} height={150} alt="Sulta AI Logo"/> */}
                           
                        </div>

                        <div className="flex flex-col gap-1 mb-4 px-2">
                            <Link href="/ai/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                    <LayoutDashboard className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>

                            <Link href="/ai/create" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <span className="text-sm font-medium">Create Agent</span>
                            </Link>

                            <Link href="ai/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                    <Settings className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                        </div>
                        
                        <nav className="flex-1 overflow-y-auto space-y-1">
                            {chatList.length === 0 && (
                                <div className="px-3 py-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                                    <p className="text-sm text-neutral-500 font-medium">No threads yet</p>
                                    {currentUser === null && (
                                    <div className="mt-3">
                                        <p className="text-sm text-neutral-500">
                                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                                Sign in
                                            </Link>
                                            {" "}to start a new thread
                                        </p>
                                    </div>
                                )}
                                </div>
                               
                            )}


{chatList.length != 0 && (
                                <div className="px-3 py-4 ">
    <h1 className="text-sm font-medium">Threads</h1>

                                    {/* <div className="flex justify-between items-center mt-5 mb-4">
                                    
                                        <button
                                            onClick={() => setHoveringId(hoveringId ? null : 'all')}
                                            className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Edit Thread List
                                        </button>
                                    </div> */}
                                </div>
                            
                            )}
                            {chatList.map((chatItem) => (
                                <div key={chatItem.chatID} className="px-1 ">
                                    
                                    <button
                                        onClick={() => {
                                            handleChatSelect(chatItem);
                                            setIsDrawerOpen(false);
                                        }}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left ${
                                            chat?.chatID === chatItem.chatID 
                                                ? 'bg-neutral-200 dark:bg-neutral-700' 
                                                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        <div 
                                            onMouseEnter={() => setHoveringId(chatItem.chatID!)} 
                                            onMouseLeave={() => setHoveringId(null)} 
                                            className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                                        >
                                            <MessageSquare className={`h-4 w-4 ${hoveringId === chatItem.chatID ? 'hidden' : 'text-blue-600 dark:text-blue-400'}`} />
                                            {/* {hoveringId === chatItem.chatID && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteChat(chatItem.chatID!);
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </button>
                                               
                                            )} */}


                                            {/* Add this feature back in on mobile soon. */}
                                             {/* <Trash className="h-4 w-4 text-blue-600 dark:text-blue-400" /> */}
                                        </div>
                                        <span className="text-sm font-medium truncate">{chatItem.title}</span>
                                    </button>
                                </div>
                            ))}
                        </nav>
                        <div className="pt-4 px-2">
                            <button onClick={() => {
                                handleNewChat();
                                setIsDrawerOpen(false);
                            }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium mb-7 py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors">
                                <Plus className="h-5 w-5" />
                                New Thread
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Overlay to close drawer when clicking outside */}
                {isDrawerOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                        onClick={() => setIsDrawerOpen(false)}
                    />
                )}

                {/* Desktop sidebar */}
                <aside className="hidden md:flex md:w-64 z-10 flex-col z-50 flex-shrink-0 h-screen sticky top-0 bg-neutral-100 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
                    <div className="flex flex-col h-full">
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <Link href="/ai/dashboard">
                                    <Image src={systemTheme === 'dark' ? "/logos/Sulta/White.png" : "/logos/Sulta/logoLight.png"} width={150} height={150} alt="Sulta AI Logo" priority />
                                </Link>
                                <button className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors">
                                    <Plus className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-1 mb-4 px-2">
                                <Link href="/ai/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                        <LayoutDashboard className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <span className="text-sm font-medium">Dashboard</span>
                                </Link>

                                <Link href="/ai/create" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <span className="text-sm font-medium">Create Agent</span>
                                </Link>

                                <Link href="ai/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                        <Settings className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <span className="text-sm font-medium">Settings</span>
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col">
                            <nav className="flex-1 overflow-y-auto px-3">
                                {chatList.length === 0 && (
                                    <div className="px-3 py-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                                        <p className="text-sm text-neutral-500 font-medium">No threads yet</p>
                                        {currentUser === null && (
                                            <div className="mt-3">
                                                <p className="text-sm text-neutral-500">
                                                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                                        Sign in
                                                    </Link>
                                                    {" "}to start a new thread
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {chatList.length > 0 && (
                                    <>
                                        <h1 className="text-sm font-medium mb-2">Threads</h1>
                                        <div className="space-y-1">
                                            {chatList.map((chatItem) => (
                                                <button
                                                    key={chatItem.chatID}
                                                    onClick={() => handleChatSelect(chatItem)}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left ${
                                                        chat?.chatID === chatItem.chatID 
                                                            ? 'bg-neutral-200 dark:bg-neutral-700' 
                                                            : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                                    }`}
                                                >
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                       
                                                    <div 
                                            onMouseEnter={() => setHoveringId(chatItem.chatID!)} 
                                            onMouseLeave={() => setHoveringId(null)} 
                                            className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                                        >
                                            <MessageSquare className={`h-4 w-4 ${hoveringId === chatItem.chatID ? 'hidden' : 'text-blue-600 dark:text-blue-400'}`} />
                                            {hoveringId === chatItem.chatID && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteChat(chatItem.chatID!);
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </button>
                                               
                                            )}
                                           
                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium truncate">{chatItem.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </nav>
                            
                            <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
                                <button 
                                    onClick={() => handleNewChat()} 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                    New Thread
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main chat area */}
                <div className="flex-1 flex flex-col h-screen bg-peach-500 dark:bg-neutral-900">
                    <ChatHeader showImage={false} handleSidebarToggle={handleSidebarToggle} showButton={false} agent={{ name: 'Xev 1.0' }} />
                    <ChatMessages agentName={'Xev 1.0'} updateMessageArray={handleSendMessage} messages={messages} profileImage={profileImage} loadingState={loading} />
                    <ChatInput handleSendMessage={handleSendMessage} />
                </div>
            </div>
        </main>
    );
}


