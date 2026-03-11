
import { ChatInterface } from "@/components/ai/chat/chat-interface";
import { Metadata } from "next";
import * as admin from 'firebase-admin';
import { Agent } from "@/types/agent";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export const metadata: Metadata = {
  title: 'AI Agent - Sulta AI',
  description: 'Custom AI Agent - Text',
  icons: {
    icon: "/logos/Sulta/fav.png",
    shortcut: { url: "/logos/Sulta/fav.png" }
},
}

async function getAgentData(agentId: string): Promise<Agent | null> {
  try {
    const docRef = db.collection('agents').doc(agentId);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      const agentData = docSnap.data() as Agent;
      return {
        ...agentData,
        id: agentId
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching agent data:', error);
    return null;
  }
}

export default async function ChatPage({params}: {params: {slug: string}}) {
  const agentData = await getAgentData(params.slug);

  if (!agentData) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-100">
            Agent Not Found
          </h1>
          <p className="text-slate-400">
            The agent you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return( 
    <>
      <ChatInterface agent_id={params.slug} agentData={agentData} />
    </>
  );
}
