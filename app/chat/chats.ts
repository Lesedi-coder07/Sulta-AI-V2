import { collection, deleteDoc, setDoc, updateDoc } from "firebase/firestore";

import { doc } from "firebase/firestore";
import { db } from "../api/firebase/firebaseConfig";

    export async function createNewChat(userId: string, agentId: string) {
    try {
        const newChatRef = doc(collection(db, 'chats'));
        const newChat = {
            chatID: newChatRef.id,
            userID: userId,
            agentID: agentId,
            messages: [],
            title: 'New Thread',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
            metadata: {
                model: 'gemini-3-flash-preview',
                temperature: 0.7
            },
            lastMessageAt: new Date().toISOString(),
        };

        await setDoc(newChatRef, newChat);
        return newChatRef.id;
      
    } catch (error) {
        console.error('Error creating new chat: ', error);
    }
}


export async function updateChatTitle(chatId: string, title: string) {
    try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, { title: title });
    } catch (error) {
        console.error('Error updating chat title: ', error);
    }
}

export async function deleteChat(chatId: string) {
    try {
        const chatRef = doc(db, 'chats', chatId);
        await deleteDoc(chatRef);
        console.log('Chat deleted successfully');
    } catch (error) {
        console.error('Error deleting chat: ', error);
    }
}
